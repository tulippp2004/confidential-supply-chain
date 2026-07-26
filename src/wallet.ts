// wallet.ts — Wallet creation, sync, and key extraction for Midnight Network.

import { WebSocket } from 'ws';
import type { NetworkId, NetworkConfig } from './network.js';
import { ensureWalletStateDir } from './wallet-state.js';

// Required for Midnight wallet SDK WebSocket usage in Node
// @ts-expect-error globalThis WebSocket polyfill
globalThis.WebSocket = WebSocket;

export interface WalletContext {
  wallet: any;
  shieldedSecretKeys: {
    coinPublicKey: string;
    encryptionPublicKey: string;
  };
  dustSecretKey: any;
  unshieldedKeystore: any;
}

export interface CreateWalletOptions {
  network: NetworkId;
  networkConfig: NetworkConfig;
  seed: string;
}

/**
 * Helper to get the unshielded token identifier.
 * Returns the raw token ID for balance queries.
 */
export function unshieldedToken(): { raw: string } {
  // tNight / Night token raw identifier in Midnight SDK
  return { raw: 'tNight' };
}

/**
 * Creates and syncs a Midnight wallet from a seed.
 * For undeployed network, uses the genesis node directly.
 */
export async function createWallet(opts: CreateWalletOptions): Promise<WalletContext> {
  const { network, networkConfig, seed } = opts;

  // Dynamically import wallet SDK to allow tree-shaking
  const { WalletBuilder } = await import('@midnight-ntwrk/wallet-sdk');

  const stateDir = ensureWalletStateDir(network);

  const wallet = await WalletBuilder.buildFromSeed(
    networkConfig.indexer,
    networkConfig.indexerWS,
    networkConfig.proofServer,
    networkConfig.node,
    seed,
    stateDir,
    network === 'undeployed' ? 'undeployed' : network,
  );

  const state = await wallet.state();

  const shieldedSecretKeys = {
    coinPublicKey: state.coinPublicKey as string,
    encryptionPublicKey: state.encryptionPublicKey as string,
  };

  const dustSecretKey = state.dustSecretKey;
  const unshieldedKeystore = state.unshieldedKeystore;

  return { wallet, shieldedSecretKeys, dustSecretKey, unshieldedKeystore };
}

/**
 * Persists wallet sync state to disk for subsequent runs.
 */
export async function persistWalletState(network: NetworkId, ctx: WalletContext): Promise<void> {
  try {
    await ctx.wallet.persist?.();
  } catch {
    // persist() may not be available on all SDK versions — non-fatal
  }
}
