# Verification

1. API fetches credential metadata from Postgres.
2. API canonicalizes JSON (sorted keys, stable order) and computes keccak256.
3. API queries chain for credential hash and status.
4. API compares recomputed hash with on-chain hash.
5. Response:
   - `VALID` if hashes match and status is active.
   - `REVOKED` if chain or DB says revoked.
   - `INVALID` if hash mismatch or missing chain entry.

## Manual steps
- `GET /verify/{credentialId}` from API.
- Web page `/verify/{credentialId}` renders status + metadata + hash comparison.
