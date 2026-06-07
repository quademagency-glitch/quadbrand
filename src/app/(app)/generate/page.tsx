"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Sparkles,
  Loader2,
  Download,
  Copy,
  RefreshCw,
  ChevronDown,
  Zap,
  Star,
  Crown,
  Check,
} from "lucide-react";
import UpgradeModal from "@/components/billing/UpgradeModal";

const aspectRatios = [
  { label: "1:1", name: "Square", w: 1, h: 1 },
  { label: "16:9", name: "Landscape", w: 16, h: 9 },
  { label: "9:16", name: "Story", w: 9, h: 16 },
  { label: "4:5", name: "Portrait", w: 4, h: 5 },
];

const models = [
  {
    id: "fast",
    label: "Fast",
    description: "Quick previews",
    credits: 1,
    icon: Zap,
    color: "var(--success)",
  },
  {
    id: "standard",
    label: "Standard",
    description: "Balanced quality",
    credits: 2,
    icon: Star,
    color: "var(--accent-cyan)",
  },
  {
    id: "pro",
    label: "Pro",
    description: "Maximum quality",
    credits: 5,
    icon: Crown,
    color: "var(--accent-magenta)",
  },
];

export default function GeneratePage() {
  const [prompt, setPrompt] = useState("");
  const [selectedRatios, setSelectedRatios] = useState<string[]>(["1:1"]);
  const [selectedModel, setSelectedModel] = useState("standard");
  const [generating, setGenerating] = useState(false);
  const [resultUrls, setResultUrls] = useState<string[]>([]);
  const [brandOpen, setBrandOpen] = useState(false);
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Mock checking for credits
  const credits = 20; // Changed to 20 for testing the API!

  const currentModel = models.find((m) => m.id === selectedModel)!;

  const handleGenerate = async () => {
    if (!prompt || selectedRatios.length === 0) return;

    if (credits < currentModel.credits * selectedRatios.length) {
      setShowUpgradeModal(true);
      return;
    }

    setGenerating(true);
    setResultUrls([]);
    setError(null);

    try {
      // In a real app we'd fetch the user's workspaceId on page load,
      // but for Phase 1 we can pass null or fetch it in the API like we did for onboard.
      // We will let the API resolve the workspace.
      
      const promises = selectedRatios.map(ratio => 
        fetch("/api/generate", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            prompt,
            aspectRatio: ratio,
            modelId: selectedModel,
            brandId: "mock-brand-id", // Hardcoded for demo if not selected
            workspaceId: null // API will fall back to default workspace
          })
        }).then(res => res.json())
      );

      const results = await Promise.all(promises);
      
      const failed = results.find(r => r.error);
      if (failed) throw new Error(failed.error);

      setResultUrls(results.map(r => r.imageUrl));
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Failed to generate image");
    } finally {
      setGenerating(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-6"
      >
        <h1
          className="text-2xl md:text-3xl font-bold tracking-tight mb-1"
          style={{ fontFamily: "var(--font-outfit), sans-serif" }}
          id="generate-heading"
        >
          Generate Image
        </h1>
        <p className="text-[var(--text-secondary)]">
          Create on-brand visuals with a single prompt.
        </p>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        {/* Left — Controls */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="lg:col-span-2 space-y-5"
        >
          {/* Brand Selector */}
          <div>
            <label className="block text-sm font-medium mb-2">Brand</label>
            <button
              onClick={() => setBrandOpen(!brandOpen)}
              className="w-full flex items-center justify-between px-4 py-3 rounded-xl border border-[var(--border)] bg-[var(--bg-card)] text-sm hover:border-[var(--border-hover)] transition-colors"
              id="generate-brand-select"
            >
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-md" style={{ background: "var(--gradient-primary)" }} />
                <span>Demo Brand</span>
              </div>
              <ChevronDown className={`w-4 h-4 text-[var(--text-tertiary)] transition-transform ${brandOpen ? "rotate-180" : ""}`} />
            </button>
          </div>

          {/* Prompt */}
          <div>
            <label className="block text-sm font-medium mb-2">Prompt</label>
            <div className="relative">
              <textarea
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="Describe the image you want to create..."
                rows={4}
                className="w-full px-4 py-3 rounded-xl border border-[var(--border)] bg-[var(--bg-card)] text-sm focus:outline-none focus:border-[var(--accent-cyan)] focus:ring-2 focus:ring-[var(--accent-cyan)]/20 transition-all resize-none placeholder:text-[var(--text-tertiary)]"
                id="generate-prompt"
              />
              <span className="absolute bottom-2 right-3 text-xs text-[var(--text-tertiary)]">
                {prompt.length}/500
              </span>
            </div>
          </div>

          {/* Aspect Ratio */}
          <div>
            <label className="block text-sm font-medium mb-2">
              Aspect Ratio
            </label>
            <div className="grid grid-cols-4 gap-2">
              {aspectRatios.map((ratio) => {
                const isSelected = selectedRatios.includes(ratio.label);
                return (
                  <button
                    key={ratio.label}
                    onClick={() => {
                      if (isSelected && selectedRatios.length === 1) return; // Prevent deselecting last
                      setSelectedRatios((prev) =>
                        isSelected
                          ? prev.filter((r) => r !== ratio.label)
                          : [...prev, ratio.label]
                      );
                    }}
                    className={`p-3 rounded-xl border text-center transition-all duration-200 relative overflow-hidden ${
                      isSelected
                        ? "border-[var(--accent-cyan)] bg-[var(--accent-cyan-light)] text-[var(--accent-cyan-dark)] shadow-sm"
                        : "border-[var(--border)] bg-[var(--bg-card)] text-[var(--text-secondary)] hover:border-[var(--border-hover)]"
                    }`}
                    id={`ratio-${ratio.label.replace(":", "x")}`}
                  >
                    {/* Multi-select checkmark indicator */}
                    {isSelected && selectedRatios.length > 1 && (
                      <div className="absolute top-1.5 right-1.5 w-3 h-3 rounded-full bg-[var(--accent-cyan)] flex items-center justify-center">
                        <Check className="w-2 h-2 text-white" />
                      </div>
                    )}
                    
                    {/* Ratio visual */}
                    <div className="flex justify-center mb-2">
                      <div
                        className={`border-2 rounded-sm ${
                          isSelected
                            ? "border-[var(--accent-cyan)]"
                            : "border-[var(--border)]"
                        }`}
                        style={{
                          width: `${(ratio.w / Math.max(ratio.w, ratio.h)) * 28}px`,
                          height: `${(ratio.h / Math.max(ratio.w, ratio.h)) * 28}px`,
                        }}
                      />
                    </div>
                    <p className="text-xs font-semibold">{ratio.label}</p>
                    <p className="text-[10px] text-[var(--text-tertiary)] mt-0.5">
                      {ratio.name}
                    </p>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Model */}
          <div>
            <label className="block text-sm font-medium mb-2">Model</label>
            <div className="space-y-2">
              {models.map((model) => (
                <button
                  key={model.id}
                  onClick={() => setSelectedModel(model.id)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl border text-left transition-all duration-200 ${
                    selectedModel === model.id
                      ? "border-[var(--accent-cyan)] bg-[var(--accent-cyan-light)]"
                      : "border-[var(--border)] bg-[var(--bg-card)] hover:border-[var(--border-hover)]"
                  }`}
                  id={`model-${model.id}`}
                >
                  <div
                    className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
                    style={{ background: `${model.color}15`, color: model.color }}
                  >
                    <model.icon className="w-4 h-4" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-semibold">{model.label}</p>
                    <p className="text-xs text-[var(--text-tertiary)]">
                      {model.description}
                    </p>
                  </div>
                  <span className="text-xs font-bold text-[var(--accent-cyan)]">
                    {model.credits} cr
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Generate Button */}
          <button
            onClick={handleGenerate}
            disabled={generating || !prompt || selectedRatios.length === 0}
            className="btn-gradient w-full !rounded-xl !py-3.5 text-base disabled:opacity-50 disabled:cursor-not-allowed group relative overflow-hidden"
            id="generate-submit"
          >
            <div className="relative z-10 flex items-center justify-center gap-2">
              {generating ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <Sparkles className="w-5 h-5" />
              )}
              <span>
                {generating
                  ? `Generating ${selectedRatios.length > 1 ? `${selectedRatios.length} images` : "image"}...`
                  : `Generate — ${currentModel.credits * selectedRatios.length} credits`}
              </span>
            </div>
            
            {/* Multi-ratio animation effect */}
            {!generating && selectedRatios.length > 1 && (
              <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
            )}
          </button>
          
          {error && (
            <p className="text-sm text-[var(--error)] text-center mt-3">
              {error}
            </p>
          )}
        </motion.div>

        {/* Right — Preview */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="lg:col-span-3"
        >
          <div className="glass-card p-6 min-h-[500px] flex flex-col">
            <div className="flex items-center justify-between mb-4">
              <h2
                className="text-sm font-semibold"
                style={{ fontFamily: "var(--font-outfit), sans-serif" }}
              >
                Preview
              </h2>
              {resultUrls.length > 0 && (
                <div className="flex items-center gap-2">
                  <button className="p-2 rounded-lg hover:bg-[var(--bg-secondary)] transition-colors" title="Download">
                    <Download className="w-4 h-4 text-[var(--text-secondary)]" />
                  </button>
                  <button className="p-2 rounded-lg hover:bg-[var(--bg-secondary)] transition-colors" title="Copy prompt">
                    <Copy className="w-4 h-4 text-[var(--text-secondary)]" />
                  </button>
                  <button className="p-2 rounded-lg hover:bg-[var(--bg-secondary)] transition-colors" title="Regenerate">
                    <RefreshCw className="w-4 h-4 text-[var(--text-secondary)]" />
                  </button>
                </div>
              )}
            </div>

            <div className="flex-1 flex items-center justify-center rounded-xl bg-[var(--bg-secondary)] border border-[var(--border)] overflow-hidden">
              <AnimatePresence mode="wait">
                {generating ? (
                  <motion.div
                    key="loading"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="text-center p-8"
                  >
                    <div className="relative w-20 h-20 mx-auto mb-4">
                      <div
                        className="absolute inset-0 rounded-2xl animate-spin"
                        style={{
                          background: "var(--gradient-primary)",
                          animationDuration: "3s",
                        }}
                      />
                      <div className="absolute inset-1 rounded-xl bg-[var(--bg-secondary)] flex items-center justify-center">
                        <Sparkles className="w-6 h-6 text-[var(--accent-cyan)]" />
                      </div>
                    </div>
                    <p className="text-sm font-medium mb-1">
                      Creating your image...
                    </p>
                    <p className="text-xs text-[var(--text-tertiary)]">
                      This usually takes 5-10 seconds
                    </p>
                  </motion.div>
                ) : resultUrls.length > 0 ? (
                  <motion.div
                    key="result"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className={`grid gap-4 w-full h-full p-4 overflow-y-auto ${resultUrls.length > 1 ? 'grid-cols-2' : 'grid-cols-1'}`}
                  >
                    {resultUrls.map((url, i) => (
                      <div key={i} className="relative group rounded-2xl overflow-hidden border border-[var(--border)] shadow-sm bg-[var(--bg-card)]">
                        <img
                          src={url}
                          alt={`Generated asset ${i}`}
                          className="w-full h-full object-cover"
                        />
                        
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300 flex flex-col justify-end p-4">
                          <div className="flex items-center gap-2">
                            <button className="p-2 rounded-lg bg-white/20 hover:bg-white/30 backdrop-blur-md text-white transition-colors flex-1 flex justify-center items-center gap-2 text-sm font-medium">
                              <Download className="w-4 h-4" />
                              Download
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </motion.div>
                ) : (
                  <motion.div
                    key="empty"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-center p-8"
                  >
                    <div className="w-16 h-16 rounded-2xl mx-auto mb-4 bg-[var(--bg-elevated)] flex items-center justify-center">
                      <Sparkles className="w-7 h-7 text-[var(--text-tertiary)]" />
                    </div>
                    <p className="text-sm font-medium text-[var(--text-secondary)]">
                      Your generated image will appear here
                    </p>
                    <p className="text-xs text-[var(--text-tertiary)] mt-1">
                      Write a prompt and click Generate
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </motion.div>
      </div>

      <UpgradeModal
        isOpen={showUpgradeModal}
        onClose={() => setShowUpgradeModal(false)}
        reason="no_credits"
      />
    </div>
  );
}
