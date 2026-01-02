# ZENAuth

ZENAuth is a blockchain-backed credential issuance and verification platform for ZEN AI Co programs.

## Monorepo Structure
- `apps/web` — Next.js + Tailwind UI
- `apps/api` — Fastify API (JWT auth + Zod validation)
- `packages/contracts` — Solidity contracts (Hardhat + Ethers)
- `packages/shared` — hashing + schema utilities

## Implementation Choices
- Backend: Fastify + PostgreSQL (Supabase-compatible)
- Auth: email/password with bcrypt + JWT
- Contracts: Hardhat with local chain for development

## Quickstart
```bash
pnpm i
cp .env.example .env
pnpm setup
```

### Run services
```bash
pnpm chain
pnpm dev
pnpm dev:api
```

## Admin Flow
1. Login with seeded admin credentials.
2. Create a template.
3. Issue a credential to a wallet.
4. Share the `/verify/{credentialId}` public URL + QR.

## Verification
1. API recomputes canonical JSON hash.
2. On-chain hash is fetched and compared.
3. Result is `VALID`, `INVALID`, or `REVOKED`.

## Configuration
See `.env.example` for required environment variables.

## Docs
- `docs/architecture.md`
- `docs/data-model.md`
- `docs/contracts.md`
- `docs/verification.md`
- `docs/deployment.md`
