"use client";

import { useState, useEffect } from "react";
import { Key, Eye, EyeOff, RefreshCw, Copy, Check, Globe } from "lucide-react";
import { User as UserProfile } from "@/types";

export function DeveloperSettingsClient({ user }: { user: UserProfile }) {
  const [apiKey, setApiKey] = useState<string | null>(user.api_key || null);
  const [showKey, setShowKey] = useState(false);
  const [copied, setCopied] = useState(false);
  const [isRegenerating, setIsRegenerating] = useState(false);
  
  // Webhooks
  const [webhookUrl, setWebhookUrl] = useState("");
  const [webhookSecret, setWebhookSecret] = useState("");
  const [isSavingWebhook, setIsSavingWebhook] = useState(false);
  const [webhookId, setWebhookId] = useState<string | null>(null);

  useEffect(() => {
    // Fetch current webhook if it exists
    fetch('/api/webhooks')
      .then(res => res.json())
      .then(data => {
        if (data.webhook) {
          setWebhookUrl(data.webhook.url);
          setWebhookSecret(data.webhook.secret);
          setWebhookId(data.webhook.id);
        }
      })
      .catch(console.error);
  }, []);

  const handleCopy = () => {
    if (apiKey) {
      navigator.clipboard.writeText(apiKey);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleRegenerate = async () => {
    if (!confirm("Are you sure? This will invalidate your old API key immediately.")) return;
    
    setIsRegenerating(true);
    try {
      const res = await fetch("/api/user/key", { method: "POST" });
      const data = await res.json();
      if (data.api_key) {
        setApiKey(data.api_key);
        setShowKey(true);
      }
    } catch (error) {
      console.error("Failed to regenerate key", error);
    } finally {
      setIsRegenerating(false);
    }
  };

  const handleSaveWebhook = async () => {
    setIsSavingWebhook(true);
    try {
      const res = await fetch("/api/webhooks", {
        method: webhookId ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: webhookUrl }),
      });
      const data = await res.json();
      if (data.webhook) {
        setWebhookUrl(data.webhook.url);
        setWebhookSecret(data.webhook.secret);
        setWebhookId(data.webhook.id);
        alert("Webhook saved!");
      }
    } catch (error) {
      console.error("Failed to save webhook", error);
    } finally {
      setIsSavingWebhook(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* API Key Section */}
      <div className="glass-card p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-xl bg-[var(--accent-cyan)]/10 flex items-center justify-center">
            <Key className="w-5 h-5 text-[var(--accent-cyan)]" />
          </div>
          <div>
            <h2 className="text-xl font-bold">API Key</h2>
            <p className="text-sm text-[var(--text-secondary)]">Use this key to authenticate requests to the Public API.</p>
          </div>
        </div>

        <div className="space-y-4 max-w-2xl">
          <div className="relative">
            <input
              type={showKey ? "text" : "password"}
              readOnly
              value={apiKey || "No API key generated yet."}
              className="w-full px-4 py-3 pr-24 rounded-xl border border-[var(--border)] bg-[var(--bg-secondary)] text-sm font-mono focus:outline-none"
            />
            <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1">
              {apiKey && (
                <>
                  <button onClick={() => setShowKey(!showKey)} className="p-1.5 hover:bg-[var(--bg-card)] rounded-md text-[var(--text-secondary)] transition-colors">
                    {showKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                  <button onClick={handleCopy} className="p-1.5 hover:bg-[var(--bg-card)] rounded-md text-[var(--text-secondary)] transition-colors">
                    {copied ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
                  </button>
                </>
              )}
            </div>
          </div>

          <button
            onClick={handleRegenerate}
            disabled={isRegenerating}
            className="btn-secondary text-sm flex items-center gap-2"
          >
            <RefreshCw className={`w-4 h-4 ${isRegenerating ? "animate-spin" : ""}`} />
            {apiKey ? "Regenerate Key" : "Generate API Key"}
          </button>
        </div>
      </div>

      {/* Webhooks Section */}
      <div className="glass-card p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-xl bg-purple-500/10 flex items-center justify-center">
            <Globe className="w-5 h-5 text-purple-500" />
          </div>
          <div>
            <h2 className="text-xl font-bold">Webhooks</h2>
            <p className="text-sm text-[var(--text-secondary)]">Receive real-time HTTP POST payloads when generation finishes.</p>
          </div>
        </div>

        <div className="space-y-4 max-w-2xl">
          <div>
            <label className="block text-sm font-medium mb-1.5">Payload URL</label>
            <input
              type="url"
              placeholder="https://your-server.com/webhooks/quadbrand"
              value={webhookUrl}
              onChange={(e) => setWebhookUrl(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-[var(--border)] bg-[var(--bg-secondary)] text-sm focus:outline-none focus:border-[var(--accent-cyan)] transition-colors"
            />
          </div>

          {webhookSecret && (
            <div>
              <label className="block text-sm font-medium mb-1.5 text-[var(--text-secondary)]">Webhook Secret (used for HMAC verification)</label>
              <input
                type="text"
                readOnly
                value={webhookSecret}
                className="w-full px-4 py-2 rounded-xl border border-[var(--border)] bg-[var(--bg-secondary)] text-sm font-mono focus:outline-none opacity-70"
              />
            </div>
          )}

          <button
            onClick={handleSaveWebhook}
            disabled={isSavingWebhook || !webhookUrl}
            className="btn-gradient text-sm"
          >
            {isSavingWebhook ? "Saving..." : "Save Webhook"}
          </button>
        </div>
      </div>
    </div>
  );
}
