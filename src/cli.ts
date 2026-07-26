/**
 * cli.ts — Interactive CLI for the Confidential Supply Chain Compliance Platform.
 * Usage: npm run cli [-- --network <undeployed|preview|preprod>]
 *
 * Allows attestors to register suppliers, submit confidential compliance
 * attestations, query the public ledger state, and check wallet balance.
 */

import { createInterface } from 'node:readline/promises';
import { stdin, stdout } from 'node:process';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { WebSocket } from 'ws';

import { levelPrivateStateProvider } from '@midnight-ntwrk/midnight-js-level-private-state-provider';
import { indexerPublicDataProvider } from '@midnight-ntwrk/midnight-js-indexer-public-data-provider';
import { NodeZkConfigProvider } from '@midnight-ntwrk/midnight-js-node-zk-config-provider';
import { httpClientProofProvider } from '@midnight-ntwrk/midnight-js-http-client-proof-provider';
import { findDeployedContract } from '@midnight-ntwrk/midnight-js-contracts';
import { CompiledContract } from '@midnight-ntwrk/midnight-js-protocol/compact-js';

import { createWallet, persistWalletState } from './wallet.js';
import { getNetworkConfig, getDeployment, parseNetworkFlag, GENESIS_SEED } from './network.js';

// @ts-expect-error WebSocket polyfill
globalThis.WebSocket = WebSocket;

const __filename = fileURLToPath(import.meta.url);
const __dirname  = path.dirname(__filename);

const PRIVATE_STATE_ID = GENESIS_SEED;
const SEED             = GENESIS_SEED;

const network       = parseNetworkFlag() ?? 'undeployed';
const networkConfig = getNetworkConfig(network);

async function createProviders(walletCtx: any) {
  const zkConfigPath = path.resolve(__dirname, '..', 'contracts', 'managed', 'supply-chain');
  const password = process.env.PRIVATE_STATE_PASSWORD?.trim() || 'Local-Devnet-SupplyChain-Placeholder-1';

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

  const zkConfigProvider = new NodeZkConfigProvider(zkConfigPath);
  const accountId = walletCtx.unshieldedKeystore.getBech32Address().toString();

  return {
    privateStateProvider: levelPrivateStateProvider({
      privateStateStoreName: 'supply-chain-state',
      accountId,
      privateStoragePasswordProvider: () => password,
    }),
    publicDataProvider: indexerPublicDataProvider(networkConfig.indexer, networkConfig.indexerWS),
    zkConfigProvider,
    proofProvider: httpClientProofProvider(networkConfig.proofServer, zkConfigProvider),
    walletProvider,
    midnightProvider: walletProvider,
  };
}

