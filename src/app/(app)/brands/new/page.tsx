"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Globe,
  Upload,
  Loader2,
  Palette,
  Type,
  Sparkles,
  Check,
  ArrowRight,
  Plus,
  X,
} from "lucide-react";
import Link from "next/link";

type Tab = "url" | "manual";
type OnboardingStep = "input" | "analyzing" | "review";

export default function NewBrandPage() {
  const [activeTab, setActiveTab] = useState<Tab>("url");
  const [url, setUrl] = useState("");
  const [step, setStep] = useState<OnboardingStep>("input");

  // Manual form state
  const [brandName, setBrandName] = useState("");
  const [colors, setColors] = useState<string[]>(["#00D4FF", "#FF00E5"]);
  const [newColor, setNewColor] = useState("#000000");
  const [fonts, setFonts] = useState<string[]>([]);
  const [fontInput, setFontInput] = useState("");

  // Extracted brand data (real state)
  const [extractedBrand, setExtractedBrand] = useState<{
    name: string;
    colors: string[];
    fonts: string[];
    aesthetic: string;
    summary: string;
  } | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleAnalyze = async () => {
    if (!url) return;
    setStep("analyzing");
    setError(null);
    
    try {
      // Create a basic name from the URL
      let defaultName = "New Brand";
      try {
        const urlObj = new URL(url.startsWith('http') ? url : `https://${url}`);
        defaultName = urlObj.hostname.replace('www.', '').split('.')[0];
        // Capitalize first letter
        defaultName = defaultName.charAt(0).toUpperCase() + defaultName.slice(1);
      } catch (e) {
        // ignore invalid URL parsing for name
      }

      const response = await fetch("/api/brands/onboard", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          url,
          name: defaultName,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to analyze brand");
      }

      const result = await response.json();
      
      setExtractedBrand({
        name: defaultName,
        colors: result.data.colors || [],
        fonts: result.data.fonts || [],
        aesthetic: result.data.aesthetic || "Modern",
        summary: result.data.brand_summary || "",
      });
      
      setStep("review");
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Something went wrong.");
      setStep("input");
    }
  };

  const addColor = () => {
    if (!colors.includes(newColor)) {
      setColors([...colors, newColor]);
    }
  };

  const addFont = () => {
    if (fontInput && !fonts.includes(fontInput)) {
      setFonts([...fonts, fontInput]);
      setFontInput("");
    }
  };

  return (
    <div className="max-w-3xl mx-auto">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h1
          className="text-2xl md:text-3xl font-bold tracking-tight mb-1"
          style={{ fontFamily: "var(--font-outfit), sans-serif" }}
          id="new-brand-heading"
        >
          Add a New Brand
        </h1>
        <p className="text-[var(--text-secondary)]">
          Extract your brand identity from a URL or set it up manually.
        </p>
      </motion.div>

      {/* Tab Selector */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="flex gap-1 p-1 bg-[var(--bg-elevated)] rounded-xl mb-8 w-fit"
        id="brand-tabs"
      >
        {[
          { key: "url" as Tab, label: "Paste URL", icon: Globe },
          { key: "manual" as Tab, label: "Manual Setup", icon: Upload },
        ].map((tab) => (
          <button
            key={tab.key}
            onClick={() => {
              setActiveTab(tab.key);
              setStep("input");
            }}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
              activeTab === tab.key
                ? "bg-[var(--bg-card)] text-[var(--text-primary)] shadow-sm"
                : "text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
            }`}
          >
            <tab.icon className="w-4 h-4" />
            {tab.label}
          </button>
        ))}
      </motion.div>

      {/* URL Tab */}
      <AnimatePresence mode="wait">
        {activeTab === "url" && (
          <motion.div
            key="url"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16 }}
            transition={{ duration: 0.3 }}
          >
            {step === "input" && (
              <div className="glass-card p-8">
                <div className="text-center mb-6">
                  <div
                    className="w-14 h-14 rounded-2xl mx-auto mb-4 flex items-center justify-center"
                    style={{ background: "var(--gradient-subtle)" }}
                  >
                    <Globe className="w-7 h-7 text-[var(--accent-cyan)]" />
                  </div>
                  <h2
                    className="text-lg font-bold mb-1"
                    style={{ fontFamily: "var(--font-outfit), sans-serif" }}
                  >
                    Paste your brand URL
                  </h2>
                  <p className="text-sm text-[var(--text-secondary)]">
                    We&apos;ll analyze your website and extract your brand identity
                    automatically.
                  </p>
                </div>

                <div className="space-y-4">
                  <input
                    type="url"
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                    placeholder="https://your-brand.com"
                    className="w-full px-4 py-3.5 rounded-xl border border-[var(--border)] bg-[var(--bg-secondary)] text-sm focus:outline-none focus:border-[var(--accent-cyan)] focus:ring-2 focus:ring-[var(--accent-cyan)]/20 transition-all duration-200 placeholder:text-[var(--text-tertiary)]"
                    id="brand-url-input"
                  />

                  <button
                    onClick={handleAnalyze}
                    disabled={!url}
                    className="btn-gradient w-full !rounded-xl !py-3.5 disabled:opacity-50 disabled:cursor-not-allowed"
                    id="brand-analyze-btn"
                  >
                    <Sparkles className="w-4 h-4" />
                    <span>Analyze Brand</span>
                  </button>
                  
                  {error && (
                    <p className="text-sm text-[var(--error)] mt-2 text-center">
                      {error}
                    </p>
                  )}
                </div>
              </div>
            )}

            {step === "analyzing" && (
              <div className="glass-card p-12 text-center">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                  className="w-16 h-16 mx-auto mb-6"
                >
                  <div
                    className="w-full h-full rounded-2xl flex items-center justify-center"
                    style={{ background: "var(--gradient-primary)" }}
                  >
                    <Sparkles className="w-7 h-7 text-white" />
                  </div>
                </motion.div>

                <h2
                  className="text-lg font-bold mb-2"
                  style={{ fontFamily: "var(--font-outfit), sans-serif" }}
                >
                  Analyzing your brand...
                </h2>

                <div className="space-y-3 max-w-xs mx-auto mt-6">
                  {[
                    { label: "Scraping website", done: true },
                    { label: "Extracting colors", done: true },
                    { label: "Detecting fonts", done: false },
                    { label: "Analyzing aesthetic", done: false },
                  ].map((task, i) => (
                    <div key={i} className="flex items-center gap-3 text-sm">
                      {task.done ? (
                        <Check className="w-4 h-4 text-[var(--success)]" />
                      ) : (
                        <Loader2 className="w-4 h-4 text-[var(--accent-cyan)] animate-spin" />
                      )}
                      <span
                        className={
                          task.done
                            ? "text-[var(--text-primary)]"
                            : "text-[var(--text-secondary)]"
                        }
                      >
                        {task.label}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {step === "review" && (
              <div className="space-y-6">
                <div className="glass-card p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <Check className="w-5 h-5 text-[var(--success)]" />
                    <h2
                      className="text-lg font-bold"
                      style={{ fontFamily: "var(--font-outfit), sans-serif" }}
                    >
                      Brand Identity Extracted
                    </h2>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Colors */}
                    <div>
                      <h3 className="text-sm font-semibold mb-3 flex items-center gap-2">
                        <Palette className="w-4 h-4 text-[var(--accent-cyan)]" />
                        Colors
                      </h3>
                      <div className="flex gap-2 flex-wrap">
                        {extractedBrand?.colors.map((color) => (
                          <div
                            key={color}
                            className="group relative"
                            title={color}
                          >
                            <div
                              className="w-10 h-10 rounded-lg border border-[var(--border)] cursor-pointer transition-transform duration-200 hover:scale-110"
                              style={{ backgroundColor: color }}
                            />
                            <span className="absolute -bottom-5 left-1/2 -translate-x-1/2 text-[9px] text-[var(--text-tertiary)] opacity-0 group-hover:opacity-100 transition-opacity">
                              {color}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Fonts */}
                    <div>
                      <h3 className="text-sm font-semibold mb-3 flex items-center gap-2">
                        <Type className="w-4 h-4 text-[var(--accent-magenta)]" />
                        Fonts
                      </h3>
                      <div className="space-y-1">
                        {extractedBrand?.fonts.map((font) => (
                          <div
                            key={font}
                            className="text-sm text-[var(--text-secondary)] bg-[var(--bg-secondary)] px-3 py-1.5 rounded-lg inline-block mr-2"
                          >
                            {font}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Aesthetic & Summary */}
                  <div className="mt-6 pt-6 border-t border-[var(--border)]">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-xs font-semibold uppercase tracking-wider text-[var(--text-tertiary)]">
                        Aesthetic
                      </span>
                      <span className="text-sm font-medium gradient-text">
                        {extractedBrand?.aesthetic}
                      </span>
                    </div>
                    <p className="text-sm text-[var(--text-secondary)] leading-relaxed">
                      {extractedBrand?.summary}
                    </p>
                  </div>
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={() => setStep("input")}
                    className="btn-secondary flex-1"
                  >
                    Re-analyze
                  </button>
                  <Link href="/dashboard" className="flex-1">
                    <button className="btn-gradient w-full">
                      <span>Save Brand</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </Link>
                </div>
              </div>
            )}
          </motion.div>
        )}

        {/* Manual Tab */}
        {activeTab === "manual" && (
          <motion.div
            key="manual"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16 }}
            transition={{ duration: 0.3 }}
            className="glass-card p-8"
          >
            <div className="space-y-6">
              {/* Brand Name */}
              <div>
                <label className="block text-sm font-medium mb-2">
                  Brand Name
                </label>
                <input
                  type="text"
                  value={brandName}
                  onChange={(e) => setBrandName(e.target.value)}
                  placeholder="My Awesome Brand"
                  className="w-full px-4 py-3 rounded-xl border border-[var(--border)] bg-[var(--bg-secondary)] text-sm focus:outline-none focus:border-[var(--accent-cyan)] focus:ring-2 focus:ring-[var(--accent-cyan)]/20 transition-all placeholder:text-[var(--text-tertiary)]"
                  id="brand-name-input"
                />
              </div>

              {/* Logo Upload */}
              <div>
                <label className="block text-sm font-medium mb-2">
                  Logo
                </label>
                <div className="border-2 border-dashed border-[var(--border)] rounded-xl p-8 text-center hover:border-[var(--accent-cyan)] transition-colors cursor-pointer">
                  <Upload className="w-8 h-8 mx-auto mb-2 text-[var(--text-tertiary)]" />
                  <p className="text-sm text-[var(--text-secondary)]">
                    Drop your logo here or click to upload
                  </p>
                  <p className="text-xs text-[var(--text-tertiary)] mt-1">
                    PNG, SVG, or JPG • Max 5MB
                  </p>
                </div>
              </div>

              {/* Colors */}
              <div>
                <label className="block text-sm font-medium mb-2">
                  Brand Colors
                </label>
                <div className="flex gap-2 flex-wrap mb-3">
                  {colors.map((color) => (
                    <div key={color} className="relative group">
                      <div
                        className="w-10 h-10 rounded-lg border border-[var(--border)]"
                        style={{ backgroundColor: color }}
                      />
                      <button
                        onClick={() =>
                          setColors(colors.filter((c) => c !== color))
                        }
                        className="absolute -top-1.5 -right-1.5 w-4 h-4 rounded-full bg-[var(--error)] text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <X className="w-2.5 h-2.5" />
                      </button>
                    </div>
                  ))}
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      value={newColor}
                      onChange={(e) => setNewColor(e.target.value)}
                      className="w-10 h-10 rounded-lg border border-[var(--border)] cursor-pointer"
                    />
                    <button
                      onClick={addColor}
                      className="w-10 h-10 rounded-lg border border-dashed border-[var(--border)] flex items-center justify-center text-[var(--text-tertiary)] hover:border-[var(--accent-cyan)] hover:text-[var(--accent-cyan)] transition-colors"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Fonts */}
              <div>
                <label className="block text-sm font-medium mb-2">
                  Fonts
                </label>
                <div className="flex gap-2 flex-wrap mb-3">
                  {fonts.map((font) => (
                    <span
                      key={font}
                      className="px-3 py-1.5 bg-[var(--bg-secondary)] rounded-lg text-sm flex items-center gap-2"
                    >
                      {font}
                      <button
                        onClick={() =>
                          setFonts(fonts.filter((f) => f !== font))
                        }
                      >
                        <X className="w-3 h-3 text-[var(--text-tertiary)] hover:text-[var(--error)]" />
                      </button>
                    </span>
                  ))}
                </div>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={fontInput}
                    onChange={(e) => setFontInput(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && addFont()}
                    placeholder="Enter font name"
                    className="flex-1 px-4 py-2.5 rounded-xl border border-[var(--border)] bg-[var(--bg-secondary)] text-sm focus:outline-none focus:border-[var(--accent-cyan)] transition-all placeholder:text-[var(--text-tertiary)]"
                  />
                  <button
                    onClick={addFont}
                    className="px-4 py-2.5 rounded-xl border border-[var(--border)] text-sm font-medium hover:bg-[var(--bg-secondary)] transition-colors"
                  >
                    Add
                  </button>
                </div>
              </div>

              {/* Submit */}
              <Link href="/dashboard">
                <button
                  className="btn-gradient w-full !rounded-xl !py-3.5 mt-4"
                  id="brand-save-manual"
                >
                  <span>Save Brand</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
