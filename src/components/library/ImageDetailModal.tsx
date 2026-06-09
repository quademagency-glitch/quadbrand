"use client";

import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  Download,
  Copy,
  RefreshCw,
  Maximize2,
  Sparkles,
  Clock,
  Palette,
  Tag,
  Check,
  Trash2,
  Image as ImageIcon,
  Eraser,
  PenTool,
  Star,
  Loader2
} from "lucide-react";
import { useState, useEffect } from "react";

interface DBImage {
  id: string;
  prompt: string;
  aspect_ratio: string;
  image_url: string;
  storage_path: string | null;
  status: string;
  created_at: string;
  is_winner?: boolean;
  performance_note?: string;
  model?: string;
  brand?: string;
}

interface ImageDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  image: DBImage | null;
}

export default function ImageDetailModal({
  isOpen,
  onClose,
  image,
}: ImageDetailModalProps) {
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState<"details" | "actions">("details");
  
  const [isWinner, setIsWinner] = useState(image?.is_winner || false);
  const [note, setNote] = useState(image?.performance_note || "");
  const [savingNote, setSavingNote] = useState(false);
  const [processingAction, setProcessingAction] = useState<string | null>(null);

  useEffect(() => {
    if (image) {
      setIsWinner(image.is_winner || false);
      setNote(image.performance_note || "");
    }
  }, [image]);

  if (!image) return null;

  const handleSaveDetails = async () => {
    setSavingNote(true);
    try {
      await fetch("/api/images", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: image.id, is_winner: isWinner, performance_note: note }),
      });
    } catch (e) {
      console.error(e);
    } finally {
      setSavingNote(false);
    }
  };

  const handleProcessAction = async (actionType: string) => {
    setProcessingAction(actionType);
    try {
      const res = await fetch("/api/images/process", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ imageId: image.id, action: actionType, prompt: actionType === "edit" ? "Make it better" : undefined }),
      });
      const data = await res.json();
      if (data.status === "success") {
        onClose(); // Close modal on success, library will refresh (ideally)
      } else {
        alert("Action failed: " + data.error);
      }
    } catch (e) {
      console.error(e);
      alert("Failed to process action");
    } finally {
      setProcessingAction(null);
    }
  };

  const copyPrompt = () => {
    navigator.clipboard.writeText(image.prompt);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
            className="fixed inset-4 md:inset-8 lg:inset-16 z-50 bg-[var(--bg-card)] rounded-2xl border border-[var(--border)] shadow-2xl overflow-hidden flex flex-col md:flex-row"
            id="image-detail-modal"
          >
            {/* Image Preview */}
            <div className="flex-1 bg-[var(--bg-secondary)] flex items-center justify-center relative min-h-[300px] md:min-h-0 overflow-hidden">
              {image.image_url ? (
                <img src={image.image_url} alt={image.prompt} className="w-full h-full object-contain bg-[var(--bg-card)]" />
              ) : (
                <div className={`w-full h-full bg-[var(--bg-secondary)] flex items-center justify-center`}>
                  <div className="text-center">
                    <Sparkles className="w-10 h-10 text-[var(--text-tertiary)] mx-auto mb-2" />
                    <p className="text-xs text-[var(--text-tertiary)]">
                      Image not available
                    </p>
                  </div>
                </div>
              )}

              {/* Fullscreen button */}
              <button className="absolute top-4 right-4 p-2 rounded-lg bg-black/20 backdrop-blur-sm text-white/70 hover:text-white hover:bg-black/40 transition-all">
                <Maximize2 className="w-4 h-4" />
              </button>
            </div>

            {/* Details Panel */}
            <div className="w-full md:w-[380px] flex flex-col border-l border-[var(--border)]">
              {/* Header */}
              <div className="flex items-center justify-between p-4 border-b border-[var(--border)]">
                <h2
                  className="text-sm font-bold"
                  style={{ fontFamily: "var(--font-outfit), sans-serif" }}
                >
                  Image Details
                </h2>
                <button
                  onClick={onClose}
                  className="p-1.5 rounded-lg hover:bg-[var(--bg-secondary)] transition-colors"
                  id="modal-close"
                >
                  <X className="w-4 h-4 text-[var(--text-tertiary)]" />
                </button>
              </div>

              {/* Tabs */}
              <div className="flex border-b border-[var(--border)]">
                {(["details", "actions"] as const).map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`flex-1 py-2.5 text-sm font-medium transition-colors ${
                      activeTab === tab
                        ? "text-[var(--text-primary)] border-b-2 border-[var(--accent-cyan)]"
                        : "text-[var(--text-tertiary)] hover:text-[var(--text-secondary)]"
                    }`}
                  >
                    {tab.charAt(0).toUpperCase() + tab.slice(1)}
                  </button>
                ))}
              </div>

              {/* Tab Content */}
              <div className="flex-1 overflow-y-auto p-4">
                {activeTab === "details" ? (
                  <div className="space-y-5">
                    {/* Prompt */}
                    <div>
                      <label className="text-xs font-medium text-[var(--text-tertiary)] uppercase tracking-wider mb-1.5 block">
                        Prompt
                      </label>
                      <div className="bg-[var(--bg-secondary)] rounded-xl p-3 text-sm leading-relaxed relative group">
                        {image.prompt}
                        <button
                          onClick={copyPrompt}
                          className="absolute top-2 right-2 p-1.5 rounded-lg bg-[var(--bg-card)] border border-[var(--border)] opacity-0 group-hover:opacity-100 transition-opacity"
                          title="Copy prompt"
                        >
                          {copied ? (
                            <Check className="w-3 h-3 text-[var(--success)]" />
                          ) : (
                            <Copy className="w-3 h-3 text-[var(--text-tertiary)]" />
                          )}
                        </button>
                      </div>
                    </div>

                    {/* Metadata */}
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-[var(--text-tertiary)] flex items-center gap-1.5">
                          <Clock className="w-3 h-3" /> Created
                        </span>
                        <span className="text-sm">{new Date(image.created_at).toLocaleString()}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-[var(--text-tertiary)] flex items-center gap-1.5">
                          <Maximize2 className="w-3 h-3" /> Aspect Ratio
                        </span>
                        <span className="text-sm font-mono">{image.aspect_ratio}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-[var(--text-tertiary)] flex items-center gap-1.5">
                          <Sparkles className="w-3 h-3" /> Model
                        </span>
                        <span className="text-sm">{image.model || "Standard"}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-[var(--text-tertiary)] flex items-center gap-1.5">
                          <Palette className="w-3 h-3" /> Brand
                        </span>
                        <span className="text-sm">{image.brand || "Demo Brand"}</span>
                      </div>
                    </div>

                    {/* Tags */}
                    <div>
                      <div className="flex items-center justify-between mb-1.5">
                        <label className="text-xs font-medium text-[var(--text-tertiary)] uppercase tracking-wider block">
                          Winner
                        </label>
                        <button
                          onClick={() => {
                            setIsWinner(!isWinner);
                          }}
                          className={`flex items-center gap-1.5 px-2 py-1 rounded-md text-xs font-bold transition-colors ${
                            isWinner
                              ? "bg-yellow-400/20 text-yellow-600 border border-yellow-400"
                              : "bg-[var(--bg-secondary)] text-[var(--text-tertiary)] border border-[var(--border)] hover:bg-[var(--bg-card)]"
                          }`}
                        >
                          <Star className={`w-3.5 h-3.5 ${isWinner ? "fill-yellow-600" : ""}`} />
                          {isWinner ? "Winner" : "Mark as Winner"}
                        </button>
                      </div>
                    </div>

                    {/* Performance Note */}
                    <div>
                      <div className="flex items-center justify-between mb-1.5">
                        <label className="text-xs font-medium text-[var(--text-tertiary)] uppercase tracking-wider block">
                          Performance Note
                        </label>
                      </div>
                      <textarea
                        placeholder="How did this image perform? Note CTR or engagement..."
                        rows={3}
                        value={note}
                        onChange={(e) => setNote(e.target.value)}
                        className="w-full px-3 py-2 rounded-xl border border-[var(--border)] bg-[var(--bg-secondary)] text-sm focus:outline-none focus:border-[var(--accent-cyan)] transition-all resize-none placeholder:text-[var(--text-tertiary)]"
                      />
                      <div className="mt-2 flex justify-end">
                        <button 
                          onClick={handleSaveDetails}
                          disabled={savingNote}
                          className="px-3 py-1.5 bg-[var(--bg-card)] border border-[var(--border)] text-xs font-medium rounded-lg hover:border-[var(--accent-cyan)] transition-colors flex items-center gap-1"
                        >
                          {savingNote ? <Loader2 className="w-3 h-3 animate-spin" /> : <Check className="w-3 h-3" />}
                          Save Details
                        </button>
                      </div>
                    </div>
                  </div>
                ) : (
                  /* Actions Tab */
                  <div className="space-y-2">
                    {[
                      { id: "remove_bg", icon: Eraser, label: "Remove Background", desc: "Transparent PNG (1 credit)", color: "var(--accent-magenta)" },
                      { id: "vectorize", icon: PenTool, label: "Vectorize", desc: "High-quality AI vector (1 credit)", color: "var(--accent-purple)" },
                      { id: "edit", icon: Sparkles, label: "Edit with AI", desc: "Modify with prompt (2 credits)", color: "var(--accent-cyan)" },
                    ].map((action) => (
                      <button
                        key={action.id}
                        onClick={() => handleProcessAction(action.id)}
                        disabled={processingAction !== null}
                        className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-[var(--bg-secondary)] transition-colors text-left disabled:opacity-50"
                      >
                        <div
                          className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0"
                          style={{ background: `${action.color}15`, color: action.color }}
                        >
                          {processingAction === action.id ? (
                            <Loader2 className="w-4 h-4 animate-spin" />
                          ) : (
                            <action.icon className="w-4 h-4" />
                          )}
                        </div>
                        <div>
                          <p className="text-sm font-medium">{action.label}</p>
                          <p className="text-xs text-[var(--text-tertiary)]">{action.desc}</p>
                        </div>
                      </button>
                    ))}

                    <div className="border-t border-[var(--border)] pt-2 mt-3">
                      <button className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-[var(--error)]/5 transition-colors text-left text-[var(--error)]">
                        <Trash2 className="w-4 h-4" />
                        <span className="text-sm">Delete Image</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>

              <div className="p-4 border-t border-[var(--border)] flex gap-2">
                {image.image_url && (
                  <a href={image.image_url} download className="btn-gradient flex-1 text-sm !py-2.5 inline-flex justify-center items-center gap-2" id="modal-download">
                    <Download className="w-4 h-4" />
                    <span>Download</span>
                  </a>
                )}
                <button
                  onClick={copyPrompt}
                  className="btn-secondary text-sm !py-2.5"
                  id="modal-copy-prompt"
                >
                  {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                </button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
