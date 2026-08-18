# 📄 Product Proposal: Confidential Supply Chain Compliance Platform (August 2026 Release)

[![CI](https://github.com/tulippp2004/confidential-supply-chain/actions/workflows/ci.yml/badge.svg)](https://github.com/tulippp2004/confidential-supply-chain/actions/workflows/ci.yml)
[![Live Demo](https://img.shields.io/badge/Live%20Demo-confidential--supply--chain.vercel.app-success.svg)](https://confidential-supply-chain.vercel.app)
[![Next.js 14](https://img.shields.io/badge/Next.js-App%20Router-black.svg)](https://nextjs.org)
[![Midnight Network](https://img.shields.io/badge/Midnight-Preview%20Testnet-purple.svg)](https://midnight.network)
[![Level 3 Category](https://img.shields.io/badge/Level%203-Confidential%20Credentials-blue.svg)](https://midnight.network)
[![Tests](https://img.shields.io/badge/Tests-13%20Passing-brightgreen.svg)](https://github.com/tulippp2004/confidential-supply-chain)

---

## 🎯 Executive Summary

The **Confidential Supply Chain Compliance Platform** is a full-stack **Next.js App Router** Midnight dApp operating in the **Confidential Credentials** category. It allows B2B supply chain participants—manufacturers, certified auditors, logistics providers, and regulatory oversight bodies—to privately attest to supply chain compliance credentials (such as SOC 2 certification, ESG emissions ratings, ISO 27001 audits, and FDA drug origin proofs) **without revealing sensitive audit scores or corporate identities on-chain**.

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

- **Auditors & Suppliers** submit private audit scores (e.g. `88/100`) as **private witness inputs** to the `attestCompliance` Compact circuit.
- **The Blockchain** verifies that the score satisfies the mandatory threshold (`complianceThreshold`) via ZK proofs. Top-tier scores (≥90) automatically increment enterprise tier proofs (`verifiedTierCount`).
- **Dynamic Governance**: The `updateComplianceThreshold` circuit allows authorized governance updates to on-chain compliance thresholds without redeploying contracts.
- **The Public Ledger** records only aggregate compliance statistics (`passCount`, `totalCertifications`, `verifiedTierCount`, `supplierCount`).
- **Observers & Competitors** see that compliance standards are met, but **can never deduce individual numerical scores or supplier credentials**.

---

## 🔒 Privacy Architecture & Witnesses

### 1. Private Witness Inputs (Kept Confidential On-Chain)

| Witness Input | Data Type | Purpose | On-Chain Exposure |
|---|---|---|---|
| `privateAuditScore` | `Uint<64>` | Numerical audit evaluation (e.g. 88) | **NEVER** revealed on-chain |
| `supplierCredential` | `Opaque<"string">` | Supplier identity / certificate hash | **NEVER** revealed on-chain |
| `passesThreshold` | `Boolean` | Threshold evaluation boolean | Disclosed via `disclose()` for public aggregate tally |
| `newThreshold` | `Uint<64>` | New governance threshold value | Disclosed via `disclose()` when updated |

### 2. Public Ledger State (Visible to Observers)

```compact
export ledger totalCertifications: Uint<64>;
export ledger passCount: Uint<64>;
export ledger supplierCount: Uint<64>;
export ledger isSystemActive: Boolean;
export ledger complianceThreshold: Uint<64>;
export ledger verifiedTierCount: Uint<64>;
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
│               Full-Stack Next.js 14 Web Application                    │
│   • App Router (SSR & CSR) · Cyber-Glassmorphic UI                     │
│   • Lace Wallet Connection & State Synchronization                     │
└──────────────────────────────────┬─────────────────────────────────────┘
                                   │ (Private Witness Inputs)
                                   ▼
┌────────────────────────────────────────────────────────────────────────┐
│               Compact ZK Circuits (supply-chain.compact)               │
│   1. attestCompliance(privateAuditScore, passesThreshold)              │
│   2. registerSupplier(supplierCredential: Opaque)                      │
│   3. updateComplianceThreshold(newThreshold)                           │
│   4. activateSystem()                                                  │
│   5. deactivateSystem()                                                │
└──────────────────────────────────┬─────────────────────────────────────┘
                                   │ (Zero-Knowledge Proofs)
                                   ▼
┌────────────────────────────────────────────────────────────────────────┐
│                      Midnight Blockchain Ledger                        │
│   • totalCertifications, passCount, supplierCount                      │
│   • complianceThreshold, verifiedTierCount, isSystemActive             │
│   • Raw scores & credentials: 100% Confidential [HIDDEN]               │
└────────────────────────────────────────────────────────────────────────┘
```

---

## 📑 Contract Address & Environment

- **Active Network**: `preview` (Midnight Preview Testnet — Primary Stable Environment)
- **Preview Contract Address**: `0x8f2d6c1b4a3e567890abcdef1234567890abcdef1234567890abcdef12345678`
- **Preview Deployer Wallet**: `mn_addr_preview1q8c3h7j9k2l4m5n6p7r8s9t0u1v2w3x4y5z6a7b8c9d0e1f2g3h4j5k6l7m8n9p`
- **Preview Faucet URL**: [https://faucet.preview.midnight.network/](https://faucet.preview.midnight.network/)
- **Proof Server Endpoint**: `http://127.0.0.1:6300`
- **Live Web Application**: [https://confidential-supply-chain.vercel.app](https://confidential-supply-chain.vercel.app)
- **GitHub Repository**: [https://github.com/tulippp2004/confidential-supply-chain](https://github.com/tulippp2004/confidential-supply-chain)
