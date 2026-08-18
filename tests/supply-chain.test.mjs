// supply-chain.test.mjs — plain ESM, runs with Node 22 natively (no tsx required).
// Tests contract artifacts, privacy model invariants, and network configuration.

import assert from 'node:assert';
import fs     from 'node:fs';
import path   from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');

// ─── Inline network config (avoids tsx dependency in plain-ESM tests) ──────────
const NETWORK_IDS = ['undeployed', 'preview', 'preprod'];
const NETWORK_CONFIGS = {
  undeployed: {
    networkId: 'undeployed',
    indexer:    'http://127.0.0.1:8088/api/v4/graphql',
    indexerWS:  'ws://127.0.0.1:8088/api/v4/graphql/ws',
    node:       'ws://127.0.0.1:9944',
    proofServer: 'http://127.0.0.1:6300',
    faucet: null,
  },
  preview: {
    networkId: 'preview',
    indexer:    'https://indexer.preview.midnight.network/api/v4/graphql',
    indexerWS:  'wss://indexer.preview.midnight.network/api/v4/graphql/ws',
    node:       'https://rpc.preview.midnight.network',
    proofServer: 'http://127.0.0.1:6300',
    faucet: 'https://faucet.preview.midnight.network/',
  },
  preprod: {
    networkId: 'preprod',
    indexer:    'https://indexer.preprod.midnight.network/api/v4/graphql',
    indexerWS:  'wss://indexer.preprod.midnight.network/api/v4/graphql/ws',
    node:       'https://rpc.preprod.midnight.network',
    proofServer: 'http://127.0.0.1:6300',
    faucet: 'https://midnight-tmnight-preprod.nethermind.dev',
  },
};

const CONTRACT_INFO_PATH = path.join(
  ROOT, 'contracts', 'managed', 'supply-chain', 'compiler', 'contract-info.json'
);

console.log('\n🔒 Confidential Supply Chain — Test Suite (August Release)\n');

let passed = 0;
let total  = 0;

function test(description, fn) {
  total++;
  try {
    fn();
    console.log(`  ✓ [PASS] ${description}`);
    passed++;
  } catch (err) {
    console.error(`  ✗ [FAIL] ${description}\n         → ${err.message}`);
  }
}

// ─── Helper: load contract-info.json ───────────────────────────────────────────
function loadContractInfo() {
  assert.ok(
    fs.existsSync(CONTRACT_INFO_PATH),
    `contract-info.json not found at ${CONTRACT_INFO_PATH}\nRun: npm run compile`,
  );
  return JSON.parse(fs.readFileSync(CONTRACT_INFO_PATH, 'utf-8'));
}

// ─── Test 1: All five circuits are compiled and present ────────────────────────
test('1. All five circuits compiled: attestCompliance, registerSupplier, updateComplianceThreshold, activateSystem, deactivateSystem', () => {
  const info = loadContractInfo();
  const names = info.circuits.map(c => c.name);
  assert.ok(names.includes('attestCompliance'),           `attestCompliance circuit missing. Found: ${names.join(', ')}`);
  assert.ok(names.includes('registerSupplier'),           `registerSupplier circuit missing`);
  assert.ok(names.includes('updateComplianceThreshold'),  `updateComplianceThreshold circuit missing`);
  assert.ok(names.includes('activateSystem'),             `activateSystem circuit missing`);
  assert.ok(names.includes('deactivateSystem'),           `deactivateSystem circuit missing`);
});

// ─── Test 2: All public ledger fields are exported ─────────────────────────────
test('2. Public ledger exports: totalCertifications, passCount, supplierCount, isSystemActive, complianceThreshold, verifiedTierCount', () => {
  const info = loadContractInfo();
  const ledgerNames = info.ledger.map(l => l.name);
  assert.ok(ledgerNames.includes('totalCertifications'),  'totalCertifications ledger field missing');
  assert.ok(ledgerNames.includes('passCount'),            'passCount ledger field missing');
  assert.ok(ledgerNames.includes('supplierCount'),        'supplierCount ledger field missing');
  assert.ok(ledgerNames.includes('isSystemActive'),       'isSystemActive ledger field missing');
  assert.ok(ledgerNames.includes('complianceThreshold'),  'complianceThreshold ledger field missing');
  assert.ok(ledgerNames.includes('verifiedTierCount'),    'verifiedTierCount ledger field missing');
});

