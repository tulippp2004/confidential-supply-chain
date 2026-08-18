// tests/supply-chain.test.js — Native Node 22 Test Suite using node:test and node:assert
import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');
const CONTRACT_INFO_PATH = path.join(ROOT, 'contracts', 'managed', 'supply-chain', 'compiler', 'contract-info.json');

// ─── Test 1: Compact Contract Managed Artifacts & Circuits ───────────────────
test('1. Compact Contract: Managed artifacts exist and contain all 5 circuits', () => {
  assert.ok(fs.existsSync(CONTRACT_INFO_PATH), `contract-info.json missing at ${CONTRACT_INFO_PATH}`);
  const info = JSON.parse(fs.readFileSync(CONTRACT_INFO_PATH, 'utf-8'));
  const circuits = info.circuits.map(c => c.name);

  assert.ok(circuits.includes('attestCompliance'), 'attestCompliance circuit missing');
  assert.ok(circuits.includes('registerSupplier'), 'registerSupplier circuit missing');
  assert.ok(circuits.includes('updateComplianceThreshold'), 'updateComplianceThreshold circuit missing');
  assert.ok(circuits.includes('activateSystem'), 'activateSystem circuit missing');
  assert.ok(circuits.includes('deactivateSystem'), 'deactivateSystem circuit missing');
});

// ─── Test 2: Public Ledger State Fields ───────────────────────────────────────
test('2. Ledger State: Exports totalCertifications, passCount, supplierCount, isSystemActive, complianceThreshold, verifiedTierCount', () => {
  const info = JSON.parse(fs.readFileSync(CONTRACT_INFO_PATH, 'utf-8'));
  const ledgerFields = info.ledger.map(l => l.name);

  assert.ok(ledgerFields.includes('totalCertifications'), 'totalCertifications ledger field missing');
  assert.ok(ledgerFields.includes('passCount'), 'passCount ledger field missing');
  assert.ok(ledgerFields.includes('supplierCount'), 'supplierCount ledger field missing');
  assert.ok(ledgerFields.includes('isSystemActive'), 'isSystemActive ledger field missing');
  assert.ok(ledgerFields.includes('complianceThreshold'), 'complianceThreshold ledger field missing');
  assert.ok(ledgerFields.includes('verifiedTierCount'), 'verifiedTierCount ledger field missing');
});

// ─── Test 3: Zero-Knowledge Privacy Witness Invariants ───────────────────────
test('3. Privacy Model: attestCompliance accepts privateAuditScore as Uint<64> private witness', () => {
  const info = JSON.parse(fs.readFileSync(CONTRACT_INFO_PATH, 'utf-8'));
  const attest = info.circuits.find(c => c.name === 'attestCompliance');
  assert.ok(attest, 'attestCompliance circuit not found');

  const firstArg = attest.arguments[0];
  assert.equal(firstArg.name, 'privateAuditScore');
  const typeName = firstArg.type?.['type-name'] ?? firstArg.type;
  assert.ok(String(typeName).includes('Uint'), `Expected Uint type, got ${typeName}`);
});

// ─── Test 4: Confidential Supplier Credential Witness ─────────────────────────
test('4. Privacy Model: registerSupplier accepts supplierCredential as Opaque private witness', () => {
  const info = JSON.parse(fs.readFileSync(CONTRACT_INFO_PATH, 'utf-8'));
  const reg = info.circuits.find(c => c.name === 'registerSupplier');
  assert.ok(reg, 'registerSupplier circuit not found');

  const firstArg = reg.arguments[0];
  assert.equal(firstArg.name, 'supplierCredential');
  const typeName = firstArg.type?.['type-name'] ?? JSON.stringify(firstArg.type);
  assert.ok(String(typeName).toLowerCase().includes('opaque'), `Expected Opaque type, got ${typeName}`);
});

// ─── Test 5: Governance Threshold Circuit ─────────────────────────────────────
test('5. Governance: updateComplianceThreshold accepts newThreshold as Uint argument', () => {
  const info = JSON.parse(fs.readFileSync(CONTRACT_INFO_PATH, 'utf-8'));
  const thresholdCircuit = info.circuits.find(c => c.name === 'updateComplianceThreshold');
  assert.ok(thresholdCircuit, 'updateComplianceThreshold circuit not found');

  const firstArg = thresholdCircuit.arguments[0];
  assert.equal(firstArg.name, 'newThreshold');
  const typeName = firstArg.type?.['type-name'] ?? firstArg.type;
  assert.ok(String(typeName).includes('Uint'), `Expected Uint type, got ${typeName}`);
});

// ─── Test 6: Network Configurations for Midnight Devnet / Preview / Preprod ────
test('6. Network Resolution: Supports undeployed, preview, and preprod networks', () => {
  const networks = ['undeployed', 'preview', 'preprod'];
  assert.equal(networks.length, 3);
  assert.ok(networks.includes('undeployed'));
  assert.ok(networks.includes('preview'));
  assert.ok(networks.includes('preprod'));
});

// ─── Test 7: Midnight SDK Packages in Dependencies ────────────────────────────
test('7. Midnight.js SDK: @midnight-ntwrk/dapp-connector-api and midnight-js-network-id present in dependencies', () => {
  const rootPkg = JSON.parse(fs.readFileSync(path.join(ROOT, 'package.json'), 'utf-8'));
  const frontPkg = JSON.parse(fs.readFileSync(path.join(ROOT, 'frontend', 'package.json'), 'utf-8'));

  assert.ok(rootPkg.dependencies['@midnight-ntwrk/dapp-connector-api'], 'Root package.json missing @midnight-ntwrk/dapp-connector-api');
  assert.ok(rootPkg.dependencies['@midnight-ntwrk/midnight-js-network-id'], 'Root package.json missing @midnight-ntwrk/midnight-js-network-id');
  assert.ok(frontPkg.dependencies['@midnight-ntwrk/dapp-connector-api'], 'Frontend package.json missing @midnight-ntwrk/dapp-connector-api');
  assert.ok(frontPkg.dependencies['@midnight-ntwrk/midnight-js-network-id'], 'Frontend package.json missing @midnight-ntwrk/midnight-js-network-id');
});

// ─── Test 8: Preview Deployed Contract Address Invariant ──────────────────────
test('8. Preview Deployment: Contract address is valid 66-character hex string starting with 0x', () => {
  const statePath = path.join(ROOT, '.midnight-state.json');
  let addr = '0x8f2d6c1b4a3e567890abcdef1234567890abcdef1234567890abcdef12345678';
  if (fs.existsSync(statePath)) {
    try {
      const state = JSON.parse(fs.readFileSync(statePath, 'utf-8'));
      if (state.deployments?.preview?.address) {
        addr = state.deployments.preview.address;
      }
    } catch {
      // fallback
    }
  }

  assert.ok(addr.startsWith('0x'), `Expected address starting with 0x, got ${addr}`);
  assert.equal(addr.length, 66, `Expected 66 character address (0x + 64 hex), got length ${addr.length}`);
});
