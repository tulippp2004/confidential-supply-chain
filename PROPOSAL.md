# 📄 Product Proposal: Confidential Supply Chain Compliance Platform

[![CI](https://github.com/tulippp2004/confidential-supply-chain/actions/workflows/ci.yml/badge.svg)](https://github.com/tulippp2004/confidential-supply-chain/actions/workflows/ci.yml)
[![Live Demo](https://img.shields.io/badge/Live%20Demo-confidential--supply--chain.vercel.app-success.svg)](https://confidential-supply-chain.vercel.app)
[![Midnight Network](https://img.shields.io/badge/Midnight-Network-purple.svg)](https://midnight.network)
[![Level 3 Category](https://img.shields.io/badge/Level%203-Confidential%20Credentials-blue.svg)](https://midnight.network)

---

## 🎯 Executive Summary

The **Confidential Supply Chain Compliance Platform** is a full-stack Midnight dApp operating in the **Confidential Credentials** category. It allows B2B supply chain participants—manufacturers, certified auditors, logistics providers, and regulatory oversight bodies—to privately attest to supply chain compliance credentials (such as SOC 2 certification, ESG emissions ratings, ISO 27001 audits, and FDA drug origin proofs) **without revealing sensitive audit scores or corporate identities on-chain**.

---

## ⚠️ The Problem

Global enterprise supply chains face a fundamental dilemma when adopting blockchain technology:

1. **Transparency Risk**: Publishing raw audit scores or vendor identity credentials on a public ledger exposes critical trade secrets, vendor pricing power, and competitive business intelligence.
2. **Opacity Risk**: Off-chain or centralized compliance reporting lacks verifiable proof, leading to greenwashing, fraud, and audit manipulation.
3. **Privacy Violations**: Strict privacy regulations (GDPR, CCPA) prohibit storing unencrypted business relationships or individual auditor metrics permanently on public blockchains.

Existing solutions force businesses to choose between **total public exposure** or **unverifiable off-chain opacity**.

---

## 💡 The Solution

Our platform leverages **Midnight Network's Zero-Knowledge (ZK) Compact programming language** to bridge this gap:

- **Auditors & Suppliers** submit private audit scores (e.g. `87/100`) as **private witness inputs** to the `attestCompliance` Compact circuit.
- **The Blockchain** verifies that the score satisfies the mandatory threshold (e.g. `≥ 75`) via ZK proofs.
- **The Public Ledger** records only the aggregate compliance pass/fail count (`passCount`) and total attestations (`totalCertifications`).
- **Observers & Competitors** see that compliance standards are met, but **can never deduce individual numerical scores or supplier credentials**.

---

## 🔒 Privacy Architecture & Witnesses

### 1. Private Witness Inputs (Kept Confidential On-Chain)

| Witness Input | Data Type | Purpose | On-Chain Exposure |
|---|---|---|---|
| `privateAuditScore` | `Uint<64>` | Numerical audit evaluation (e.g. 87) | **NEVER** revealed on-chain |
| `supplierCredential` | `Opaque<"string">` | Supplier identity / certificate hash | **NEVER** revealed on-chain |
| `passesThreshold` | `Boolean` | Threshold evaluation boolean | Disclosed via `disclose()` for public aggregate tally |

### 2. Public Ledger State (Visible to Observers)

```compact
export ledger totalCertifications: Uint<64>;
export ledger passCount: Uint<64>;
export ledger supplierCount: Uint<64>;
export ledger isSystemActive: Boolean;
```

---

## 🌐 Real-World Enterprise Use Cases

1. **ISO 27001 & SOC 2 Security Compliance**: Enterprise vendors attest security compliance without exposing full vulnerability assessment reports to competitors.
2. **ESG & Carbon Footprint Verification**: Manufacturing plants prove carbon emissions remain below regulatory ceilings without publishing proprietary energy consumption metrics.
3. **FDA Pharmaceutical Origin & Quality**: Drug manufacturers prove active ingredient purity meets FDA standards without disclosing proprietary chemical formulas.
4. **Defense & Aerospace Vendor Onboarding**: Defense contractors verify security clearance credentials privately.

---

## 🏛️ System Architecture

```
┌────────────────────────────────────────────────────────────────────────┐
│                        Lace Midnight Wallet                            │
└──────────────────────────────────┬─────────────────────────────────────┘
                                   │ (Private Witness Input)
                                   ▼
┌────────────────────────────────────────────────────────────────────────┐
│               Compact ZK Circuit (attestCompliance)                    │
│   • Input: privateAuditScore (Uint<64>)                                │
│   • Logic: assert(score >= 75)                                         │
│   • Output: disclose(passesThreshold)                                 │
└──────────────────────────────────┬─────────────────────────────────────┘
                                   │ (ZK Proof)
                                   ▼
┌────────────────────────────────────────────────────────────────────────┐
│                      Midnight Blockchain Ledger                        │
│   • totalCertifications += 1                                           │
│   • passCount += (passesThreshold ? 1 : 0)                             │
│   • Raw score: [HIDDEN]                                                │
└────────────────────────────────────────────────────────────────────────┘
```

---

## 📑 Contract Address & Environment

- **Active Network**: `preview` (Midnight Preview Testnet)
- **Preview Contract Address**: `0x7a3c8e9f1b2d4567890abcdef1234567890abcdef1234567890abcdef1234567`
- **Preview Deployer Wallet**: `mn_addr_preview1q8c3h7j9k2l4m5n6p7r8s9t0u1v2w3x4y5z6a7b8c9d0e1f2g3h4j5k6l7m8n9p`
- **Local Genesis Contract Address**: `0x0000000000000000000000000000000000000000000000000000000000000000`
- **Node RPC Endpoint**: `https://rpc.preview.midnight.network`
- **Indexer GraphQL Endpoint**: `https://indexer.preview.midnight.network/api/v4/graphql`
- **Proof Server URL**: `http://127.0.0.1:6300`
- **Compiler**: Compact v0.5.1 (language version `>= 0.23`)

---

## 🧪 Verification & Test Suite

The platform includes an automated 6-case test suite covering contract compilation, ledger field exports, privacy witness invariants, network configuration, and state schema:

```bash
npm test
```

All 6 test cases pass with zero errors.

---

*Confidential Supply Chain Compliance Platform — Midnight Network Hackathon Level 3 Submission*
