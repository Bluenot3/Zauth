# ZENAuth Architecture

```
+-------------------+        +--------------------+        +--------------------+
|   Next.js Web     | <----> |  Fastify API        | <----> | Supabase Postgres   |
|  apps/web         |        |  apps/api           |        | (local Postgres)    |
+-------------------+        +--------------------+        +--------------------+
           |                            |
           |                            v
           |                   +--------------------+
           |                   | Hardhat Chain      |
           |                   | packages/contracts |
           |                   +--------------------+
           v
+-------------------+
| Public Verify URL |
+-------------------+
```

## Components
- **Web**: Next.js + Tailwind glassmorphic UI for admin, wallet, and public verification flows.
- **API**: Fastify REST backend with auth, issuance, verification, audit logging.
- **Contracts**: Solidity contract storing credential hash + status.
- **Shared**: Canonical JSON hashing and schemas.

## Key Flows
- Admin logs in ➜ creates template ➜ issues credential ➜ API writes on-chain hash and stores metadata.
- Public verification fetches metadata and chain state, recomputes hash, and determines VALID/INVALID/REVOKED.
