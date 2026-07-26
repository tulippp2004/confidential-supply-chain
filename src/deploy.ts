/**
 * deploy.ts — Deploy the supply-chain contract to a Midnight network.
 * Called by setup.ts; also runnable directly via `npm run deploy`.
 */

import * as fs from 'node:fs';
import * as path from 'node:path';
import { fileURLToPath } from 'node:url';
import { WebSocket } from 'ws';

import { deployContract } from '@midnight-ntwrk/midnight-js-contracts';
import { httpClientProofProvider } from '@midnight-ntwrk/midnight-js-http-client-proof-provider';
import { indexerPublicDataProvider } from '@midnight-ntwrk/midnight-js-indexer-public-data-provider';
import { levelPrivateStateProvider } from '@midnight-ntwrk/midnight-js-level-private-state-provider';
import { NodeZkConfigProvider } from '@midnight-ntwrk/midnight-js-node-zk-config-provider';
import { CompiledContract } from '@midnight-ntwrk/midnight-js-protocol/compact-js';

import { resolveNetwork, getOrCreateSeed, recordDeployment, type NetworkId, type NetworkConfig } from './network.js';
import { createWallet, persistWalletState } from './wallet.js';

// @ts-expect-error WebSocket polyfill for wallet SDK
globalThis.WebSocket = WebSocket;

const __filename = fileURLToPath(import.meta.url);
const __dirname  = path.dirname(__filename);

const PRIVATE_STATE_ID = 'supplyChainPrivateState';

export interface DeployOptions {
  network: NetworkId;
  networkConfig: NetworkConfig;
}

async function checkProofServer(url: string): Promise<boolean> {
  try {
    const res = await fetch(`${url}/health`);
    return res.ok;
  } catch {
    return false;
  }
}

