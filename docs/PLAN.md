# BrandEngine: MCP Connector Implementation Plan

## 1. One-Line Goal
An affordable, high-performance brand intelligence platform that unifies company guidelines, assets, and design models into a single MCP server/API, enabling AI agents to instantly generate and deploy 100% on-brand visual and textual content.

## 2. User Stories
* **As a Brand Marketer**, I can upload brand PDFs, Figma links, logos, and style rules so that the system extracts and anchors a central brand ontology (colors, typography, messaging tone).
* **As a Developer or Agent Architect**, I can connect our agent stack to the platform via an MCP URL or REST API key so that my AI models can execute on-brand design actions natively in Claude, Cursor, or an automation loop.
* **As an Autonomous AI Agent**, I can call tools like `generate_image`, `edit_canvas`, or `resize_asset` so that I can automatically generate complete multi-ratio marketing kits or ad creatives without human design bottlenecks.
* **As a Workspace Owner**, I can manage multiple brands and track cross-team generation credit usage from a centralized visual dashboard.

## 3. Non-Goals
* **No Core LLM or Diffusion Model Training:** We will not spend capital training baseline image generators or foundational models from scratch. Instead, we hook into best-in-class multi-modal API endpoints (like Flux, Midjourney API, or OpenAI) and wrap them with strict brand containment logic.
* **No Fully Featured Video Editing UI:** We are not building a replacement for Adobe Premiere or heavy browser-based video editors; we focus on asset generation, resizing variations, and template execution.

## 4. Tech Stack
* **Language:** TypeScript (Node.js) — Crucial for smooth integration with the official Anthropic MCP SDK.
* **Framework:** Next.js (App Router) — Excellent for crafting a beautiful, premium dark-mode dashboard paired with fast Edge API routes.
* **Database:** PostgreSQL with Prisma ORM — Ideal for managing multi-tenant organization workspaces, brand asset catalogs, and secure API keys.
* **Storage & Compute:** AWS S3 (for assets) paired with a vector embedding layer (e.g., pgvector or Pinecone) to perform quick semantic searches over brand tone guidelines and documents.

## 5. Data Model

### Organization & Workspace
* `id` (UUID, Primary Key)
* `name` (String)
* `planType` (Enum: FREE, GROW, PRO)
* `stripeCustomerId` (String)

### BrandSystem
* `id` (UUID, Primary Key)
* `orgId` (Foreign Key -> Organization)
* `name` (String)
* `colorPalette` (JSONB: Primary, secondary, dark, light hex codes)
* `typography` (JSONB: Font families, weights, fallback rules)
* `toneVoiceRules` (Text: Strict descriptive guardrails for copy generation)

### BrandAsset
* `id` (UUID, Primary Key)
* `brandId` (Foreign Key -> BrandSystem)
* `fileName` (String)
* `s3Url` (String)
* `assetType` (Enum: LOGO_PRIMARY, LOGO_MARK, ILLUSTRATION, LIFESTYLE_IMAGE)
* `descriptionVector` (Vector: For semantic natural-language asset retrieval)

### ApiKey & Integration
* `id` (UUID, Primary Key)
* `orgId` (Foreign Key -> Organization)
* `hashedKey` (String)
* `keyHint` (String: e.g., `be_live_...`)

## 6. Folder Structure
```text
brandengine/
├── apps/
│   ├── web/                   # Next.js workspace for user dashboard and brand ingestion
│   │   ├── src/
│   │   │   ├── app/           # App routes (ingest, keys, settings, analytics)
│   │   │   └── components/    # Clean, ultra-modern dark UI components
│   └── mcp-server/            # Independent secure service handling incoming agent calls
│       ├── src/
│       │   ├── tools/         # Core MCP functions: asset search, generate, edit, resize
│       │   ├── pipeline/      # Brand filtering layer (injecting hex colors/fonts into image prompts)
│       │   └── server.ts      # Server entry point handling SSE and WebSocket layers
├── packages/
│   ├── db/                    # Shared Prisma client schema and migrations
│   └── config/                # Global internal design tokens, constants, and utilities
├── package.json
└── README.md
```

## 7. Build Order

1.  **Phase 1: Brand Ontology & Extraction Pipeline:** Build the ingestion core. Create handlers that parse text rules, extract exact color hex codes from styles, and save assets into AWS S3 with a clean PostgreSQL layout.
2.  **Phase 2: The Core Brand MCP Engine:** Implement the server utilizing the official Anthropic MCP SDK. Set up standard SSE links to expose initial discovery tools like `find_brand_asset` and `get_brand_identity`.
3.  **Phase 3: Brand-Wrapped Generation Tools:** Connect with commercial image/design APIs. Write wrapping middleware that intercepts raw user requests and explicitly appends the brand's verified palettes, layout constraints, and specific style rules to ensure the output is perfectly on-brand (`brand_generate_image`).
4.  **Phase 4: Composition, Resizing, and Multi-Ratio Output:** Add downstream image transformation pipelines. Build tools (`brand_resize_image`, `brand_create_variants`) that let agents split single master designs into precise dimensions for platforms like Instagram stories, YouTube banners, or web banners.
5.  **Phase 5: Next.js Workspace & Multi-Tenant Control:** Launch the client web app. Design a clean minimalist dark workspace layout to view asset libraries, monitor real-time credit metrics, and cleanly generate live connection URLs or API keys.
6.  **Phase 6: Subscription, Tier Control, & Global Optimization:** Integrate billing infrastructure to seamlessly track and enforce generation caps across different tiers, completing the high-value, highly affordable product cycle.
