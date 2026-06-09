-- Phase 5: Referrals

CREATE TABLE IF NOT EXISTS referrals (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  referrer_id TEXT NOT NULL REFERENCES user_profiles(id) ON DELETE CASCADE,
  referred_id TEXT NOT NULL UNIQUE REFERENCES user_profiles(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Index for fast lookup by referrer
CREATE INDEX IF NOT EXISTS referrals_referrer_id_idx ON referrals(referrer_id);