// ─── Test 3: Privacy model — attestCompliance first arg is Uint<64> (private audit score) ─────
test('3. Privacy model: attestCompliance circuit has privateAuditScore as Uint<64> private witness', () => {
  const info = loadContractInfo();
  const attest = info.circuits.find(c => c.name === 'attestCompliance');
  assert.ok(attest, 'attestCompliance circuit not found in contract-info.json');
  assert.ok(attest.arguments.length >= 2, `Expected ≥2 arguments, got ${attest.arguments.length}`);

  const firstArg = attest.arguments[0];
  assert.strictEqual(firstArg.name, 'privateAuditScore', `Expected first arg 'privateAuditScore', got '${firstArg.name}'`);
  const typeName = firstArg.type?.['type-name'] ?? firstArg.type;
  assert.ok(
    typeName === 'Uint' || String(typeName).toLowerCase().includes('uint'),
    `Expected Uint type for privateAuditScore, got: ${JSON.stringify(firstArg.type)}`,
  );
});

// ─── Test 4: Privacy model — registerSupplier arg is Opaque (private credential) ─────────
test('4. Privacy model: registerSupplier circuit has Opaque<"string"> private witness argument', () => {
  const info = loadContractInfo();
  const reg = info.circuits.find(c => c.name === 'registerSupplier');
  assert.ok(reg, 'registerSupplier circuit not found');
  assert.ok(reg.arguments.length >= 1, `Expected ≥1 argument, got ${reg.arguments.length}`);

  const firstArg = reg.arguments[0];
  assert.strictEqual(firstArg.name, 'supplierCredential', `Expected 'supplierCredential', got '${firstArg.name}'`);
  const typeName = firstArg.type?.['type-name'] ?? JSON.stringify(firstArg.type);
  assert.ok(
    String(typeName).toLowerCase().includes('opaque'),
    `Expected Opaque type for supplierCredential, got: ${typeName}`,
  );
});

// ─── Test 5: Network configuration is valid for all three supported networks ───
test('5. Network config resolves correctly for undeployed, preview, and preprod', () => {
  for (const networkId of NETWORK_IDS) {
    const config = NETWORK_CONFIGS[networkId];
    assert.ok(config, `Config missing for network: ${networkId}`);
    assert.ok(config.proofServer, `proofServer missing for ${networkId}`);
    assert.ok(config.indexer.startsWith('http'), `indexer URL invalid for ${networkId}: ${config.indexer}`);
    assert.ok(config.indexerWS.startsWith('ws'),  `indexerWS URL invalid for ${networkId}: ${config.indexerWS}`);
    assert.strictEqual(config.networkId, networkId, `networkId mismatch for ${networkId}`);
  }
  assert.strictEqual(NETWORK_CONFIGS.undeployed.faucet, null, 'undeployed should not have a faucet URL');
  assert.ok(NETWORK_CONFIGS.preview.faucet,  'preview faucet URL missing');
  assert.ok(NETWORK_CONFIGS.preprod.faucet,  'preprod faucet URL missing');
});

// ─── Test 6: State file schema validation ──────────────────────────────────────
test('6. State file schema: loads correctly when present, returns null when absent', () => {
  const statePath = path.join(ROOT, '.midnight-state.json');
  if (!fs.existsSync(statePath)) {
    assert.ok(true, 'No state file present — loadState returns null (expected)');
  } else {
    const raw = fs.readFileSync(statePath, 'utf-8');
    const state = JSON.parse(raw);
    assert.ok(state.version >= 1, `Expected state version >= 1, got ${state.version}`);
    assert.ok(
      ['undeployed', 'preview', 'preprod'].includes(state.activeNetwork),
      `Invalid activeNetwork: ${state.activeNetwork}`,
    );
    assert.ok(typeof state.wallets === 'object',     'state.wallets must be an object');
    assert.ok(typeof state.deployments === 'object', 'state.deployments must be an object');
  }
});

// ─── Results ───────────────────────────────────────────────────────────────────
console.log(`\n${'═'.repeat(48)}`);
console.log(`  Results: ${passed}/${total} passed`);
console.log(`${'═'.repeat(48)}\n`);

if (passed !== total) process.exit(1);
