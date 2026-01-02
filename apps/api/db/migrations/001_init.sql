CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE IF NOT EXISTS admins (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  email text UNIQUE NOT NULL,
  password_hash text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS templates (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  title text NOT NULL,
  description text NOT NULL,
  issuer text NOT NULL,
  program text NOT NULL,
  badge_image_url text NOT NULL,
  fields jsonb NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS credentials (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  credential_id uuid UNIQUE NOT NULL,
  template_id uuid NOT NULL REFERENCES templates(id),
  recipient_wallet text NOT NULL,
  metadata jsonb NOT NULL,
  metadata_hash text NOT NULL,
  status text NOT NULL DEFAULT 'active',
  tx_hash text,
  chain_id text,
  issued_at timestamptz NOT NULL DEFAULT now(),
  revoked_at timestamptz
);

CREATE TABLE IF NOT EXISTS audit_logs (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  actor_email text NOT NULL,
  action text NOT NULL,
  credential_id uuid,
  template_id uuid,
  tx_hash text,
  chain_id text,
  created_at timestamptz NOT NULL DEFAULT now(),
  payload jsonb
);
