-- Add auth fields to users
ALTER TABLE users ADD COLUMN password_hash TEXT;

-- Add invite token to circles (used for shareable join links)
ALTER TABLE circles ADD COLUMN invite_token TEXT;

-- Populate invite tokens for existing circles
UPDATE circles SET invite_token = lower(hex(randomblob(8))) WHERE invite_token IS NULL;

-- Plan RSVPs
CREATE TABLE IF NOT EXISTS plan_rsvps (
  plan_id   TEXT NOT NULL,
  user_id   TEXT NOT NULL,
  status    TEXT NOT NULL DEFAULT 'in', -- 'in' | 'out' | 'maybe'
  updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (plan_id, user_id),
  FOREIGN KEY (plan_id) REFERENCES plans(id) ON DELETE CASCADE,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_plan_rsvps_plan_id ON plan_rsvps(plan_id);
