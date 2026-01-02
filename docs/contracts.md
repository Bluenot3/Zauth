# Contracts

## ZENAuth.sol
- Stores `Credential` with owner, metadata hash, status, timestamps.
- Admin-only issuance + revocation.
- Credential IDs are UUIDv4 off-chain; on-chain IDs are `keccak256(uuid)` bytes32.

### Stored on-chain
- owner
- credentialId (bytes32 key)
- metadataHash (keccak256 of canonical JSON)
- status (active/revoked)
- issuedAt, revokedAt

### Events
- `CredentialIssued`
- `CredentialRevoked`

## Local chain
Start the chain with:
```
pnpm chain
```
Deploy with:
```
pnpm setup
```
