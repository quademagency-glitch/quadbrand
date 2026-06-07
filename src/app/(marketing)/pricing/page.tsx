"use client";

import { motion } from "framer-motion";
import { Check, CreditCard, Sparkles, Zap } from "lucide-react";
import Link from "next/link";

const plans = [
  {
    name: "Free",
    price: "$0",
    description: "Perfect for testing the waters",
    features: [
      "20 free credits",
      "1 brand identity",
      "Community models",
      "Basic aspect ratios",
    ],
    cta: "Current Plan",
    current: true,
  },
  {
    name: "Starter",
    price: "$9",
    period: "/mo",
    description: "Great for solo founders and creators",
    features: [
      "200 credits / month",
      "Up to 3 brand identities",
      "Standard + Fast models",
      "All aspect ratios",
      "Standard support",
    ],
    cta: "Upgrade to Starter",
    popular: false,
  },
  {
    name: "Pro",
    price: "$29",
    period: "/mo",
    description: "For marketers generating daily",
    features: [
      "800 credits / month",
      "Unlimited brand identities",
      "Pro model access (FLUX 1.1)",
      "Multi-ratio generation",
      "API Access",
      "Priority support",
    ],
    cta: "Upgrade to Pro",
    popular: true,
  },
  {
    name: "Team",
    price: "$79",
    period: "/mo",
    description: "For agencies and marketing teams",
    features: [
      "3,000 credits / month",
      "5 team seats included",
      "Shared credit pool",
      "Shared brand library",
      "Custom brand onboarding",
      "Dedicated account manager",
    ],
    cta: "Contact Sales",
    popular: false,
  },
];

export default function PricingPage() {
  return (
    <div className="max-w-6xl mx-auto px-4 md:px-6">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center max-w-2xl mx-auto mb-16"
      >
        <h1
          className="text-3xl md:text-5xl font-bold tracking-tight mb-4"
          style={{ fontFamily: "var(--font-outfit), sans-serif" }}
        >
          Simple, transparent pricing
        </h1>
        <p className="text-lg text-[var(--text-secondary)]">
          Generate production-ready brand assets at a fraction of the cost of traditional tools or competing AI services.
        </p>
      </motion.div>

      {/* Pricing Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-20">
        {plans.map((plan, i) => (
          <motion.div
            key={plan.name}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className={`relative rounded-3xl p-8 flex flex-col h-full bg-[var(--bg-card)] border transition-all duration-300 ${
              plan.popular
                ? "border-[var(--accent-cyan)] shadow-lg shadow-[var(--accent-cyan)]/10 scale-105 z-10"
                : "border-[var(--border)] hover:border-[var(--border-hover)]"
            }`}
          >
            {plan.popular && (
              <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1.5 rounded-full bg-gradient-to-r from-[var(--accent-cyan)] to-[var(--accent-magenta)] text-white text-xs font-bold tracking-wide uppercase shadow-sm">
                Most Popular
              </div>
            )}

            <div className="mb-6">
              <h3 className="text-lg font-bold mb-2">{plan.name}</h3>
              <p className="text-sm text-[var(--text-secondary)] min-h-[40px]">
                {plan.description}
              </p>
            </div>

            <div className="mb-6 flex items-baseline gap-1">
              <span className="text-4xl font-bold tracking-tight" style={{ fontFamily: "var(--font-outfit)" }}>
                {plan.price}
              </span>
              {plan.period && (
                <span className="text-sm text-[var(--text-tertiary)] font-medium">
                  {plan.period}
                </span>
              )}
            </div>

            <ul className="space-y-4 flex-1 mb-8">
              {plan.features.map((feature) => (
                <li key={feature} className="flex items-start gap-3">
                  <div className="mt-0.5 rounded-full p-1 bg-[var(--accent-cyan-light)] flex-shrink-0">
                    <Check className="w-3 h-3 text-[var(--accent-cyan)]" />
                  </div>
                  <span className="text-sm text-[var(--text-secondary)] leading-tight">
                    {feature}
                  </span>
                </li>
              ))}
            </ul>

            <button
              className={`w-full py-3.5 rounded-xl text-sm font-semibold transition-all duration-200 ${
                plan.current
                  ? "bg-[var(--bg-secondary)] text-[var(--text-secondary)] cursor-default"
                  : plan.popular
                  ? "btn-gradient shadow-md"
                  : "bg-[var(--bg-primary)] text-[var(--text-primary)] border border-[var(--border)] hover:bg-[var(--bg-secondary)] hover:border-[var(--border-hover)]"
              }`}
              disabled={plan.current}
            >
              {plan.cta}
            </button>
          </motion.div>
        ))}
      </div>

      {/* Credit Packs */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="max-w-3xl mx-auto glass-card p-8 md:p-10 text-center"
      >
        <div className="w-16 h-16 rounded-2xl mx-auto mb-6 flex items-center justify-center bg-gradient-to-br from-[var(--accent-magenta)]/20 to-[var(--accent-purple)]/20 border border-[var(--border)]">
          <Zap className="w-8 h-8 text-[var(--accent-magenta)]" />
        </div>
        <h2
          className="text-2xl font-bold mb-3"
          style={{ fontFamily: "var(--font-outfit), sans-serif" }}
        >
          Need more credits?
        </h2>
        <p className="text-[var(--text-secondary)] mb-8 max-w-lg mx-auto">
          Running out of credits before the month ends? Top up anytime with credit packs that never expire.
        </p>
        
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[
            { credits: 100, price: "$5" },
            { credits: 500, price: "$20", popular: true },
            { credits: 1500, price: "$50" },
          ].map((pack) => (
            <div
              key={pack.credits}
              className={`rounded-2xl p-6 border transition-colors ${
                pack.popular
                  ? "border-[var(--accent-magenta)] bg-[var(--accent-magenta)]/5"
                  : "border-[var(--border)] bg-[var(--bg-secondary)]"
              }`}
            >
              {pack.popular && (
                <span className="text-[10px] font-bold text-[var(--accent-magenta)] uppercase tracking-wider mb-2 block">
                  Best Value
                </span>
              )}
              <div className="text-2xl font-bold mb-1" style={{ fontFamily: "var(--font-outfit)" }}>
                {pack.price}
              </div>
              <div className="text-sm font-medium flex items-center justify-center gap-1.5 text-[var(--text-secondary)]">
                <Sparkles className="w-4 h-4 text-[var(--accent-magenta)]" />
                {pack.credits} credits
              </div>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