async function deploy(opts: DeployOptions): Promise<void> {
  const { network, networkConfig } = opts;

  console.log('\n================================================================');
  console.log(`  Deploying supply-chain to: ${network.toUpperCase()}`);
  console.log('================================================================\n');
  console.log(`  Network ID:     ${networkConfig.networkId}`);
  console.log(`  Node URL:       ${networkConfig.node}`);
  console.log(`  Indexer URL:    ${networkConfig.indexer}`);
  console.log(`  Indexer WS:     ${networkConfig.indexerWS}`);
  console.log(`  Proof Server:   ${networkConfig.proofServer}\n`);

  // 1. Proof server health check
  const proofOk = await checkProofServer(networkConfig.proofServer);
  if (!proofOk) {
    if (network === 'undeployed') {
      console.error(`❌ Proof server not running at ${networkConfig.proofServer}`);
      console.error('   Start it with: npm run proof-server:start');
      console.error('   (Requires Docker Desktop with WSL integration enabled)\n');
    } else {
      console.error(`❌ Cannot reach proof server at ${networkConfig.proofServer}\n`);
    }
    process.exit(1);
  }
  console.log('  ✓ Proof server is ready.\n');

  // 2. Load compiled contract artifacts
  const zkConfigPath = path.resolve(__dirname, '..', 'contracts', 'managed', 'supply-chain');
  if (!fs.existsSync(zkConfigPath)) {
    console.error(`❌ Managed contract artifacts missing at ${zkConfigPath}`);
    console.error('   Run: npm run compile\n');
    process.exit(1);
  }

  // Dynamic import after artifact check
  const SupplyChain = await import('../contracts/managed/supply-chain/contract/index.js');

  const compiledContract = (CompiledContract as any).make('supply-chain', (SupplyChain as any).Contract).pipe(
    (CompiledContract as any).withWitnesses({}),
  );

  // 3. Wallet creation and sync
  const seed = getOrCreateSeed(network);
  console.log('  Creating wallet...');
  const walletCtx = await createWallet({ network, networkConfig, seed });

  const walletAddress = walletCtx.unshieldedKeystore.getBech32Address().toString();
  console.log(`  Wallet Address: ${walletAddress}\n`);

  console.log('  Syncing wallet with network...');
  const syncStart = Date.now();
  const syncInterval = setInterval(() => {
    const elapsed = Math.round((Date.now() - syncStart) / 1000);
    process.stdout.write(`\r  ⏳ Syncing... (${elapsed}s elapsed)   `);
  }, 5000);

  let walletState: any;
  try {
    const syncPromise = walletCtx.wallet.waitForSyncedState();
    if (network !== 'undeployed') {
      const timeout = new Promise<never>((_, reject) =>
        setTimeout(
          () => reject(new Error('Preprod wallet sync timeout (120s). Network may be congested.')),
          120_000,
        ),
      );
      walletState = await Promise.race([syncPromise, timeout]);
    } else {
      walletState = await syncPromise;
    }
    clearInterval(syncInterval);
    process.stdout.write('\r  ✓ Wallet synced.                                         \n\n');
  } catch (err: any) {
    clearInterval(syncInterval);
    console.error('\n  ❌ Wallet Sync Error:', err.message);
    if (network !== 'undeployed') {
      console.log('\n  ⚠ Sync blocked/timed out on Preprod.');
      console.log(`  ⚠ Fund this address via faucet: ${walletAddress}`);
      console.log(`  ⚠ Faucet URL: ${networkConfig.faucet}`);
      console.log('  ⚠ .midnight-state.json preserved — do NOT delete it after funding.\n');
      process.exit(1);
    }
    throw err;
  }

  await persistWalletState(network, walletCtx);

  const tNightBalance = walletState?.unshielded?.balances?.['tNight'] ?? 0n;
  console.log(`  Balance: ${tNightBalance.toLocaleString()} tNight`);

  if (tNightBalance === 0n && network !== 'undeployed') {
    console.error('\n❌ Wallet has 0 tNight. Fund via faucet before deploying:');
    console.error(`   ${networkConfig.faucet}`);
    console.error(`   Wallet Address: ${walletAddress}\n`);
    process.exit(1);
  }

  // 4. Create providers
  console.log('\n  Configuring Midnight providers...');
  const privateStatePassword =
    process.env.PRIVATE_STATE_PASSWORD?.trim() || 'Local-Devnet-SupplyChain-Placeholder-1';
  const zkConfigProvider = new NodeZkConfigProvider(zkConfigPath);
  const accountId = walletAddress;

  const walletProvider = {
    getCoinPublicKey: () => walletCtx.shieldedSecretKeys.coinPublicKey,
    getEncryptionPublicKey: () => walletCtx.shieldedSecretKeys.encryptionPublicKey,
    async balanceTx(tx: any, ttl?: Date) {
      const recipe = await walletCtx.wallet.balanceUnboundTransaction(
        tx,
        { shieldedSecretKeys: walletCtx.shieldedSecretKeys, dustSecretKey: walletCtx.dustSecretKey },
        { ttl: ttl ?? new Date(Date.now() + 30 * 60 * 1000) },
      );
      return walletCtx.wallet.finalizeRecipe(recipe);
    },
    submitTx: (tx: any) => walletCtx.wallet.submitTransaction(tx) as any,
  };

  const providers = {
    privateStateProvider: levelPrivateStateProvider({
      privateStateStoreName: 'supply-chain-state',
      accountId,
      privateStoragePasswordProvider: () => privateStatePassword,
    }),
    publicDataProvider: indexerPublicDataProvider(networkConfig.indexer, networkConfig.indexerWS),
    zkConfigProvider,
    proofProvider: httpClientProofProvider(networkConfig.proofServer, zkConfigProvider),
    walletProvider,
    midnightProvider: walletProvider,
  };

  // 5. Deploy contract
  console.log('  Submitting deploy transaction to Midnight network...');
  const deployStart = Date.now();

  const deployed: any = await (deployContract as any)(providers, {
    compiledContract: compiledContract as any,
    privateStateId: PRIVATE_STATE_ID,
    initialPrivateState: {},
    args: [],
  });

  const duration = Math.round((Date.now() - deployStart) / 1000);
  const contractAddress = deployed.deployTx.contractAddress;

  console.log('\n  ================================================================');
  console.log('  🎉 Deployment Successful!');
  console.log('  ================================================================');
  console.log(`  Contract Address: ${contractAddress}`);
  console.log(`  Deployment Time:  ${duration}s`);
  console.log(`  Network:          ${network}\n`);
  console.log(`  Add to frontend .env:`);
  console.log(`  VITE_CONTRACT_ADDRESS=${contractAddress}\n`);

  recordDeployment(network, contractAddress, walletAddress);
  await persistWalletState(network, walletCtx);
  await walletCtx.wallet.stop();
}

export default deploy;

// Allow direct execution: `npx tsx src/deploy.ts -- --network preprod`
if (
  process.argv[1] &&
  (process.argv[1].endsWith('deploy.ts') || process.argv[1].endsWith('deploy.js'))
) {
  const { resolveNetwork: rn } = await import('./network.js');
  const { network, config: networkConfig } = rn();
  await deploy({ network, networkConfig });
}
