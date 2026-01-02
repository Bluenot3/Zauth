# Data Model

## Tables

### admins
- `id` (uuid)
- `email` (unique)
- `password_hash`
- `created_at`

### templates
- `id`
- `title`
- `description`
- `issuer`
- `program`
- `badge_image_url`
- `fields` (JSON schema for dynamic metadata)
- `created_at`, `updated_at`

### credentials
- `id`
- `credential_id` (public UUID)
- `template_id`
- `recipient_wallet`
- `metadata` (JSON)
- `metadata_hash` (keccak256)
- `status` (active/revoked)
- `tx_hash`, `chain_id`
- `issued_at`, `revoked_at`

### audit_logs
- `id`
- `actor_email`
- `action` (template_created, credential_issued, credential_revoked)
- `credential_id`, `template_id`
- `tx_hash`, `chain_id`
- `payload` (JSON)
- `created_at`
