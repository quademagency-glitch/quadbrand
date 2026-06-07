# PLAN.md — BrandForge AI
### Implementation Plan v1.0

---

## 1. One-Line Goal

**BrandForge AI** lets any brand generate, edit, and export scroll-stopping on-brand marketing visuals in seconds — at half the price of Bloom.

---

## 2. User Stories

Sorted by ship order (earliest first):

| # | Story | Ships in |
|---|-------|----------|
| 1 | As a **solo founder**, I can paste my website URL and have my brand identity (colors, fonts, logo, aesthetic) extracted automatically, so I don't have to configure anything manually. | Phase 1 |
| 2 | As a **marketer**, I can type a prompt and generate on-brand images in multiple aspect ratios simultaneously, so I get platform-ready assets in one click. | Phase 1 |
| 3 | As a **designer**, I can browse a curated library of high-performing reference ads by industry, select one, and have it recreated in my brand style, so I never start from a blank canvas. | Phase 2 |
| 4 | As a **team lead**, I can invite teammates to a shared workspace, set role permissions, and see a shared credit balance, so my whole team works under one brand identity. | Phase 2 |
| 5 | As a **growth hacker**, I can generate 3–5 visual variants from a single prompt, A/B test them, and tag winners with performance notes, so my creative iteration is fast and organized. | Phase 3 |
| 6 | As a **content creator**, I can resize any generated image to any social format (9:16, 1:1, 16:9, etc.) with AI-aware reframing, so I repurpose assets without manual cropping. | Phase 3 |
| 7 | As a **power user**, I can access the full generation API with my API key, so I can integrate BrandForge into my own tools and workflows. | Phase 4 |

---

## 3. Non-Goals

These are explicitly out of scope for v1.0. Write them down so scope creep has nowhere to hide.

- ❌ **Video generation** — statics only in v1; video is a Phase 5+ feature
- ❌ **In-app photo editing** (Photoshop-style canvas) — AI-directed edits only, no pixel-level tools
- ❌ **Social media scheduling / publishing** — we generate assets, we don't post them
- ❌ **E-commerce product mockups** — not a Shopify plugin or 3D renderer
- ❌ **White-label reselling** — no agency reseller accounts in v1
- ❌ **Custom model fine-tuning** — we use shared FLUX/SDXL models; per-brand LoRA training is Phase 5+
- ❌ **Native mobile app** — web-only in v1; PWA is acceptable

---

## 4. Tech Stack

| Layer | Choice | Reason |
|-------|--------|--------|
| **Framework** | Next.js 14 (App Router) + TypeScript | SSR for SEO on landing pages; API routes for backend; single deployable unit |
| **Styling** | Tailwind CSS + shadcn/ui + Framer Motion | Rapid build velocity; headless components; production-grade animations |
| **Database** | PostgreSQL via Supabase | Auth, DB, and file storage in one managed service; free tier generous for launch |
| **File Storage** | Supabase Storage (S3-compatible) | Co-located with DB; CDN-backed; simple signed URLs |
| **AI — Image Gen** | Replicate API (FLUX 1.1 Pro / SDXL) | Pay-per-use; no GPU infra; cheapest path to production-quality images |
| **AI — Brand Scraping** | Firecrawl + GPT-4o Vision | Extract colors/fonts/logo from any URL reliably |
| **Auth** | Supabase Auth (magic link + OAuth) | Built-in; works with the rest of the Supabase stack |
| **Payments** | Stripe (subscriptions + usage-based credits) | Industry standard; webhooks for credit top-ups |
| **Email** | Resend + React Email | Developer-friendly; beautiful transactional emails |
| **Hosting** | Vercel | Zero-config Next.js deployment; edge functions; preview URLs per PR |
| **Queue / Jobs** | Vercel Edge Functions + Upstash Redis | Handle async generation status polling without a separate worker |
| **Analytics** | PostHog (self-hostable) | Product analytics + feature flags + session replay on affordable plan |

---

## 5. Data Model

Six core entities. Fields listed are non-obvious ones only; IDs and timestamps are assumed.

### `users`
```
id                uuid PK
email             text UNIQUE
full_name         text
avatar_url        text
stripe_customer_id text
plan              enum(free, starter, pro, team)
credits_balance   int          -- current credit balance
credits_used      int          -- lifetime usage
api_key           text UNIQUE  -- hashed; for API access (Phase 4)
```

