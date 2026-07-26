/**
 * setup.ts — Entry point for `npm run setup`.
 * Parses --network flag and delegates to deploy.ts.
 */

import { resolveNetwork } from './network.js';

const { network, config: networkConfig, source } = resolveNetwork();

console.log('\n╔══════════════════════════════════════════════════════════╗');
console.log('║  Confidential Supply Chain Compliance Platform — Setup   ║');
console.log('╚══════════════════════════════════════════════════════════╝\n');
console.log(`  Network source: ${source}`);
console.log(`  Target network: ${network.toUpperCase()}\n`);

// Delegate to deploy
const { default: deploy } = await import('./deploy.js');
await deploy({ network, networkConfig });
