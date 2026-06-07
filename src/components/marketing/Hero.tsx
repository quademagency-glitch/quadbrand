"use client";

import { motion } from "framer-motion";
import { ArrowRight, Sparkles, Play } from "lucide-react";
import Link from "next/link";

export default function Hero() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-16">
      {/* Animated Background Orbs */}
      <div className="orb orb-cyan w-[500px] h-[500px] -top-40 -left-40" />
      <div className="orb orb-magenta w-[400px] h-[400px] top-20 -right-32" />
      <div className="orb orb-purple w-[300px] h-[300px] bottom-20 left-1/3" />

      {/* Dot Pattern Overlay */}
      <div className="absolute inset-0 dot-pattern opacity-30" />

      {/* Content */}
      <div className="container-narrow relative z-10 text-center py-20 md:py-32">
        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-[var(--border)] bg-[var(--bg-card)] text-sm mb-8"
          id="hero-badge"
        >
          <Sparkles className="w-4 h-4 text-[var(--accent-cyan)]" />
          <span className="text-[var(--text-secondary)]">
            AI-powered brand intelligence
          </span>
          <span className="gradient-text font-semibold">— Now in Beta</span>
        </motion.div>

        {/* Headline */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight leading-[1.1] mb-6"
          style={{ fontFamily: "var(--font-outfit), sans-serif" }}
          id="hero-headline"
        >
          Generate On-Brand
          <br />
          <span className="gradient-text">Visuals in Seconds</span>
        </motion.h1>

        {/* Subheadline */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-lg md:text-xl text-[var(--text-secondary)] max-w-2xl mx-auto mb-10 leading-relaxed"
          id="hero-subheadline"
        >
          Paste your brand URL and let AI extract your identity. Then generate
          scroll-stopping marketing visuals that are{" "}
          <strong className="text-[var(--text-primary)]">100% on-brand</strong>{" "}
          — at half the price.
        </motion.p>

        {/* CTA Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4"
          id="hero-cta"
        >
          <Link href="/signup">
            <button className="btn-gradient text-base !py-3.5 !px-8">
              <span>Start Creating Free</span>
              <ArrowRight className="w-5 h-5" />
            </button>
          </Link>
          <button className="btn-secondary !py-3.5 !px-8 text-base" id="hero-demo-btn">
            <Play className="w-4 h-4 text-[var(--accent-cyan)]" />
            <span>Watch Demo</span>
          </button>
        </motion.div>

        {/* Social Proof */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="mt-16 flex flex-col items-center gap-4"
          id="hero-social-proof"
        >
          {/* Avatar Stack */}
          <div className="flex items-center -space-x-2">
            {[
              "bg-gradient-to-br from-cyan-400 to-blue-500",
              "bg-gradient-to-br from-purple-400 to-pink-500",
              "bg-gradient-to-br from-pink-400 to-rose-500",
              "bg-gradient-to-br from-amber-400 to-orange-500",
              "bg-gradient-to-br from-emerald-400 to-teal-500",
            ].map((gradient, i) => (
              <div
                key={i}
                className={`w-8 h-8 rounded-full ${gradient} border-2 border-white flex items-center justify-center text-[10px] text-white font-bold`}
              >
                {String.fromCharCode(65 + i)}
              </div>
            ))}
          </div>
          <p className="text-sm text-[var(--text-secondary)]">
            <strong className="text-[var(--text-primary)]">500+</strong> brands
            already generating on-brand visuals
          </p>
        </motion.div>

        {/* Hero Visual — Gradient Preview Cards */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="mt-20 relative"
          id="hero-visual"
        >
          <div className="relative max-w-4xl mx-auto">
            {/* Main Preview Card */}
            <div className="glass-card p-2 rounded-2xl overflow-hidden">
              <div className="relative aspect-[16/9] rounded-xl overflow-hidden bg-gradient-to-br from-[var(--bg-secondary)] to-[var(--bg-elevated)]">
                {/* Simulated Dashboard Preview */}
                <div className="absolute inset-0 p-6 md:p-10">
                  {/* Top Bar */}
                  <div className="flex items-center gap-3 mb-6">
                    <div className="flex gap-1.5">
                      <div className="w-3 h-3 rounded-full bg-red-400" />
                      <div className="w-3 h-3 rounded-full bg-yellow-400" />
                      <div className="w-3 h-3 rounded-full bg-green-400" />
                    </div>
                    <div className="flex-1 h-6 bg-[var(--bg-muted)] rounded-full max-w-xs" />
                  </div>

                  {/* Content Grid */}
                  <div className="grid grid-cols-3 gap-4 h-full pb-10">
                    {/* Sidebar */}
                    <div className="col-span-1 bg-[var(--bg-card)] rounded-lg p-4 border border-[var(--border)] hidden md:block">
                      <div className="space-y-3">
                        <div className="h-3 bg-[var(--bg-muted)] rounded w-2/3" />
                        <div className="h-3 bg-[var(--accent-cyan)] rounded w-full opacity-20" />
                        <div className="h-3 bg-[var(--bg-muted)] rounded w-4/5" />
                        <div className="h-3 bg-[var(--bg-muted)] rounded w-3/5" />
                        <div className="mt-6 h-8 rounded-lg" style={{ background: "var(--gradient-primary)", opacity: 0.3 }} />
                      </div>
                    </div>

                    {/* Main Content */}
                    <div className="col-span-3 md:col-span-2 flex flex-col gap-4">
                      <div className="bg-[var(--bg-card)] rounded-lg p-4 border border-[var(--border)] flex-1">
                        <div className="h-3 bg-[var(--bg-muted)] rounded w-1/3 mb-4" />
                        <div className="grid grid-cols-2 gap-3">
                          {[
                            "from-cyan-400/30 to-blue-400/30",
                            "from-pink-400/30 to-rose-400/30",
                            "from-purple-400/30 to-indigo-400/30",
                            "from-amber-400/30 to-orange-400/30",
                          ].map((g, i) => (
                            <div
                              key={i}
                              className={`aspect-square bg-gradient-to-br ${g} rounded-lg shimmer`}
                            />
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Floating Elements */}
            <motion.div
              animate={{ y: [0, -8, 0] }}
              transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
              className="absolute -right-4 top-12 glass-card px-4 py-3 hidden lg:flex items-center gap-3"
            >
              <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: "var(--gradient-primary)" }}>
                <Sparkles className="w-4 h-4 text-white" />
              </div>
              <div>
                <p className="text-xs font-semibold">Brand Extracted</p>
                <p className="text-[10px] text-[var(--text-tertiary)]">5 colors · 2 fonts · Logo</p>
              </div>
            </motion.div>

            <motion.div
              animate={{ y: [0, 8, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: 1 }}
              className="absolute -left-4 bottom-20 glass-card px-4 py-3 hidden lg:flex items-center gap-3"
            >
              <div className="w-8 h-8 rounded-full bg-[var(--success)] flex items-center justify-center">
                <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <div>
                <p className="text-xs font-semibold">Image Generated</p>
                <p className="text-[10px] text-[var(--text-tertiary)]">1:1 · On-brand · 2.3s</p>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