### `workspaces`
```
id            uuid PK
name          text
owner_id      uuid → users
plan          enum(free, starter, pro, team)
credits_pool  int    -- team-shared balance
logo_url      text
```

### `workspace_members`
```
workspace_id  uuid → workspaces
user_id       uuid → users
role          enum(owner, admin, editor, viewer)
```

### `brands`
```
id                  uuid PK
workspace_id        uuid → workspaces
name                text
source_url          text         -- website or Instagram URL scraped
logo_url            text
colors              text[]       -- hex codes extracted
fonts               text[]       -- font names
aesthetic           text         -- "warm & minimal", "bold & urban", etc.
industry            text
brand_summary       text         -- AI-generated 1-paragraph brand DNA
onboarding_status   enum(pending, analyzing, ready, logo_required, failed)
```

### `generations`
```
id                uuid PK
workspace_id      uuid → workspaces
brand_id          uuid → brands
user_id           uuid → users
prompt            text
model             enum(fast, standard, pro)
aspect_ratio      text           -- "16:9", "9:16", "1:1", etc.
image_url         text
storage_path      text
status            enum(pending, generating, completed, failed)
credits_cost      int
action_type       enum(generation, edit, resize, variant, recreate, remove_bg, vectorize)
variant_group_id  uuid NULLABLE  -- groups A/B variants together
tags              text[]         -- user-applied tags
performance_note  text NULLABLE  -- winner notes (Phase 3)
parent_image_id   uuid NULLABLE  -- for edits/resizes, ref to source
```

### `reference_ads`
```
id            uuid PK
image_url     text
brand_name    text
industry      text
vertical      text
tags          text[]         -- "before/after", "bold typography", "lifestyle"
embedding     vector(1536)   -- for semantic search (pgvector)
```

### `credit_transactions`
```
id              uuid PK
workspace_id    uuid → workspaces
user_id         uuid → users
amount          int      -- positive = added, negative = spent
reason          enum(subscription, topup, generation, refund, bonus)
generation_id   uuid NULLABLE
stripe_event_id text NULLABLE
```

---

## 6. Folder Structure

