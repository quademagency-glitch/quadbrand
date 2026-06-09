-- 1. Add referred_by to user_profiles
ALTER TABLE user_profiles
ADD COLUMN IF NOT EXISTS referred_by TEXT REFERENCES user_profiles(id);

-- Create index for performance
CREATE INDEX IF NOT EXISTS idx_user_profiles_referred_by ON user_profiles(referred_by);
