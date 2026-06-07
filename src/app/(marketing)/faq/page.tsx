"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const faqs = [
  {
    question: "What exactly is QuadBrand?",
    answer: "QuadBrand is an AI-powered visual generation platform designed specifically for brands. Unlike generic AI image generators, QuadBrand allows you to define your brand's unique color palette, typography, and aesthetic. Every image you generate automatically adheres to these guidelines.",
  },
  {
    question: "How does the brand onboarding work?",
    answer: "You simply paste your company's website URL. Our system scrapes the public site and uses a large language model (Gemini 2.0 Flash) to intelligently extract your exact hex codes, fonts, and visual style. You can also manually input these details if you prefer.",
  },
  {
    question: "Which AI models do you use?",
    answer: "For image generation, we utilize Replicate to run state-of-the-art diffusion models, currently defaulting to FLUX 1.1 Pro for the highest quality commercial outputs. We also offer standard and fast models for quicker iteration.",
  },
  {
    question: "How do credits work?",
    answer: "Each image generation costs credits depending on the model you use. Fast models cost 1 credit, Standard models cost 2 credits, and Pro models cost 5 credits. Generating multiple aspect ratios at once multiplies the cost accordingly.",
  },
  {
    question: "Can I cancel my subscription at any time?",
    answer: "Absolutely. You can cancel your subscription from the Billing dashboard at any time. You will retain access to your plan until the end of your current billing cycle.",
  },
  {
    question: "Do I own the images I generate?",
    answer: "Yes! All images generated on paid plans come with full commercial rights. You can use them in your marketing campaigns, website, social media, and paid ads without any restrictions.",
  },
];

export default function FAQPage() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <div className="pt-32 pb-20 container-narrow min-h-screen">
      <div className="max-w-2xl mx-auto text-center mb-16">
        <h1 
          className="text-4xl md:text-5xl font-bold tracking-tight mb-4"
          style={{ fontFamily: "var(--font-outfit), sans-serif" }}
        >
          Frequently Asked <span className="gradient-text">Questions</span>
        </h1>
        <p className="text-lg text-[var(--text-secondary)]">
          Everything you need to know about the product and billing.
        </p>
      </div>

      <div className="max-w-3xl mx-auto space-y-4">
        {faqs.map((faq, index) => {
          const isOpen = openIndex === index;
          return (
            <div 
              key={index} 
              className={`rounded-2xl border transition-colors duration-200 overflow-hidden ${isOpen ? "bg-[var(--bg-card)] border-[var(--accent-cyan)] shadow-sm" : "bg-[var(--bg-secondary)] border-[var(--border)] hover:border-[var(--border-hover)]"}`}
            >
              <button
                onClick={() => setOpenIndex(isOpen ? null : index)}
                className="w-full px-6 py-5 flex items-center justify-between text-left"
              >
                <span className="font-semibold">{faq.question}</span>
                <ChevronDown className={`w-5 h-5 text-[var(--text-tertiary)] transition-transform duration-300 ${isOpen ? "rotate-180 text-[var(--accent-cyan)]" : ""}`} />
              </button>
              <AnimatePresence>
                {isOpen && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3, ease: "easeInOut" }}
                  >
                    <div className="px-6 pb-5 text-[var(--text-secondary)] leading-relaxed border-t border-[var(--border)] pt-4 mt-2">
                      {faq.answer}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </div>
    </div>
  );
}