```
brandforge/
├── app/                          # Next.js App Router
│   ├── (marketing)/              # Public pages (no auth required)
│   │   ├── page.tsx              # Landing page
│   │   ├── pricing/page.tsx
│   │   ├── blog/
│   │   └── changelog/
│   ├── (auth)/                   # Auth flows
│   │   ├── login/page.tsx
│   │   ├── signup/page.tsx
│   │   └── callback/route.ts
│   ├── (app)/                    # Authenticated app shell
│   │   ├── layout.tsx            # Sidebar + nav shell
│   │   ├── dashboard/page.tsx    # Home / recent activity
│   │   ├── brands/
│   │   │   ├── page.tsx          # Brand list
│   │   │   ├── new/page.tsx      # Onboard new brand
│   │   │   └── [brandId]/
│   │   │       ├── page.tsx      # Brand detail
│   │   │       └── settings/     # Brand settings
│   │   ├── generate/
│   │   │   ├── page.tsx          # Main generation canvas
│   │   │   └── [generationId]/page.tsx
│   │   ├── library/
│   │   │   ├── page.tsx          # All generated images
│   │   │   └── reference/page.tsx # Reference ad browser
│   │   ├── workspace/
│   │   │   ├── page.tsx          # Workspace settings
│   │   │   └── members/page.tsx
│   │   └── billing/page.tsx
│   └── api/                      # Backend API routes
│       ├── brands/
│       │   ├── route.ts          # GET/POST /api/brands
│       │   ├── onboard/route.ts  # POST — scrape & analyze URL
│       │   └── [id]/route.ts
│       ├── generate/
│       │   ├── route.ts          # POST — submit generation job
│       │   └── [id]/route.ts     # GET — poll status
│       ├── images/
│       │   ├── edit/route.ts
│       │   ├── resize/route.ts
│       │   ├── remove-bg/route.ts
│       │   └── vectorize/route.ts
│       ├── reference-ads/route.ts
│       ├── webhooks/
│       │   ├── stripe/route.ts
│       │   └── replicate/route.ts
│       └── v1/                   # Public API (Phase 4)
│           └── messages/route.ts
│
├── components/
│   ├── ui/                       # shadcn/ui primitives
│   ├── brand/
│   │   ├── BrandCard.tsx
│   │   ├── BrandOnboardForm.tsx
│   │   └── BrandColorSwatch.tsx
│   ├── generate/
│   │   ├── PromptInput.tsx
│   │   ├── AspectRatioPicker.tsx
│   │   ├── ModelSelector.tsx
│   │   ├── GenerationCard.tsx
│   │   └── VariantGrid.tsx
│   ├── library/
│   │   ├── ImageGrid.tsx
│   │   ├── ImageDetailModal.tsx
│   │   └── ReferenceAdGrid.tsx
│   ├── billing/
│   │   ├── CreditMeter.tsx
│   │   ├── PricingCard.tsx
│   │   └── UpgradeModal.tsx
│   └── layout/
│       ├── Sidebar.tsx
│       ├── TopBar.tsx
│       └── WorkspaceSwitcher.tsx
│
├── lib/
│   ├── supabase/
│   │   ├── client.ts             # Browser Supabase client
│   │   ├── server.ts             # Server Supabase client (RSC)
│   │   └── middleware.ts
│   ├── replicate.ts              # Replicate API wrapper
│   ├── firecrawl.ts              # Brand URL scraping
│   ├── openai.ts                 # GPT-4o Vision for brand analysis
│   ├── stripe.ts                 # Stripe client + helpers
│   ├── credits.ts                # Credit deduction + validation logic
│   └── embeddings.ts             # pgvector semantic search helpers
│
├── hooks/
│   ├── useBrand.ts
│   ├── useGeneration.ts          # Polls status until complete
│   ├── useCredits.ts
│   └── useWorkspace.ts
│
├── types/
│   ├── database.types.ts         # Supabase-generated types
│   └── index.ts                  # App-specific types
│
├── emails/                       # React Email templates
│   ├── WelcomeEmail.tsx
│   ├── LowCreditsEmail.tsx
│   └── GenerationCompleteEmail.tsx
│
├── public/
│   └── ...static assets
│
├── supabase/
│   ├── migrations/               # SQL migration files
│   └── seed.sql                  # Reference ads seed data
│
├── .env.local                    # Local secrets (never commit)
├── middleware.ts                 # Auth protection
├── next.config.ts
└── tailwind.config.ts
```

---

## 7. Build Order

Numbered in ship order. Each step should be deployable and testable before starting the next.

### Phase 1 — Foundation & Core Loop (Weeks 1–3)
> Goal: A real user can onboard a brand and generate images.

1. **Project scaffold** — Next.js 14 + TypeScript + Tailwind + shadcn/ui + Supabase project setup; deploy skeleton to Vercel; configure env vars
2. **Database schema** — Write and run all Supabase migrations; enable pgvector; set up RLS policies per entity
3. **Auth flow** — Magic link + Google OAuth via Supabase Auth; protected route middleware; workspace auto-creation on signup
4. **Landing page** — Marketing homepage with hero, pricing table, feature comparison vs. Bloom; designed to convert
5. **Brand onboarding — URL scraper** — Firecrawl + GPT-4o Vision pipeline to extract colors, fonts, logo, industry, and aesthetic summary from any URL; store in `brands` table
6. **Brand onboarding — Manual fallback** — Form to upload logo, pick colors, enter fonts; for brands without a website
7. **Image generation — Core** — Prompt input → Replicate FLUX 1.1 Pro → poll status → display result; deduct credits on success
8. **Credit system** — Credit balance display; gate generation behind balance check; low-credit warning modal

### Phase 2 — Quality & Collaboration (Weeks 4–6)
> Goal: The output is high-quality and teams can share it.

9. **Aspect ratio multi-select** — Generate same prompt in 3 aspect ratios simultaneously; platform-labelled buttons (Story, Post, Banner, etc.)
10. **Model tier selector** — Fast / Standard / Pro with credit costs displayed before generation; recommended default
11. **Image library** — Paginated grid of all generated images; filter by brand, date, aspect ratio, status; download/share
12. **Image detail modal** — View full-res; copy prompt; regenerate; edit; resize; remove background; vectorize (one action at a time)
13. **Reference ad library** — Curated library of 200+ real ads with semantic search (pgvector); browse by industry; "Recreate in my brand" button
14. **Workspace & team members** — Invite by email; roles (owner/admin/editor/viewer); shared credit pool; workspace switcher
15. **Stripe billing** — Subscription plans (Free / Starter $9 / Pro $29 / Team $79); credit top-up packs; webhook handlers; Stripe Customer Portal

