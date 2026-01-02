# ZENAuth — Build Contract (Source of Truth)

You are Codex acting as a senior staff engineer. This file is the canonical spec and completion checklist for this repository.  
**Do not ask for more files. Do not stop early. Implement everything end-to-end.**

## Mission
Build a production-grade, “build once and done” system called **ZENAuth**: a blockchain-backed credential and badge issuance + verification platform for ZEN (youth + adult programs).

## Definition of Done (Non-Negotiable Acceptance Tests)
The project is only “done” when all of the following pass on a fresh machine:

1) Local bootstrap works:
- `pnpm i`
- `cp .env.example .env`
- `pnpm setup`

2) Local runtime works (all services):
- `pnpm chain` starts local chain
- `pnpm dev` runs the web app
- `pnpm dev:api` runs the API (or `docker compose up` runs API + DB)

3) End-to-end product flow works with no code edits:
- Admin can sign in
- Admin can create a credential template
- Admin can issue a credential to a wallet
- On-chain proof is written (tx hash recorded)
- Credential has a public URL + QR
- Public verify page shows VALID and details
- Admin can revoke and verify page shows REVOKED

4) Verification is anti-tamper:
- Metadata is canonicalized + hashed
- Verification recomputes hash and matches on-chain hash
- Any mismatch displays INVALID clearly

5) Repo quality gates exist:
- CI runs lint + typecheck + unit tests + contract tests on PR
- Meaningful tests exist for contract + API + hashing integrity
- README explains setup and architecture and verification steps

If anything above is missing, the repo is not done.

---

## Required Architecture
Use a monorepo with **pnpm workspaces**:

- `apps/web` — Next.js + TypeScript + Tailwind UI (glassmorphic)
- `apps/api` — Backend API (choose Node Fastify or Python FastAPI and fully implement)
- `packages/contracts` — Solidity contracts with tests (Hardhat or Foundry)
- `packages/shared` — Shared types + hashing + schema utilities

### Preferred Defaults
- Hashing uses canonical JSON serialization then `keccak256` for EVM compatibility.
- On-chain stores only: owner, credentialId, metadataHash, status (active/revoked), issuedAt, revokedAt.
- Off-chain stores human-readable metadata + template info + audit logs.
- CredentialId: UUIDv4 or deterministic hash (choose one and implement).

---

## Core Features

### A) Admin Issuance
- Admin authentication (implement fully: either magic link OR username/password with strong hashing; choose one)
- Admin can create templates:
  - Title, description, issuer, program (AI Pioneer Program, ZEN Vanguard)
  - Badge image upload
  - Metadata schema (custom fields)
- Admin can issue credentials:
  - Generate credentialId
  - Write proof on-chain
  - Store metadata off-chain
  - Create public verification link + QR

### B) Recipient View
- Wallet connect (EVM)
- List owned credentials
- Share/export credential (link + QR)
- Optional: download credential card as image/PDF (nice-to-have)

### C) Public Verification
- Route: `/verify/{credentialId}`
- Reads chain state + fetches metadata
- Shows VALID / INVALID / REVOKED
- Shows issuer, issue date, metadata fields
- Recomputes hash and compares to chain

### D) Revocation
- Admin can revoke
- Revocation stored on-chain
- Public verification updates immediately

### E) Audit Trail
Store audit events in DB:
- Issued by whom, to which wallet, when
- Template edits
- Revocations
Include tx hash and chainId.

---

## Storage & Database (Supabase)
Use Supabase Postgres for:
- Admin users
- Templates
- Issuances
- Audit logs

Metadata storage abstraction:
- Default: Supabase storage bucket
- Optional: IPFS adapter (interface clean; optional toggle)

Include:
- migrations
- seed scripts to create an initial admin user

---

## Backend API Requirements
Expose REST endpoints:
- Auth
- Templates CRUD
- Issue credential
- Revoke credential
- Verify credential
- List credentials by wallet

Include:
- request validation (Zod/Joi/Pydantic)
- rate limiting on public verify endpoints
- OpenAPI/Swagger docs
- secure secrets via env vars
- RBAC (admin only issuance/revocation)

---

## DevEx: “Once and Done”
You must implement:
- `.env.example` with every variable documented
- `pnpm setup` that:
  - runs DB migrations
  - starts local chain
  - deploys contracts
  - seeds admin user
- Docker Compose for DB + API (minimum)
- CI pipeline (GitHub Actions)

---

## Documentation Required
Create `/docs` containing:
- `architecture.md` (include a text-based diagram)
- `data-model.md`
- `contracts.md`
- `verification.md` (step-by-step how verification works)
- `deployment.md` (local + testnet)

---

## Execution Plan (You must follow this order)
1) Scaffold monorepo + tooling
2) Implement contracts + tests
3) Implement shared hashing + schema
4) Implement DB schema + migrations + seed
5) Implement API + OpenAPI
6) Implement web UI flows
7) Add setup scripts + docker + CI
8) Run acceptance tests and ensure they pass

---

## Project Constraints
- No blocking TODOs.
- If TODOs exist, they must be non-blocking enhancements only.
- Make sensible choices and document them.
- Favor reliability, clarity, and maintainability.
