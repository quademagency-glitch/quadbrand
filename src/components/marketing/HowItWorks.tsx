"use client";

import { motion } from "framer-motion";
import { Globe, Sparkles, Download } from "lucide-react";

const steps = [
  {
    number: "01",
    icon: Globe,
    title: "Paste Your Brand URL",
    description:
      "Enter your website or Instagram URL. Our AI instantly analyzes and extracts your complete brand identity — colors, fonts, logo, and visual style.",
    color: "var(--accent-cyan)",
    visual: (
      <div className="relative">
        <div className="bg-[var(--bg-card)] border border-[var(--border)] rounded-xl p-5">
          <label className="text-xs font-medium text-[var(--text-tertiary)] uppercase tracking-wider mb-2 block">
            Brand URL
          </label>
          <div className="flex items-center gap-3">
            <div className="flex-1 bg-[var(--bg-secondary)] rounded-lg px-4 py-3 text-sm text-[var(--text-secondary)] border border-[var(--border)]">
              https://your-brand.com
            </div>
            <div
              className="px-4 py-3 rounded-lg text-sm font-semibold text-white flex-shrink-0"
              style={{ background: "var(--accent-cyan)" }}
            >
              Analyze
            </div>
          </div>
          <div className="mt-4 flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-[var(--success)] animate-pulse" />
            <span className="text-xs text-[var(--success)]">Extracting brand identity...</span>
          </div>
        </div>
      </div>
    ),
  },
  {
    number: "02",
    icon: Sparkles,
    title: "Generate On-Brand Visuals",
    description:
      "Type a prompt and select your desired formats. QuadBrand injects your brand DNA into every generation — colors, fonts, and visual style are locked in.",
    color: "var(--accent-magenta)",
    visual: (
      <div className="relative">
        <div className="bg-[var(--bg-card)] border border-[var(--border)] rounded-xl p-5">
          <label className="text-xs font-medium text-[var(--text-tertiary)] uppercase tracking-wider mb-2 block">
            Prompt
          </label>
          <div className="bg-[var(--bg-secondary)] rounded-lg px-4 py-3 text-sm text-[var(--text-primary)] border border-[var(--border)] mb-4">
            Summer sale banner with tropical vibes
          </div>
          <div className="flex gap-2 mb-4">
            {["1:1", "16:9", "9:16"].map((ratio) => (
              <div
                key={ratio}
                className="px-3 py-1.5 rounded-lg text-xs font-medium border"
                style={{
                  borderColor: ratio === "1:1" ? "var(--accent-magenta)" : "var(--border)",
                  background: ratio === "1:1" ? "var(--accent-magenta)10" : "transparent",
                  color: ratio === "1:1" ? "var(--accent-magenta)" : "var(--text-secondary)",
                }}
              >
                {ratio}
              </div>
            ))}
          </div>
          <div className="grid grid-cols-3 gap-2">
            {[
              "from-cyan-300/40 to-teal-400/40",
              "from-pink-300/40 to-rose-400/40",
              "from-purple-300/40 to-indigo-400/40",
            ].map((g, i) => (
              <div
                key={i}
                className={`aspect-square bg-gradient-to-br ${g} rounded-lg shimmer`}
              />
            ))}
          </div>
        </div>
      </div>
    ),
  },
  {
    number: "03",
    icon: Download,
    title: "Export & Deploy",
    description:
      "Download your assets in any format, resize for any platform, or export directly. Every visual is ready to post — no design tool needed.",
    color: "var(--accent-purple)",
    visual: (
      <div className="relative">
        <div className="bg-[var(--bg-card)] border border-[var(--border)] rounded-xl p-5">
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs font-medium text-[var(--text-tertiary)] uppercase tracking-wider">
              Export Ready
            </span>
            <div className="flex items-center gap-1">
              <div className="w-2 h-2 rounded-full bg-[var(--success)]" />
              <span className="text-xs text-[var(--success)]">3 assets</span>
            </div>
          </div>
          {["Instagram Post — 1080×1080", "Story — 1080×1920", "Banner — 1920×1080"].map(
            (name, i) => (
              <div
                key={i}
                className="flex items-center justify-between py-2.5 border-b border-[var(--border)] last:border-0"
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`w-8 h-8 rounded-lg bg-gradient-to-br ${
                      i === 0
                        ? "from-cyan-400/30 to-blue-400/30"
                        : i === 1
                        ? "from-pink-400/30 to-rose-400/30"
                        : "from-purple-400/30 to-indigo-400/30"
                    }`}
                  />
                  <span className="text-sm">{name}</span>
                </div>
                <Download className="w-4 h-4 text-[var(--text-tertiary)]" />
              </div>
            )
          )}
        </div>
      </div>
    ),
  },
];

export default function HowItWorks() {
  return (
    <section
      className="section-padding bg-[var(--bg-secondary)] relative"
      id="how-it-works"
    >
      <div className="container-narrow">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="text-center mb-20"
        >
          <span className="inline-block text-sm font-semibold gradient-text uppercase tracking-widest mb-3">
            How It Works
          </span>
          <h2
            className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight mb-4"
            style={{ fontFamily: "var(--font-outfit), sans-serif" }}
          >
            Three Steps to
            <br />
            <span className="gradient-text">On-Brand Everything</span>
          </h2>
          <p className="text-lg text-[var(--text-secondary)] max-w-xl mx-auto">
            Go from zero to scroll-stopping visuals in under a minute.
          </p>
        </motion.div>

        {/* Steps */}
        <div className="space-y-20 md:space-y-32">
          {steps.map((step, i) => (
            <motion.div
              key={step.number}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className={`grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-16 items-center ${
                i % 2 !== 0 ? "md:direction-rtl" : ""
              }`}
              id={`step-${step.number}`}
            >
              {/* Text */}
              <div className={i % 2 !== 0 ? "md:order-2" : ""}>
                <div className="flex items-center gap-3 mb-4">
                  <span
                    className="text-5xl font-bold opacity-10"
                    style={{
                      fontFamily: "var(--font-outfit), sans-serif",
                      color: step.color,
                    }}
                  >
                    {step.number}
                  </span>
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center"
                    style={{ background: `${step.color}15`, color: step.color }}
                  >
                    <step.icon className="w-5 h-5" />
                  </div>
                </div>
                <h3
                  className="text-2xl md:text-3xl font-bold tracking-tight mb-3"
                  style={{ fontFamily: "var(--font-outfit), sans-serif" }}
                >
                  {step.title}
                </h3>
                <p className="text-[var(--text-secondary)] leading-relaxed text-base">
                  {step.description}
                </p>
              </div>

              {/* Visual */}
              <div className={i % 2 !== 0 ? "md:order-1" : ""}>
                {step.visual}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