### Phase 3 — Power Features (Weeks 7–9)
> Goal: Users iterate faster and BrandForge becomes habit-forming.

16. **Variant generation** — Generate 2–5 variants per prompt in one click; grouped in a variant set; tag one as winner
17. **AI image editing** — Edit prompt on an existing image ("change background to white", "add a tagline"); show before/after comparison
18. **AI-powered resizing** — Reflow any image to a new aspect ratio with subject-aware AI reframing; never dumb cropping
19. **Remove background** — One-click background removal; output transparent PNG; preview before download
20. **Vectorize** — Convert logo/icon generations to scalable SVG; useful for brand asset exports
21. **Performance tagging** — Mark generated images as winner/loser; add free-text performance notes; filter library by winners
22. **Generation history & prompts** — Browse past prompts; one-click re-generate with same or modified settings

### Phase 4 — API & Developer Access (Weeks 10–11)
> Goal: Power users integrate BrandForge into their own tools.

23. **API key management** — Generate/revoke API keys per workspace; scoped to brand(s); shown in settings
24. **Public REST API** — `/v1/brands`, `/v1/generate`, `/v1/images/{id}` endpoints; OpenAPI spec; usage tracked against credits
25. **API docs page** — In-app documentation with code examples in JS, Python, cURL; try-it-live console
26. **Webhook delivery** — User-configured webhook URLs; send `generation.completed`, `generation.failed`, `credits.low` events

### Phase 5 — Growth & Retention (Weeks 12+)
> Goal: Grow word-of-mouth and reduce churn.

27. **Referral program** — Refer a friend → both get 50 free credits; tracked via unique referral links
28. **Usage analytics dashboard** — Credits used over time; generations per brand; most-used aspect ratios; exportable CSV
29. **Email sequences** — Welcome drip (Resend); "You haven't generated in 7 days"; low credits warning at 20 remaining
30. **Changelog & blog** — MDX-powered; announce new models/features; SEO traffic

---

## Pricing Strategy (vs. Bloom)

| Plan | BrandForge | Bloom (est.) | What's included |
|------|-----------|--------------|-----------------|
| Free | $0 / 20 credits | $0 / 10 credits | 1 brand, community models |
| Starter | **$9/mo** / 200 credits | ~$29/mo | 3 brands, Standard model |
| Pro | **$29/mo** / 800 credits | ~$79/mo | Unlimited brands, Pro model, API access |
| Team | **$79/mo** / 3,000 credits | ~$199/mo | 5 seats, Pro model, shared pool |
| Credit packs | $5 = 100 credits | $15 = 100 credits | Top-up anytime |

---

## Differentiators Over Bloom

1. **3× cheaper** — same image quality, dramatically lower price point
2. **Simultaneous multi-ratio generation** — generate all sizes in one submission (Bloom is one at a time)
3. **A/B variant sets** — generate 5 variants, tag winners, build muscle memory on what works
4. **API access on Pro** — Bloom gates API to enterprise; we open it at $29/mo
5. **Performance notes** — lightweight native creative analytics without needing a separate tool
6. **Transparent credit costs** — see exact cost before you click generate; no surprises
7. **Instagram onboarding** — scrape brand from Instagram handle, not just website
8. **Better design** — editorial aesthetic, not the generic purple-gradient SaaS look

---

## Key Risks & Mitigations

| Risk | Mitigation |
|------|-----------|
| Replicate API latency (30–90s per image) | Optimistic UI with live progress indicator; webhook callbacks; Fast model for previews |
| Brand scraping failures | Manual onboarding fallback always available; partial results still useful |
| Credit abuse / free tier exploitation | Rate limit by IP + email; require email verification before first generation |
| Image quality inconsistency | Lock to FLUX 1.1 Pro for Standard/Pro plans; show model watermark on Fast outputs |
| Supabase storage costs at scale | Move to Cloudflare R2 when monthly storage bill > $50; same S3 API |

---

*Last updated: June 2026 | Version: 1.0*
