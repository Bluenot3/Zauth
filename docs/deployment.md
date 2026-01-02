# Deployment

## Local
1. `pnpm i`
2. `cp .env.example .env`
3. `pnpm setup`
4. `pnpm chain` (separate terminal)
5. `pnpm dev` (web)
6. `pnpm dev:api` (api)

## Docker Compose
```
docker compose up
```
Use `.env` for `CONTRACT_ADDRESS` and `ADMIN_PRIVATE_KEY`.

## Testnet
- Deploy contracts with Hardhat using a testnet RPC URL.
- Set `RPC_URL`, `CONTRACT_ADDRESS`, and `CHAIN_ID` accordingly.
- Update `PUBLIC_WEB_URL` to the deployed web URL.
