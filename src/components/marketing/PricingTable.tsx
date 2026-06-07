"use client";

import { motion } from "framer-motion";
import { Check, Sparkles, ArrowRight } from "lucide-react";
import Link from "next/link";

interface PricingPlan {
  name: string;
  price: string;
  period: string;
  credits: string;
  description: string;
  features: string[];
  highlighted: boolean;
  cta: string;
  badge?: string;
}

const plans: PricingPlan[] = [
  {
    name: "Free",
    price: "$0",
    period: "",
    credits: "20 credits",
    description: "Try QuadBrand with no commitment.",
    features: [
      "1 brand",
      "20 credits/month",
      "Standard model",
      "1:1 aspect ratio",
      "Community support",
    ],
    highlighted: false,
    cta: "Start Free",
  },
  {
    name: "Starter",
    price: "$9",
    period: "/mo",
    credits: "200 credits",
    description: "For solo founders and small teams.",
    features: [
      "3 brands",
      "200 credits/month",
      "Standard + Fast models",
      "All aspect ratios",
      "Brand URL extraction",
      "Email support",
    ],
    highlighted: false,
    cta: "Get Started",
  },
  {
    name: "Pro",
    price: "$29",
    period: "/mo",
    credits: "800 credits",
    description: "For growing brands that need volume.",
    features: [
      "Unlimited brands",
      "800 credits/month",
      "All models (including Pro)",
      "All aspect ratios",
      "Multi-ratio generation",
      "API access",
      "Priority support",
    ],
    highlighted: true,
    cta: "Go Pro",
    badge: "Most Popular",
  },
  {
    name: "Team",
    price: "$79",
    period: "/mo",
    credits: "3,000 credits",
    description: "For teams that create together.",
    features: [
      "Unlimited brands",
      "3,000 credits/month",
      "5 team seats",
      "All Pro features",
      "Shared credit pool",
      "Variant generation",
      "Dedicated support",
    ],
    highlighted: false,
    cta: "Start Team",
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

export default function PricingTable() {
  return (
    <section className="section-padding relative" id="pricing">
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
            Pricing
          </span>
          <h2
            className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight mb-4"
            style={{ fontFamily: "var(--font-outfit), sans-serif" }}
          >
            Simple, Transparent
            <br />
            <span className="gradient-text">Pricing</span>
          </h2>
          <p className="text-lg text-[var(--text-secondary)] max-w-xl mx-auto">
            Start free. Upgrade when you need more.
            <br />
            <strong className="text-[var(--text-primary)]">3× cheaper</strong> than the
            competition.
          </p>
        </motion.div>

        {/* Pricing Cards */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
        >
          {plans.map((plan) => (
            <motion.div
              key={plan.name}
              variants={itemVariants}
              className={`relative rounded-2xl p-6 flex flex-col ${
                plan.highlighted
                  ? "pricing-popular bg-[var(--bg-card)] shadow-lg scale-[1.02]"
                  : "glass-card"
              }`}
              id={`pricing-${plan.name.toLowerCase()}`}
            >
              {/* Badge */}
              {plan.badge && (
                <div
                  className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full text-xs font-bold text-white"
                  style={{ background: "var(--gradient-primary)" }}
                >
                  {plan.badge}
                </div>
              )}

              {/* Header */}
              <div className="mb-6">
                <h3
                  className="text-lg font-bold mb-1"
                  style={{ fontFamily: "var(--font-outfit), sans-serif" }}
                >
                  {plan.name}
                </h3>
                <p className="text-xs text-[var(--text-tertiary)] mb-4">
                  {plan.description}
                </p>
                <div className="flex items-baseline gap-1">
                  <span
                    className="text-4xl font-bold tracking-tight"
                    style={{ fontFamily: "var(--font-outfit), sans-serif" }}
                  >
                    {plan.price}
                  </span>
                  {plan.period && (
                    <span className="text-sm text-[var(--text-tertiary)]">
                      {plan.period}
                    </span>
                  )}
                </div>
                <p className="text-xs text-[var(--accent-cyan)] font-medium mt-1">
                  {plan.credits}
                </p>
              </div>

              {/* Features */}
              <ul className="space-y-3 mb-8 flex-1">
                {plan.features.map((feature) => (
                  <li
                    key={feature}
                    className="flex items-start gap-2.5 text-sm"
                  >
                    <Check
                      className="w-4 h-4 flex-shrink-0 mt-0.5"
                      style={{
                        color: plan.highlighted
                          ? "var(--accent-cyan)"
                          : "var(--accent-cyan)",
                      }}
                    />
                    <span className="text-[var(--text-secondary)]">
                      {feature}
                    </span>
                  </li>
                ))}
              </ul>

              {/* CTA Button */}
              <Link href="/signup" className="w-full">
                {plan.highlighted ? (
                  <button className="btn-gradient w-full text-sm !py-3">
                    <Sparkles className="w-4 h-4" />
                    <span>{plan.cta}</span>
                  </button>
                ) : (
                  <button className="btn-secondary w-full text-sm !py-3">
                    <span>{plan.cta}</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                )}
              </Link>
            </motion.div>
          ))}
        </motion.div>

        {/* Credit Pack Addon */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mt-12 text-center"
        >
          <div className="inline-flex items-center gap-3 glass-card px-6 py-3">
            <Sparkles className="w-4 h-4 text-[var(--accent-cyan)]" />
            <span className="text-sm text-[var(--text-secondary)]">
              Need more?{" "}
              <strong className="text-[var(--text-primary)]">
                $5 = 100 credits
              </strong>{" "}
              — top up anytime
            </span>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
