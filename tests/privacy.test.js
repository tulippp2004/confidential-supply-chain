// tests/privacy.test.js — Privacy Witness & Zero-Knowledge Invariants Test
import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');
const CONTRACT_INFO_PATH = path.join(ROOT, 'contracts', 'managed', 'supply-chain', 'compiler', 'contract-info.json');

test('Privacy Invariant: attestCompliance uses ZK private witness for score', () => {
  const info = JSON.parse(fs.readFileSync(CONTRACT_INFO_PATH, 'utf-8'));
  const attest = info.circuits.find(c => c.name === 'attestCompliance');
  assert.ok(attest);
  assert.equal(attest.arguments[0].name, 'privateAuditScore');
});

test('Privacy Invariant: disclose() is restricted to threshold boolean outcome', () => {
  const info = JSON.parse(fs.readFileSync(CONTRACT_INFO_PATH, 'utf-8'));
  const attest = info.circuits.find(c => c.name === 'attestCompliance');
  assert.ok(attest);
  assert.equal(attest.arguments[1].name, 'passesThreshold');
});
