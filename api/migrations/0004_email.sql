-- Add email to users table
ALTER TABLE users ADD COLUMN email TEXT;
CREATE UNIQUE INDEX IF NOT EXISTS idx_users_email ON users(email) WHERE email IS NOT NULL;

-- Seed dev account (password: devpassword123)
-- PBKDF2 hash is computed at runtime so we insert with a known bcrypt-style placeholder
-- and let the worker handle it. Instead we'll use a pre-seeded user via the register endpoint.
-- For now just insert the user row without a password; the bootstrap script will call /auth/register.
INSERT OR IGNORE INTO users (id, name, username, initials, avatar_gradient_index, bio, email)
VALUES (
  'dev-user-id',
  'Dev Account',
  '@dev',
  'DA',
  0,
  'Seed account for development',
  'dev@mycircles.app'
);
