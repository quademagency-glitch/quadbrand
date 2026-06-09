// === Core Entities ===

export type Plan = "free" | "starter" | "pro" | "team";
export type MemberRole = "owner" | "admin" | "editor" | "viewer";
export type OnboardingStatus = "pending" | "analyzing" | "ready" | "logo_required" | "failed";
export type GenerationStatus = "pending" | "generating" | "completed" | "failed";
export type ModelTier = "fast" | "standard" | "pro";
export type ActionType = "generation" | "edit" | "resize" | "variant" | "recreate" | "remove_bg" | "vectorize";
export type CreditReason = "subscription" | "topup" | "generation" | "refund" | "bonus";

export interface User {
  id: string;
  email: string;
  full_name: string;
  avatar_url: string | null;
  paystack_customer_id: string | null;
  plan: Plan;
  credits_balance: number;
  credits_used: number;
  api_key: string | null;
  created_at: string;
  updated_at: string;
}

export interface Workspace {
  id: string;
  name: string;
  owner_id: string;
  plan: Plan;
  credits_pool: number;
  logo_url: string | null;
  created_at: string;
}

export interface WorkspaceMember {
  workspace_id: string;
  user_id: string;
  role: MemberRole;
  user?: User;
}

export interface Brand {
  id: string;
  workspace_id: string;
  name: string;
  source_url: string | null;
  logo_url: string | null;
  colors: string[];
  fonts: string[];
  aesthetic: string | null;
  industry: string | null;
  brand_summary: string | null;
  onboarding_status: OnboardingStatus;
  created_at: string;
  updated_at: string;
}

export interface Generation {
  id: string;
  workspace_id: string;
  brand_id: string;
  user_id: string;
  prompt: string;
  model: ModelTier;
  aspect_ratio: string;
  image_url: string | null;
  storage_path: string | null;
  status: GenerationStatus;
  credits_cost: number;
  action_type: ActionType;
  variant_group_id: string | null;
  tags: string[];
  performance_note: string | null;
  is_winner: boolean;
  parent_image_id: string | null;
  created_at: string;
  updated_at: string;
}

export interface ReferenceAd {
  id: string;
  image_url: string;
  brand_name: string;
  industry: string;
  vertical: string;
  tags: string[];
}

export interface CreditTransaction {
  id: string;
  workspace_id: string;
  user_id: string;
  amount: number;
  reason: CreditReason;
  generation_id: string | null;
  paystack_reference: string | null;
  created_at: string;
}

// === API Request/Response Types ===

export interface GenerateRequest {
  brand_id: string;
  prompt: string;
  model: ModelTier;
  aspect_ratios: string[]; // multi-ratio support
}

export interface GenerateResponse {
  generations: Generation[];
}

export interface BrandOnboardRequest {
  url: string;
}

export interface BrandOnboardResponse {
  brand: Brand;
}

// === UI State Types ===

export interface AspectRatioOption {
  label: string;
  name: string;
  w: number;
  h: number;
  platform?: string;
}

export interface ModelOption {
  id: ModelTier;
  label: string;
  description: string;
  credits: number;
}
