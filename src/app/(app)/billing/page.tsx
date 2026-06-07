"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { CreditCard, Check, Zap, Sparkles, Building2, Users } from "lucide-react";
import UpgradeModal from "@/components/billing/UpgradeModal";

export default function BillingPage() {
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  return (
    <div className="max-w-4xl">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h1
          className="text-2xl md:text-3xl font-bold tracking-tight mb-1"
          style={{ fontFamily: "var(--font-outfit), sans-serif" }}
        >
          Billing & Usage
        </h1>
        <p className="text-[var(--text-secondary)]">
          Manage your subscription and credit balance.
        </p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {/* Credit Usage Card */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="md:col-span-2 glass-card p-6"
        >
          <div className="flex items-start justify-between mb-6">
            <div>
              <h2 className="text-lg font-bold mb-1">Credit Balance</h2>
              <p className="text-sm text-[var(--text-secondary)]">
                Resets on July 7, 2026
              </p>
            </div>
            <div className="px-3 py-1 rounded-full bg-[var(--bg-secondary)] border border-[var(--border)] text-sm font-medium">
              Free Plan
            </div>
          </div>

          <div className="mb-8">
            <div className="flex items-end gap-2 mb-2">
              <span className="text-4xl font-bold" style={{ fontFamily: "var(--font-outfit)" }}>0</span>
              <span className="text-[var(--text-secondary)] pb-1">/ 20 credits</span>
            </div>
            {/* Progress bar */}
            <div className="h-3 bg-[var(--bg-secondary)] rounded-full overflow-hidden border border-[var(--border)]">
              <div 
                className="h-full rounded-full transition-all duration-1000 bg-[var(--error)]" 
                style={{ width: "100%" }}
              />
            </div>
            <p className="text-xs text-[var(--error)] mt-2 font-medium">
              You are out of credits. Upgrade to continue generating.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 rounded-xl border border-[var(--border)] bg-[var(--bg-secondary)] text-center">
              <p className="text-sm text-[var(--text-tertiary)] mb-1">Images Generated</p>
              <p className="text-2xl font-bold">14</p>
            </div>
            <div className="p-4 rounded-xl border border-[var(--border)] bg-[var(--bg-secondary)] text-center">
              <p className="text-sm text-[var(--text-tertiary)] mb-1">Brands Active</p>
              <p className="text-2xl font-bold">1 <span className="text-sm text-[var(--text-tertiary)] font-normal">/ 1</span></p>
            </div>
          </div>
        </motion.div>

        {/* Current Plan Card */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="glass-card p-6 flex flex-col"
        >
          <div className="mb-6">
            <h2 className="text-lg font-bold mb-1">Current Plan</h2>
            <div className="flex items-baseline gap-1 mt-2">
              <span className="text-3xl font-bold" style={{ fontFamily: "var(--font-outfit)" }}>$0</span>
              <span className="text-sm text-[var(--text-tertiary)]">/mo</span>
            </div>
          </div>

          <ul className="space-y-3 flex-1 mb-6">
            {[
              "20 credits / month",
              "1 brand identity",
              "Standard models",
            ].map((f) => (
              <li key={f} className="flex items-center gap-2 text-sm text-[var(--text-secondary)]">
                <Check className="w-4 h-4 text-[var(--success)]" />
                {f}
              </li>
            ))}
          </ul>

          <button 
            className="btn-gradient w-full !py-3"
            onClick={() => setShowUpgradeModal(true)}
          >
            <Zap className="w-4 h-4" />
            <span>Upgrade Plan</span>
          </button>
        </motion.div>
      </div>

      {/* Credit Packs */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="glass-card p-6"
      >
        <h2 className="text-lg font-bold mb-4">Credit Packs</h2>
        <p className="text-sm text-[var(--text-secondary)] mb-6">
          Need a quick top-up? Credit packs never expire and roll over month to month.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[
            { credits: 100, price: "$5" },
            { credits: 500, price: "$20", popular: true },
            { credits: 1500, price: "$50" },
          ].map((pack) => (
            <div
              key={pack.credits}
              className={`relative rounded-xl p-5 border flex flex-col items-center text-center transition-colors hover:border-[var(--accent-magenta)] ${
                pack.popular
                  ? "border-[var(--accent-magenta)] bg-[var(--accent-magenta)]/5"
                  : "border-[var(--border)] bg-[var(--bg-secondary)]"
              }`}
            >
              {pack.popular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-2 py-0.5 rounded-full bg-[var(--accent-magenta)] text-white text-[9px] font-bold uppercase tracking-wider">
                  Best Value
                </div>
              )}
              <div className="text-xl font-bold mb-1" style={{ fontFamily: "var(--font-outfit)" }}>
                {pack.price}
              </div>
              <div className="text-sm font-medium flex items-center justify-center gap-1.5 text-[var(--text-secondary)] mb-4">
                <Sparkles className="w-4 h-4 text-[var(--accent-magenta)]" />
                {pack.credits} credits
              </div>
              <button className="w-full py-2 rounded-lg text-sm font-medium border border-[var(--border)] bg-[var(--bg-card)] hover:bg-[var(--bg-secondary)] transition-colors">
                Buy Pack
              </button>
            </div>
          ))}
        </div>
      </motion.div>

      <UpgradeModal
        isOpen={showUpgradeModal}
        onClose={() => setShowUpgradeModal(false)}
        reason="no_credits"
      />
    </div>
  );
}
