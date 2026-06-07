"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  Palette,
  Type,
  Globe,
  ArrowLeft,
  Edit3,
  Trash2,
  Sparkles,
  Copy,
  Check,
  Image as ImageIcon,
  Clock,
} from "lucide-react";
import Link from "next/link";

// Mock brand data — will come from DB later
const mockBrand = {
  id: "1",
  name: "Demo Brand",
  source_url: "https://demo-brand.com",
  logo_url: null,
  colors: ["#00D4FF", "#FF00E5", "#7B61FF", "#0F1019", "#F8F9FC"],
  fonts: ["Inter", "Outfit"],
  aesthetic: "Modern & Vibrant",
  industry: "Technology",
  brand_summary:
    "A modern technology brand with a vibrant color palette featuring cyan and magenta accents. Clean typography with Inter for body text and Outfit for headings. The overall aesthetic is premium, minimal, and forward-thinking.",
  onboarding_status: "ready" as const,
  created_at: "2026-06-07T00:00:00Z",
  images_generated: 7,
};

const recentImages = [
  { id: "1", prompt: "Summer sale banner with tropical vibes", ratio: "16:9", time: "2m ago", gradient: "from-cyan-400/30 to-blue-400/30" },
  { id: "2", prompt: "Instagram post for product launch", ratio: "1:1", time: "15m ago", gradient: "from-pink-400/30 to-rose-400/30" },
  { id: "3", prompt: "YouTube thumbnail bold typography", ratio: "16:9", time: "1h ago", gradient: "from-purple-400/30 to-indigo-400/30" },
  { id: "4", prompt: "LinkedIn banner minimalist design", ratio: "4:1", time: "3h ago", gradient: "from-amber-400/30 to-orange-400/30" },
];

