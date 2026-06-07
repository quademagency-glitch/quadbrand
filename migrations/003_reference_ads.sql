-- QuadBrand Reference Ads Schema
-- Requires pgvector extension

CREATE EXTENSION IF NOT EXISTS vector;

CREATE TABLE IF NOT EXISTS reference_ads (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  image_url TEXT NOT NULL,
  brand_name TEXT NOT NULL,
  industry TEXT,
  vertical TEXT,
  tags TEXT[] DEFAULT '{}',
  embedding vector(1536), -- For OpenAI text-embedding-3-small or text-embedding-ada-002
  created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- Index for fast cosine similarity search
CREATE INDEX ON reference_ads USING ivfflat (embedding vector_cosine_ops) WITH (lists = 100);
