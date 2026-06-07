"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Sparkles, Zap, Check, Loader2 } from "lucide-react";
import Link from "next/link";

interface UpgradeModalProps {
  isOpen: boolean;
  onClose: () => void;
  reason?: "low_credits" | "no_credits" | "brand_limit" | "feature_locked";
}

const messages = {
  low_credits: {
    title: "Running Low on Credits",
    subtitle: "You have fewer than 5 credits remaining. Upgrade to keep creating.",
    icon: "⚡",
  },
  no_credits: {
    title: "You're Out of Credits",
    subtitle: "Upgrade your plan or buy a credit pack to continue generating images.",
    icon: "🚫",
  },
  brand_limit: {
    title: "Brand Limit Reached",
    subtitle: "Your Free plan allows 1 brand. Upgrade to Starter for up to 3 brands.",
    icon: "🎨",
  },
  feature_locked: {
    title: "Pro Feature",
    subtitle: "This feature requires a Pro or Team plan. Upgrade to unlock it.",
    icon: "🔒",
  },
};

const plans = [
  {
    name: "Starter",
    price: "$9",
    credits: "200",
    features: ["3 brands", "Standard + Fast models", "All aspect ratios"],
  },
  {
    name: "Pro",
    price: "$29",
    credits: "800",
    popular: true,
    features: ["Unlimited brands", "Pro model", "API access", "Multi-ratio"],
  },
];

export default function UpgradeModal({
  isOpen,
  onClose,
  reason = "low_credits",
}: UpgradeModalProps) {
  const msg = messages[reason];
  const [loadingPlan, setLoadingPlan] = useState<string | null>(null);

  const handleUpgrade = async (planId: string) => {
    setLoadingPlan(planId);
    try {
      let clientCountryCode = null;
      try {
        const ipRes = await fetch("https://ipapi.co/json/");
        if (ipRes.ok) {
          const ipData = await ipRes.json();
          clientCountryCode = ipData.country_code;
        }
      } catch (e) {}

      const res = await fetch("/api/billing/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          planId,
          workspaceId: "mock-workspace-id",
          clientCountryCode
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to initialize checkout");
      }

      const { url } = await res.json();
      
      if (url) {
        window.location.href = url;
      }
    } catch (error) {
      console.error("Checkout error:", error);
      alert("Failed to initialize checkout. Please try again.");
    } finally {
      setLoadingPlan(null);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ duration: 0.25 }}
            className="fixed inset-x-4 top-[10%] md:inset-x-auto md:left-1/2 md:-translate-x-1/2 md:w-full md:max-w-lg z-50 bg-[var(--bg-card)] rounded-2xl border border-[var(--border)] shadow-2xl overflow-hidden"
            id="upgrade-modal"
          >
            {/* Gradient Top Strip */}
            <div className="h-1 w-full" style={{ background: "var(--gradient-primary)" }} />

            {/* Close */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 p-1.5 rounded-lg hover:bg-[var(--bg-secondary)] transition-colors z-10"
            >
              <X className="w-4 h-4 text-[var(--text-tertiary)]" />
            </button>

            <div className="p-6 md:p-8">
              {/* Header */}
              <div className="text-center mb-6">
                <span className="text-4xl mb-3 block">{msg.icon}</span>
                <h2
                  className="text-xl font-bold tracking-tight mb-1"
                  style={{ fontFamily: "var(--font-outfit), sans-serif" }}
                >
                  {msg.title}
                </h2>
                <p className="text-sm text-[var(--text-secondary)]">
                  {msg.subtitle}
                </p>
              </div>

              {/* Plan Cards */}
              <div className="grid grid-cols-2 gap-3 mb-6">
                {plans.map((plan) => (
                  <div
                    key={plan.name}
                    className={`rounded-xl p-4 border ${
                      plan.popular
                        ? "border-[var(--accent-cyan)] bg-[var(--accent-cyan-light)]"
                        : "border-[var(--border)] bg-[var(--bg-secondary)]"
                    }`}
                  >
                    {plan.popular && (
                      <span className="text-[10px] font-bold text-[var(--accent-cyan)] uppercase tracking-wider">
                        Recommended
                      </span>
                    )}
                    <p className="text-sm font-bold mt-1">{plan.name}</p>
                    <div className="flex items-baseline gap-0.5 mt-1 mb-3">
                      <span className="text-2xl font-bold" style={{ fontFamily: "var(--font-outfit)" }}>
                        {plan.price}
                      </span>
                      <span className="text-xs text-[var(--text-tertiary)]">/mo</span>
                    </div>
                    <p className="text-xs text-[var(--accent-cyan)] font-medium mb-3">
                      {plan.credits} credits/mo
                    </p>
                    <ul className="space-y-1.5">
                      {plan.features.map((f) => (
                        <li key={f} className="flex items-center gap-1.5 text-xs text-[var(--text-secondary)]">
                          <Check className="w-3 h-3 text-[var(--accent-cyan)]" />
                          {f}
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>

              {/* Actions */}
              <Link href="/billing">
                <button className="btn-gradient w-full !py-3 mb-3" id="upgrade-cta">
                  <Zap className="w-4 h-4" />
                  <span>Upgrade Now</span>
                </button>
              </Link>

              <div className="text-center">
                <button className="text-sm text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors flex items-center gap-1 mx-auto">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Or buy a credit pack — $5 = 100 credits</span>
                </button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