async function main() {
  console.log('\n╔════════════════════════════════════════════════════════════════╗');
  console.log('║     Confidential Supply Chain Compliance Platform — CLI        ║');
  console.log('╚════════════════════════════════════════════════════════════════╝\n');

  const rl = createInterface({ input: stdin, output: stdout });

  const deployment = getDeployment(network);
  if (!deployment) {
    console.error(`❌ No deployment on file for network '${network}'.`);
    console.error(`   Run: npm run setup -- --network ${network}\n`);
    process.exit(1);
  }

  console.log(`  Contract Address: ${deployment.address}`);
  console.log(`  Network:          ${network}\n`);

  try {
    console.log('  Connecting to wallet and syncing...');
    const walletCtx = await createWallet({ network, networkConfig, seed: SEED });
    const state = await walletCtx.wallet.waitForSyncedState();
    await persistWalletState(network, walletCtx);

    const balance = state?.unshielded?.balances?.['tNight'] ?? 0n;
    console.log(`  Wallet Balance: ${balance.toLocaleString()} tNight\n`);

    console.log('  Connecting to Midnight contract...');
    const providers = await createProviders(walletCtx);

    // Dynamic import after artifacts are confirmed to exist
    const SupplyChain = await import('../contracts/managed/supply-chain/contract/index.js');
    const compiledContract = (CompiledContract as any).make('supply-chain', (SupplyChain as any).Contract).pipe(
      (CompiledContract as any).withWitnesses({}),
    );

    const deployed: any = await findDeployedContract(providers, {
      compiledContract: compiledContract as any,
      contractAddress: deployment.address,
      privateStateId: PRIVATE_STATE_ID,
      initialPrivateState: {},
    });

    console.log('  ✅ Connected to Supply Chain contract!\n');

    let running = true;
    while (running) {
      console.log('─── Compliance Platform Menu ───────────────────────────────────');
      console.log('  1. View Public Ledger State (compliance summary)');
      console.log('  2. Activate Compliance System');
      console.log('  3. Register New Supplier (confidential)');
      console.log('  4. Attest Supplier Compliance (ZK proof — score stays private)');
      console.log('  5. Deactivate Compliance System');
      console.log('  6. Check Wallet Balance');
      console.log('  7. Exit\n');

      const choice = await rl.question('  Select option: ');

      switch (choice.trim()) {
        case '1': {
          console.log('\n  Querying public ledger from Midnight blockchain...');
          try {
            const contractState = await providers.publicDataProvider.queryContractState(deployment.address);
            if (contractState) {
              const ledger = (SupplyChain as any).ledger(contractState.data);
              const passRate = ledger.totalCertifications > 0n
                ? Math.round((Number(ledger.passCount) / Number(ledger.totalCertifications)) * 100)
                : 0;
              console.log('\n  ═══════════════════════════════════════════════════════════');
              console.log(`  System Status:       ${ledger.isSystemActive ? '🟢 ACTIVE' : '🔴 INACTIVE'}`);
              console.log(`  Registered Suppliers:  ${ledger.supplierCount}`);
              console.log(`  Total Attestations:    ${ledger.totalCertifications}`);
              console.log(`  Passed Compliance:     ${ledger.passCount} (${passRate}%)`);
              console.log('  ═══════════════════════════════════════════════════════════\n');
              console.log('  ℹ️  Individual audit scores are kept private via ZK proofs.');
              console.log('     Only aggregate compliance statistics are visible on-chain.\n');
            } else {
              console.log('\n  📋 Contract state is empty. Run activateSystem first.\n');
            }
          } catch (err) {
            console.error('\n  ❌ Query Error:', err instanceof Error ? err.message : err);
          }
          break;
        }

        case '2': {
          console.log('\n  Activating compliance system...');
          try {
            const tx = await deployed.callTx.activateSystem();
            console.log(`\n  ✅ System Activated!`);
            console.log(`  Tx ID: ${tx.public.txId}`);
            console.log(`  Block: ${tx.public.blockHeight}\n`);
          } catch (err) {
            console.error('\n  ❌ Activation Failed:', err instanceof Error ? err.message : err);
          }
          break;
        }

        case '3': {
          const credential = await rl.question('  Enter Supplier Credential (kept private): ');
          console.log('\n  Generating ZK proof for confidential supplier registration...');
          console.log('  (Credential is a private witness — never transmitted on-chain)');
          try {
            const tx = await deployed.callTx.registerSupplier(credential);
            console.log(`\n  ✅ Supplier Registered!`);
            console.log(`  Tx ID: ${tx.public.txId}`);
            console.log(`  Block: ${tx.public.blockHeight}`);
            console.log(`  Supplier credential: [PRIVATE — not visible on blockchain]\n`);
          } catch (err) {
            console.error('\n  ❌ Registration Failed:', err instanceof Error ? err.message : err);
          }
          break;
        }

        case '4': {
          const scoreStr = await rl.question('  Enter private audit score (0–100): ');
          const score = parseInt(scoreStr.trim(), 10);
          if (isNaN(score) || score < 0 || score > 100) {
            console.log('\n  ❌ Invalid score. Must be 0–100.\n');
            break;
          }
          const passes = score >= 75;
          console.log(`\n  Compliance threshold: 75/100`);
          console.log(`  Your score (private): [HIDDEN]`);
          console.log(`  Result (disclosed):   ${passes ? '✅ PASSES' : '❌ FAILS'}`);
          console.log('\n  Generating Zero-Knowledge Proof...');
          console.log('  (Actual score is never revealed — only pass/fail is disclosed)\n');
          try {
            const tx = await deployed.callTx.attestCompliance(BigInt(score), passes);
            console.log(`  ✅ Compliance Attestation Recorded!`);
            console.log(`  Tx ID: ${tx.public.txId}`);
            console.log(`  Block: ${tx.public.blockHeight}`);
            console.log(`  Audit score: [PRIVATE — kept confidential via ZK proof]\n`);
          } catch (err) {
            console.error('\n  ❌ Attestation Failed:', err instanceof Error ? err.message : err);
          }
          break;
        }

        case '5': {
          console.log('\n  Deactivating compliance system...');
          try {
            const tx = await deployed.callTx.deactivateSystem();
            console.log(`\n  ✅ System Deactivated.`);
            console.log(`  Tx ID: ${tx.public.txId}\n`);
          } catch (err) {
            console.error('\n  ❌ Deactivation Failed:', err instanceof Error ? err.message : err);
          }
          break;
        }

        case '6': {
          const currentState = await walletCtx.wallet.waitForSyncedState();
          const tNight = currentState?.unshielded?.balances?.['tNight'] ?? 0n;
          const dust   = currentState?.dust?.balance(new Date()) ?? 0n;
          console.log(`\n  tNight: ${tNight.toLocaleString()}`);
          console.log(`  DUST:   ${dust.toLocaleString()}\n`);
          break;
        }

        case '7':
          running = false;
          console.log('\n  👋 Goodbye!\n');
          break;

        default:
          console.log('\n  ❌ Invalid option.\n');
      }
    }

    await persistWalletState(network, walletCtx);
    await walletCtx.wallet.stop();
  } catch (err) {
    console.error('\n❌ Error:', err instanceof Error ? err.message : err);
  } finally {
    rl.close();
  }
}

main().catch(console.error);
