"use client";

import { motion } from "framer-motion";
import {
  Globe,
  Palette,
  ImageIcon,
  Layers,
  Zap,
  Shield,
} from "lucide-react";

const features = [
  {
    icon: Globe,
    title: "Instant Brand Extraction",
    description:
      "Paste any URL and our AI instantly extracts your brand colors, fonts, logo, and visual style — no manual setup needed.",
    color: "var(--accent-cyan)",
  },
  {
    icon: ImageIcon,
    title: "AI Image Generation",
    description:
      "Generate stunning, on-brand marketing visuals with a single prompt. Every output is automatically styled to match your brand.",
    color: "var(--accent-magenta)",
  },
  {
    icon: Layers,
    title: "Multi-Ratio Export",
    description:
      "Generate all social sizes simultaneously — Instagram Story, Post, Facebook Banner, YouTube Thumbnail — in one click.",
    color: "var(--accent-purple)",
  },
  {
    icon: Palette,
    title: "Brand-Locked Design",
    description:
      "Your exact hex colors, font families, and style rules are injected into every generation. No more off-brand outputs.",
    color: "var(--accent-cyan)",
  },
  {
    icon: Zap,
    title: "3× Cheaper Than Bloom",
    description:
      "Same quality, dramatically lower price. Start free with 20 credits. Pro plans from just $9/month.",
    color: "var(--accent-magenta)",
  },
  {
    icon: Shield,
    title: "Team Workspaces",
    description:
      "Invite your team, share a credit pool, and keep everyone creating under one consistent brand identity.",
    color: "var(--accent-purple)",
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: [0.4, 0, 0.2, 1] as const },
  },
};

export default function FeatureGrid() {
  return (
    <section className="section-padding relative" id="features">
      <div className="container-narrow">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="inline-block text-sm font-semibold gradient-text uppercase tracking-widest mb-3">
            Features
          </span>
          <h2
            className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight mb-4"
            style={{ fontFamily: "var(--font-outfit), sans-serif" }}
          >
            Everything You Need to
            <br />
            <span className="gradient-text">Create On-Brand</span>
          </h2>
          <p className="text-lg text-[var(--text-secondary)] max-w-xl mx-auto">
            From brand extraction to multi-format export, QuadBrand handles the
            entire creative workflow.
          </p>
        </motion.div>

        {/* Feature Cards Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {features.map((feature) => (
            <motion.div
              key={feature.title}
              variants={itemVariants}
              className="glass-card p-6 group cursor-default"
              id={`feature-${feature.title.toLowerCase().replace(/\s+/g, "-")}`}
            >
              {/* Icon */}
              <div
                className="w-12 h-12 rounded-xl flex items-center justify-center mb-4 transition-transform duration-300 group-hover:scale-110"
                style={{
                  background: `${feature.color}15`,
                  color: feature.color,
                }}
              >
                <feature.icon className="w-6 h-6" />
              </div>

              {/* Title */}
              <h3
                className="text-lg font-bold mb-2 tracking-tight"
                style={{ fontFamily: "var(--font-outfit), sans-serif" }}
              >
                {feature.title}
              </h3>

              {/* Description */}
              <p className="text-sm text-[var(--text-secondary)] leading-relaxed">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
