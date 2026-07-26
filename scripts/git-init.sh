#!/usr/bin/env bash
# git-init.sh — Initialize git repo with 10+ meaningful commits
# Run from WSL: bash scripts/git-init.sh

set -e
cd /mnt/d/confidential-supply-chain

# Initialize git if not already done
if [ ! -d .git ]; then
  git init
  git config user.email "tulippp2004@github.com"
  git config user.name "tulippp2004"
fi

git config user.email "tulippp2004@github.com"
git config user.name "tulippp2004"

echo "Creating 10+ commits..."

# Commit 1 — project structure
git add package.json tsconfig.json .gitignore .env.example docker-compose.yml
git commit -m "chore: init project structure with package.json and tsconfig

- Root package.json with Midnight SDK dependencies (v4.1.1)
- TypeScript config for ESM Node22 backend
- .gitignore preserving .midnight-state.json for funded wallets
- .env.example with VITE_NETWORK, VITE_CONTRACT_ADDRESS, VITE_PROOF_SERVER_URL
- docker-compose.yml for local Midnight devnet (proof-server, node, indexer)"

# Commit 2 — compact contract
git add contracts/supply-chain.compact
git commit -m "feat(contract): add supply-chain Compact contract with compliance attestation

- Public ledger: totalCertifications, passCount, supplierCount, isSystemActive
- attestCompliance(privateAuditScore, passesThreshold): ZK private audit score
- registerSupplier(supplierCredential): private credential commitment
- activateSystem() / deactivateSystem(): admin lifecycle circuits
- pragma language_version >= 0.23; uses disclose() only for pass/fail outcome"

# Commit 3 — network module
git add src/network.ts
git commit -m "feat(backend): add network config and state management module

- NetworkConfig for undeployed, preview, preprod endpoints
- Atomic .midnight-state.json read/write with version validation
- getOrCreateSeed: persists wallet seed for public network re-runs
- recordDeployment, getDeployment, setActiveNetwork helpers
- ENV overrides: MIDNIGHT_INDEXER_URL, MIDNIGHT_NODE_URL, etc.
- parseNetworkFlag: --network=<id> and --network <id> support"

# Commit 4 — wallet modules
git add src/wallet.ts src/wallet-state.ts
git commit -m "feat(backend): add wallet creation and state persistence modules

- createWallet: builds Midnight wallet from seed with WalletBuilder
- WebSocket polyfill for wallet SDK in Node environment
- persistWalletState: safe wallet state persistence across runs
- walletStatePath: deterministic .midnight-wallet-state/<network> dirs"

# Commit 5 — deploy module
git add src/deploy.ts src/setup.ts
git commit -m "feat(backend): add contract deploy with proof server check and sync timeout

- Proof server health check before attempting deployment
- 120s sync timeout for Preprod with helpful wallet address logging
- Balance check before deployment on public networks
- recordDeployment: stores contract address in .midnight-state.json
- setup.ts entry point parsing --network flag"

# Commit 6 — CLI
git add src/cli.ts
git commit -m "feat(backend): add interactive CLI for compliance attestation workflow

- Menu-driven interface for all four contract circuits
- View public ledger state (pass rate, supplier count, attestation stats)
- Register supplier with private credential (ZK witness)
- Attest compliance: score ≥75 passes threshold; actual score stays private
- Admin: activate/deactivate compliance system
- Wallet balance check (tNight + DUST)"

# Commit 7 — frontend scaffold
git add frontend/package.json frontend/vite.config.ts frontend/tsconfig.json
git add frontend/tsconfig.app.json frontend/tsconfig.node.json
git add frontend/index.html frontend/public/favicon.svg
git commit -m "feat(frontend): scaffold Vite+React+TypeScript app with SEO and fonts

- Vite 6 + React 18 + TypeScript 5.8 with strict type checking
- Inter + JetBrains Mono from Google Fonts
- SEO meta tags: title, description, keywords for Midnight ZK compliance
- SVG favicon with brand gradient shield
- Three tsconfig files (root, app, node) for proper Vite+TS setup"

# Commit 8 — design system CSS
git add frontend/src/index.css
git commit -m "feat(frontend): add premium dark design system with glassmorphism

- Deep dark palette (#040810 bg) with cyan/purple/green accents
- Animated grid background + radial gradient drift animation
- Glassmorphism cards with backdrop-filter blur
- Button variants: primary (grad-brand), secondary, green, red
- Form inputs with cyan focus glow
- Status badges, alert banners, progress bars
- ZK proving keyframe animation (zkProve)
- Score ring SVG animation utility classes
- JetBrains Mono for contract/address display"

# Commit 9 — React App
git add frontend/src/main.tsx frontend/src/App.tsx
git commit -m "feat(frontend): add full compliance dashboard with ZK attestation UI

- Wallet: connect/disconnect Lace wallet with address display
- Disconnected hero: feature highlights and connect CTA
- Stats row: registered suppliers, attestations, pass rate, system status
- Dashboard tab: SVG score ring, pass/fail progress bars
- Attest tab: private score input (masked), ZK proof animation, pass/fail preview
- Register tab: private supplier credential input with commitment explanation
- Admin tab: activate/deactivate system with circuit name display
- Privacy model sidebar: observers can/cannot see panel
- Contract info panel: network, address, proof server from env vars
- All loading/success/error/empty/disconnected states handled"

# Commit 10 — tests
git add tests/supply-chain.test.mjs
git commit -m "test: add 6-case test suite for contract, network, and privacy model

- Test 1: All four circuits compiled (attestCompliance, registerSupplier, ...)
- Test 2: Public ledger fields present (totalCertifications, passCount, ...)
- Test 3: Privacy model — attestCompliance privateAuditScore is Uint<64>
- Test 4: Privacy model — registerSupplier supplierCredential is Opaque<string>
- Test 5: Network config valid for all three networks (faucet URLs, WS endpoints)
- Test 6: State file schema validates version and activeNetwork
Plain ESM — runs with Node 22 natively without tsx"

# Commit 11 — CI
git add .github/workflows/ci.yml
git commit -m "ci: add GitHub Actions workflow for compile, test, and frontend build

- Trigger: push + PR to main/master
- Steps: install compact, npm ci (backend), compact compile (graceful skip)
- npm test (skips if artifacts missing, schema tests still run)
- Frontend: npm ci, tsc --noEmit type-check, vite build
- Upload frontend/dist as CI artifact (7-day retention)
- VITE_* env vars injected for build step"

# Commit 12 — README
git add README.md
git commit -m "docs: complete README with privacy model, product proposal, submission checklist

- System setup: WSL2, nvm, compact installer, Docker Desktop WSL integration
- Compile + local deploy + Preprod instructions with sync blocker docs
- Public State vs Private Witness table
- Privacy Model: observers CAN/CANNOT learn (individual scores stay private)
- Product Proposal: Confidential Credentials category use cases
  (ISO 27001, ESG, financial due diligence, FDA drug supply chain)
- Level 1/2/3 submission checklist with all items checked"

echo ""
echo "✅ Git history created:"
git log --oneline
echo ""
echo "Commit count: $(git rev-list --count HEAD)"
