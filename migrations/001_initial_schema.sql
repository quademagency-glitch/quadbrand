-- QuadBrand Initial Schema
-- PostgreSQL

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
-- Uncomment when ready for vector search (requires pgvector extension in Cloud SQL)
-- CREATE EXTENSION IF NOT EXISTS vector;

-- 1. user_profiles
-- Extends Firebase Auth with app-specific data
CREATE TABLE IF NOT EXISTS user_profiles (
  id TEXT PRIMARY KEY, -- Firebase UID
  email TEXT UNIQUE NOT NULL,
  full_name TEXT,
  avatar_url TEXT,
  plan TEXT DEFAULT 'free',
  credits_balance INTEGER DEFAULT 20,
  credits_used INTEGER DEFAULT 0,
  api_key TEXT UNIQUE,
  created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- Trigger to update updated_at
CREATE OR REPLACE FUNCTION trigger_set_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER set_timestamp_user_profiles
BEFORE UPDATE ON user_profiles
FOR EACH ROW
EXECUTE FUNCTION trigger_set_timestamp();

-- 2. workspaces
CREATE TABLE IF NOT EXISTS workspaces (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  owner_id TEXT NOT NULL REFERENCES user_profiles(id) ON DELETE CASCADE,
  plan TEXT DEFAULT 'free',
  credits_pool INTEGER DEFAULT 20,
  logo_url TEXT,
  created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- 3. workspace_members
CREATE TABLE IF NOT EXISTS workspace_members (
  workspace_id UUID REFERENCES workspaces(id) ON DELETE CASCADE,
  user_id TEXT REFERENCES user_profiles(id) ON DELETE CASCADE,
  role TEXT NOT NULL CHECK (role IN ('owner', 'admin', 'editor', 'viewer')),
  PRIMARY KEY (workspace_id, user_id)
);

-- 4. brands
CREATE TABLE IF NOT EXISTS brands (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  workspace_id UUID NOT NULL REFERENCES workspaces(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  source_url TEXT,
  logo_url TEXT,
  colors TEXT[] DEFAULT '{}',
  fonts TEXT[] DEFAULT '{}',
  aesthetic TEXT,
  industry TEXT,
  brand_summary TEXT,
  onboarding_status TEXT DEFAULT 'pending' CHECK (onboarding_status IN ('pending', 'analyzing', 'ready', 'logo_required', 'failed')),
  created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

CREATE TRIGGER set_timestamp_brands
BEFORE UPDATE ON brands
FOR EACH ROW
EXECUTE FUNCTION trigger_set_timestamp();

-- 5. generations
CREATE TABLE IF NOT EXISTS generations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  workspace_id UUID NOT NULL REFERENCES workspaces(id) ON DELETE CASCADE,
  brand_id UUID NOT NULL REFERENCES brands(id) ON DELETE CASCADE,
  user_id TEXT NOT NULL REFERENCES user_profiles(id) ON DELETE CASCADE,
  prompt TEXT NOT NULL,
  model TEXT DEFAULT 'standard' CHECK (model IN ('fast', 'standard', 'pro')),
  aspect_ratio TEXT DEFAULT '1:1',
  image_url TEXT,
  storage_path TEXT,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'generating', 'completed', 'failed')),
  credits_cost INTEGER DEFAULT 1,
  action_type TEXT DEFAULT 'generation' CHECK (action_type IN ('generation', 'edit', 'resize', 'variant', 'recreate', 'remove_bg', 'vectorize')),
  variant_group_id UUID,
  tags TEXT[] DEFAULT '{}',
  performance_note TEXT,
  parent_image_id UUID REFERENCES generations(id) ON DELETE SET NULL,
  replicate_id TEXT,
  created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

CREATE TRIGGER set_timestamp_generations
BEFORE UPDATE ON generations
FOR EACH ROW
EXECUTE FUNCTION trigger_set_timestamp();

-- 6. credit_transactions
CREATE TABLE IF NOT EXISTS credit_transactions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  workspace_id UUID NOT NULL REFERENCES workspaces(id) ON DELETE CASCADE,
  user_id TEXT NOT NULL REFERENCES user_profiles(id) ON DELETE CASCADE,
  amount INTEGER NOT NULL, -- Positive for additions, negative for usage
  reason TEXT NOT NULL CHECK (reason IN ('subscription', 'topup', 'generation', 'refund', 'bonus')),
  generation_id UUID REFERENCES generations(id) ON DELETE SET NULL,
  stripe_event_id TEXT,
  created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- Indexes for performance
CREATE INDEX idx_workspaces_owner ON workspaces(owner_id);
CREATE INDEX idx_workspace_members_user ON workspace_members(user_id);
CREATE INDEX idx_brands_workspace ON brands(workspace_id);
CREATE INDEX idx_generations_workspace ON generations(workspace_id);
CREATE INDEX idx_generations_brand ON generations(brand_id);
CREATE INDEX idx_generations_user ON generations(user_id);
CREATE INDEX idx_generations_status ON generations(status);
CREATE INDEX idx_credit_transactions_workspace ON credit_transactions(workspace_id);
CREATE INDEX idx_credit_transactions_user ON credit_transactions(user_id);
