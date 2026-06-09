"use client";

import { useState } from "react";
import { Copy, Check, Users, Gift, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";

export default function ReferralsClient({
  userId,
  referredUsers,
}: {
  userId: string;
  referredUsers: any[];
}) {
  const [copied, setCopied] = useState(false);
  const referralUrl = typeof window !== "undefined" ? `${window.location.origin}/signup?ref=${userId}` : "";

  const handleCopy = () => {
    navigator.clipboard.writeText(referralUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6">
      <div className="glass-card p-6 md:p-8">
        <div className="flex items-center gap-4 mb-6">
          <div className="w-12 h-12 rounded-xl bg-[var(--accent-magenta-light)] flex items-center justify-center">
            <Gift className="w-6 h-6 text-[var(--accent-magenta)]" />
          </div>
          <div>
            <h2 className="text-xl font-bold" style={{ fontFamily: "var(--font-outfit), sans-serif" }}>Your Referral Link</h2>
            <p className="text-sm text-[var(--text-secondary)]">Share this link to earn free credits.</p>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-3">
          <input
            type="text"
            readOnly
            value={referralUrl}
            className="flex-1 px-4 py-3 rounded-xl border border-[var(--border)] bg-[var(--bg-secondary)] text-sm font-mono focus:outline-none"
          />
          <button
            onClick={handleCopy}
            className="btn-gradient !rounded-xl !py-3 !px-6 flex items-center justify-center gap-2"
          >
            {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
            <span>{copied ? "Copied!" : "Copy Link"}</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="glass-card p-6">
          <div className="flex items-center gap-3 mb-4">
            <Users className="w-5 h-5 text-[var(--accent-cyan)]" />
            <h3 className="font-semibold">Friends Referred</h3>
          </div>
          <p className="text-3xl font-bold" style={{ fontFamily: "var(--font-outfit), sans-serif" }}>
            {referredUsers.length}
          </p>
        </div>
        <div className="glass-card p-6">
          <div className="flex items-center gap-3 mb-4">
            <Gift className="w-5 h-5 text-[var(--accent-magenta)]" />
            <h3 className="font-semibold">Credits Earned</h3>
          </div>
          <p className="text-3xl font-bold text-[var(--accent-magenta)]" style={{ fontFamily: "var(--font-outfit), sans-serif" }}>
            {referredUsers.length * 50}
          </p>
        </div>
      </div>

      <div className="glass-card overflow-hidden">
        <div className="p-4 border-b border-[var(--border)]">
          <h3 className="font-semibold">Recent Referrals</h3>
        </div>
        {referredUsers.length > 0 ? (
          <div className="divide-y divide-[var(--border)]">
            {referredUsers.map((user) => (
              <div key={user.id} className="flex items-center justify-between p-4">
                <div>
                  <p className="text-sm font-medium">{user.full_name || "Anonymous User"}</p>
                  <p className="text-xs text-[var(--text-tertiary)]">{new Date(user.created_at).toLocaleDateString()}</p>
                </div>
                <div className="flex items-center gap-2 bg-[var(--success)]/10 text-[var(--success)] px-3 py-1 rounded-full text-xs font-semibold">
                  +50 Credits
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-8 text-center">
            <p className="text-[var(--text-secondary)] text-sm mb-4">You haven't referred anyone yet.</p>
            <button onClick={handleCopy} className="text-sm text-[var(--accent-cyan)] hover:underline">
              Copy your link to get started
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
