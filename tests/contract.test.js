// tests/contract.test.js — Contract Circuit & Ledger Tests
import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');
const CONTRACT_INFO_PATH = path.join(ROOT, 'contracts', 'managed', 'supply-chain', 'compiler', 'contract-info.json');

test('Contract Test: Managed contract artifact structure exists', () => {
  assert.ok(fs.existsSync(CONTRACT_INFO_PATH));
  const info = JSON.parse(fs.readFileSync(CONTRACT_INFO_PATH, 'utf-8'));
  assert.ok(Array.isArray(info.circuits));
  assert.ok(Array.isArray(info.ledger));
});

test('Contract Test: Circuit count equals 4', () => {
  const info = JSON.parse(fs.readFileSync(CONTRACT_INFO_PATH, 'utf-8'));
  assert.equal(info.circuits.length, 4);
});