export default function BrandDetailPage() {
  const brand = mockBrand;
  const [copiedColor, setCopiedColor] = useState<string | null>(null);

  const copyColor = (color: string) => {
    navigator.clipboard.writeText(color);
    setCopiedColor(color);
    setTimeout(() => setCopiedColor(null), 1500);
  };

  return (
    <div className="max-w-4xl">
      {/* Back + Actions */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between mb-6"
      >
        <Link
          href="/brands"
          className="flex items-center gap-2 text-sm text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Brands
        </Link>
        <div className="flex items-center gap-2">
          <button className="btn-secondary !py-2 !px-3 text-sm" id="brand-edit">
            <Edit3 className="w-4 h-4" />
            <span>Edit</span>
          </button>
          <button className="flex items-center gap-2 px-3 py-2 rounded-xl border border-[var(--error)]/20 text-sm text-[var(--error)] hover:bg-[var(--error)]/5 transition-colors" id="brand-delete">
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </motion.div>

      {/* Brand Header */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.05 }}
        className="glass-card p-6 mb-6"
      >
        <div className="flex items-start gap-5">
          <div
            className="w-16 h-16 rounded-2xl flex items-center justify-center flex-shrink-0"
            style={{ background: "var(--gradient-primary)" }}
          >
            <Palette className="w-8 h-8 text-white" />
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-1">
              <h1
                className="text-2xl font-bold tracking-tight"
                style={{ fontFamily: "var(--font-outfit), sans-serif" }}
                id="brand-detail-name"
              >
                {brand.name}
              </h1>
              <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-[var(--success)]/10">
                <div className="w-1.5 h-1.5 rounded-full bg-[var(--success)]" />
                <span className="text-xs text-[var(--success)] font-medium capitalize">
                  {brand.onboarding_status}
                </span>
              </div>
            </div>
            <div className="flex items-center gap-2 text-sm text-[var(--text-tertiary)]">
              <Globe className="w-3.5 h-3.5" />
              <span>{brand.source_url}</span>
            </div>
          </div>
          <Link href={`/generate?brand=${brand.id}`}>
            <button className="btn-gradient text-sm" id="brand-generate">
              <Sparkles className="w-4 h-4" />
              <span>Generate</span>
            </button>
          </Link>
        </div>
      </motion.div>

      {/* Brand Identity Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        {/* Colors */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="glass-card p-6"
        >
          <h2 className="text-sm font-semibold mb-4 flex items-center gap-2">
            <Palette className="w-4 h-4 text-[var(--accent-cyan)]" />
            Brand Colors
          </h2>
          <div className="space-y-3">
            {brand.colors.map((color) => (
              <button
                key={color}
                onClick={() => copyColor(color)}
                className="w-full flex items-center gap-3 p-2 rounded-lg hover:bg-[var(--bg-secondary)] transition-colors group"
              >
                <div
                  className="w-10 h-10 rounded-lg border border-[var(--border)] flex-shrink-0"
                  style={{ backgroundColor: color }}
                />
                <div className="flex-1 text-left">
                  <p className="text-sm font-mono font-medium">{color}</p>
                </div>
                {copiedColor === color ? (
                  <Check className="w-4 h-4 text-[var(--success)]" />
                ) : (
                  <Copy className="w-4 h-4 text-[var(--text-tertiary)] opacity-0 group-hover:opacity-100 transition-opacity" />
                )}
              </button>
            ))}
          </div>
        </motion.div>

        {/* Fonts + Aesthetic */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="space-y-6"
        >
          {/* Fonts */}
          <div className="glass-card p-6">
            <h2 className="text-sm font-semibold mb-4 flex items-center gap-2">
              <Type className="w-4 h-4 text-[var(--accent-magenta)]" />
              Typography
            </h2>
            <div className="space-y-3">
              {brand.fonts.map((font, i) => (
                <div
                  key={font}
                  className="flex items-center justify-between p-3 bg-[var(--bg-secondary)] rounded-lg"
                >
                  <div>
                    <p className="text-sm font-semibold">{font}</p>
                    <p className="text-xs text-[var(--text-tertiary)]">
                      {i === 0 ? "Headings" : "Body text"}
                    </p>
                  </div>
                  <span
                    className="text-lg"
                    style={{ fontFamily: font }}
                  >
                    Aa
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Aesthetic */}
          <div className="glass-card p-6">
            <h2 className="text-sm font-semibold mb-3 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-[var(--accent-purple)]" />
              Aesthetic & Industry
            </h2>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs text-[var(--text-tertiary)] uppercase tracking-wider">Style</span>
                <span className="text-sm font-medium gradient-text">{brand.aesthetic}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs text-[var(--text-tertiary)] uppercase tracking-wider">Industry</span>
                <span className="text-sm font-medium">{brand.industry}</span>
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Brand Summary */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="glass-card p-6 mb-6"
      >
        <h2 className="text-sm font-semibold mb-3">Brand DNA Summary</h2>
        <p className="text-sm text-[var(--text-secondary)] leading-relaxed">
          {brand.brand_summary}
        </p>
      </motion.div>

      {/* Recent Generations for This Brand */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.25 }}
      >
        <div className="flex items-center justify-between mb-4">
          <h2
            className="text-lg font-bold"
            style={{ fontFamily: "var(--font-outfit), sans-serif" }}
          >
            Recent Generations
          </h2>
          <Link
            href="/library"
            className="text-sm text-[var(--accent-cyan)] hover:underline"
          >
            View all →
          </Link>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {recentImages.map((img) => (
            <div key={img.id} className="glass-card overflow-hidden group cursor-pointer">
              <div className={`aspect-square bg-gradient-to-br ${img.gradient} flex items-center justify-center`}>
                <ImageIcon className="w-6 h-6 text-white/30" />
              </div>
              <div className="p-3">
                <p className="text-xs font-medium truncate">{img.prompt}</p>
                <div className="flex items-center gap-1.5 mt-1">
                  <span className="text-[10px] text-[var(--text-tertiary)]">{img.ratio}</span>
                  <span className="text-[var(--border)]">·</span>
                  <span className="text-[10px] text-[var(--text-tertiary)] flex items-center gap-0.5">
                    <Clock className="w-2.5 h-2.5" />{img.time}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
