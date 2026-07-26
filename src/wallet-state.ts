// wallet-state.ts — Wallet state persistence helpers.

import * as fs from 'node:fs';
import * as path from 'node:path';
import type { NetworkId } from './network.js';

const WALLET_STATE_DIR = '.midnight-wallet-state';

export function walletStatePath(network: NetworkId, cwd = process.cwd()): string {
  return path.join(cwd, WALLET_STATE_DIR, network);
}

export function ensureWalletStateDir(network: NetworkId, cwd = process.cwd()): string {
  const dir = walletStatePath(network, cwd);
  fs.mkdirSync(dir, { recursive: true });
  return dir;
}

export function getWalletStateDir(network: NetworkId, cwd = process.cwd()): string | undefined {
  const dir = walletStatePath(network, cwd);
  return fs.existsSync(dir) ? dir : undefined;
}
