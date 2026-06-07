"use client";

import { motion } from "framer-motion";
import { ArrowRight, Sparkles } from "lucide-react";
import Link from "next/link";

export default function CTASection() {
  return (
    <section className="section-padding relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0" style={{ background: "var(--gradient-primary)", opacity: 0.05 }} />
      <div className="orb orb-cyan w-[300px] h-[300px] top-0 right-0 opacity-20" />
      <div className="orb orb-magenta w-[250px] h-[250px] bottom-0 left-0 opacity-20" />

      <div className="container-narrow relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="glass-card p-10 md:p-16 text-center relative overflow-hidden"
        >
          {/* Gradient border accent */}
          <div
            className="absolute top-0 left-1/2 -translate-x-1/2 w-1/2 h-1"
            style={{ background: "var(--gradient-primary)" }}
          />

          <Sparkles className="w-8 h-8 mx-auto mb-6 text-[var(--accent-cyan)]" />

          <h2
            className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight mb-4"
            style={{ fontFamily: "var(--font-outfit), sans-serif" }}
          >
            Ready to Create
            <br />
            <span className="gradient-text">On-Brand Magic?</span>
          </h2>

          <p className="text-lg text-[var(--text-secondary)] max-w-lg mx-auto mb-8">
            Join 500+ brands already generating scroll-stopping visuals with
            QuadBrand. Start free — no credit card required.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/signup">
              <button className="btn-gradient text-base !py-3.5 !px-8" id="cta-signup">
                <span>Get Started Free</span>
                <ArrowRight className="w-5 h-5" />
              </button>
            </Link>
            <p className="text-sm text-[var(--text-tertiary)]">
              20 free credits · No credit card
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
