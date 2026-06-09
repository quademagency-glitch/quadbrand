import Link from "next/link";
import { ArrowLeft, Code, Terminal, CheckCircle2 } from "lucide-react";

export const metadata = {
  title: "API Documentation | BrandForge",
  description: "Learn how to integrate BrandForge into your own applications.",
};

export default function DocsPage() {
  return (
    <div className="min-h-screen bg-[var(--bg-app)] pt-24 pb-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        <div className="mb-10">
          <Link href="/dashboard" className="inline-flex items-center gap-2 text-sm text-[var(--text-tertiary)] hover:text-[var(--text-primary)] transition-colors mb-6">
            <ArrowLeft className="w-4 h-4" />
            Back to Dashboard
          </Link>
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4" style={{ fontFamily: "var(--font-outfit), sans-serif" }}>
            API Documentation
          </h1>
          <p className="text-lg text-[var(--text-secondary)]">
            Integrate BrandForge directly into your own tools, internal dashboards, or customer-facing applications.
          </p>
        </div>

        <div className="space-y-12">
          {/* Authentication */}
          <section className="glass-card p-6 md:p-8">
            <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
              <span className="w-8 h-8 rounded-lg bg-[var(--accent-cyan)]/10 flex items-center justify-center text-[var(--accent-cyan)]">1</span>
              Authentication
            </h2>
            <p className="text-[var(--text-secondary)] mb-4">
              All API endpoints require authentication using a Bearer token. You can generate your API key from the Developer Settings page in your workspace.
            </p>
            <div className="bg-[var(--bg-secondary)] rounded-xl p-4 border border-[var(--border)] overflow-x-auto">
              <pre className="text-sm font-mono text-[var(--text-primary)]">
                <code>Authorization: Bearer YOUR_API_KEY</code>
              </pre>
            </div>
          </section>

          {/* Endpoints */}
          <section className="space-y-6">
            <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
              <span className="w-8 h-8 rounded-lg bg-[var(--accent-magenta)]/10 flex items-center justify-center text-[var(--accent-magenta)]">2</span>
              Core Endpoints
            </h2>

            {/* List Brands */}
            <div className="glass-card p-6 md:p-8">
              <div className="flex items-center gap-3 mb-4">
                <span className="px-3 py-1 bg-[var(--success)]/10 text-[var(--success)] rounded-md text-xs font-bold uppercase tracking-wider">GET</span>
                <h3 className="text-xl font-bold font-mono">/api/v1/brands</h3>
              </div>
              <p className="text-[var(--text-secondary)] mb-6">
                List all brands associated with your workspace. This is useful for retrieving the <code>brand_id</code> required for generation.
              </p>
              
              <div className="bg-[#1E1E1E] rounded-xl overflow-hidden border border-[#333]">
                <div className="flex items-center px-4 py-2 bg-[#2D2D2D] border-b border-[#333] gap-2">
                  <Terminal className="w-4 h-4 text-gray-400" />
                  <span className="text-xs font-mono text-gray-400">cURL</span>
                </div>
                <div className="p-4 overflow-x-auto">
                  <pre className="text-sm font-mono text-green-400">
                    <code>{`curl -X GET https://quadbrand.com/api/v1/brands \\
  -H "Authorization: Bearer YOUR_API_KEY"`}</code>
                  </pre>
                </div>
              </div>
            </div>

            {/* Generate Image */}
            <div className="glass-card p-6 md:p-8">
              <div className="flex items-center gap-3 mb-4">
                <span className="px-3 py-1 bg-[var(--accent-cyan)]/10 text-[var(--accent-cyan)] rounded-md text-xs font-bold uppercase tracking-wider">POST</span>
                <h3 className="text-xl font-bold font-mono">/api/v1/generate</h3>
              </div>
              <p className="text-[var(--text-secondary)] mb-6">
                Request an image generation using your brand identity. The API will respond immediately with an ID, and the image will be generated asynchronously.
              </p>

              <div className="bg-[#1E1E1E] rounded-xl overflow-hidden border border-[#333]">
                <div className="flex items-center px-4 py-2 bg-[#2D2D2D] border-b border-[#333] gap-2">
                  <Code className="w-4 h-4 text-gray-400" />
                  <span className="text-xs font-mono text-gray-400">Node.js (Fetch)</span>
                </div>
                <div className="p-4 overflow-x-auto">
                  <pre className="text-sm font-mono text-blue-300">
                    <code>{`const response = await fetch("https://quadbrand.com/api/v1/generate", {
  method: "POST",
  headers: {
    "Authorization": "Bearer YOUR_API_KEY",
    "Content-Type": "application/json"
  },
  body: JSON.stringify({
    prompt: "A modern workspace desk setup with a cup of coffee",
    aspectRatio: "16:9",
    modelId: "standard",
    brandId: "YOUR_BRAND_ID" // optional
  })
});

const data = await response.json();
console.log(data); // { status: "success", generation_id: "uuid" }`}</code>
                  </pre>
                </div>
              </div>
            </div>
          </section>

          {/* Webhooks */}
          <section className="glass-card p-6 md:p-8">
            <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
              <span className="w-8 h-8 rounded-lg bg-[var(--accent-purple)]/10 flex items-center justify-center text-[var(--accent-purple)]">3</span>
              Webhooks
            </h2>
            <p className="text-[var(--text-secondary)] mb-6">
              Because image generation takes 5-15 seconds, we recommend setting up a webhook to receive the image payload asynchronously when it completes.
            </p>
            
            <h4 className="font-semibold mb-2">Example Webhook Payload</h4>
            <div className="bg-[var(--bg-secondary)] rounded-xl p-4 border border-[var(--border)] overflow-x-auto mb-6">
              <pre className="text-sm font-mono text-[var(--text-primary)]">
                <code>{`{
  "event": "generation.completed",
  "workspace_id": "uuid",
  "timestamp": "2026-06-08T12:00:00Z",
  "data": {
    "id": "generation_uuid",
    "prompt": "A modern workspace desk setup...",
    "image_url": "https://replicate.delivery/.../out-0.png",
    "variantGroupId": null
  }
}`}</code>
              </pre>
            </div>

            <div className="flex items-start gap-3 p-4 rounded-xl bg-[var(--success)]/10 border border-[var(--success)]/20 text-sm">
              <CheckCircle2 className="w-5 h-5 text-[var(--success)] shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold text-[var(--text-primary)] mb-1">Webhook Security</p>
                <p className="text-[var(--success)] opacity-90">All webhook events include an <code>X-Quadbrand-Signature</code> header. You can verify this signature using your Webhook Secret found in the Developer Settings.</p>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
