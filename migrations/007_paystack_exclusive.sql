-- Rip out Stripe completely and exclusively use Paystack

-- 1. Remove stripe_customer_id from user_profiles (if it exists)
-- Since user_profiles was created with stripe_customer_id in 001, we drop it and add paystack
ALTER TABLE user_profiles
DROP COLUMN IF EXISTS stripe_customer_id,
ADD COLUMN IF NOT EXISTS paystack_customer_id TEXT;

-- 2. Clean up workspaces
ALTER TABLE workspaces
DROP COLUMN IF EXISTS stripe_customer_id,
DROP COLUMN IF EXISTS payment_provider; -- We don't need this anymore since we only use paystack

-- 3. Clean up credit_transactions
ALTER TABLE credit_transactions
DROP COLUMN IF EXISTS stripe_event_id,
ADD COLUMN IF NOT EXISTS paystack_reference TEXT;

-- Add index on paystack_reference to prevent duplicate webhooks
CREATE INDEX IF NOT EXISTS idx_credit_transactions_paystack_ref ON credit_transactions(paystack_reference);
