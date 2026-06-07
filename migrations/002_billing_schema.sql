-- QuadBrand Billing Schema Update

-- 1. Update Workspaces for Payment Tracking
ALTER TABLE workspaces
ADD COLUMN stripe_customer_id TEXT,
ADD COLUMN paystack_customer_id TEXT,
ADD COLUMN subscription_status TEXT DEFAULT 'inactive' CHECK (subscription_status IN ('active', 'past_due', 'canceled', 'unpaid', 'inactive')),
ADD COLUMN subscription_id TEXT,
ADD COLUMN current_period_end TIMESTAMPTZ,
ADD COLUMN payment_provider TEXT CHECK (payment_provider IN ('stripe', 'paystack'));

-- 2. Update Credit Transactions for Reference Tracking
ALTER TABLE credit_transactions
ADD COLUMN paystack_reference TEXT,
ADD COLUMN status TEXT DEFAULT 'completed' CHECK (status IN ('pending', 'completed', 'failed'));

-- 3. Indexes for fast lookups by customer id
CREATE INDEX IF NOT EXISTS idx_workspaces_stripe_customer ON workspaces(stripe_customer_id);
CREATE INDEX IF NOT EXISTS idx_workspaces_paystack_customer ON workspaces(paystack_customer_id);
