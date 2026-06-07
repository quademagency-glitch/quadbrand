"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Download,
  Filter,
  Search,
  Grid3x3,
  List,
  Clock,
  Sparkles,
  Loader2,
} from "lucide-react";
import ImageDetailModal from "@/components/library/ImageDetailModal";

interface DBImage {
  id: string;
  prompt: string;
  aspect_ratio: string;
  image_url: string;
  storage_path: string | null;
  status: string;
  created_at: string;
}

export default function LibraryPage() {
  const [view, setView] = useState<"grid" | "list">("grid");
  const [search, setSearch] = useState("");
  const [selectedImage, setSelectedImage] = useState<DBImage | null>(null);
  
  const [images, setImages] = useState<DBImage[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchImages() {
      try {
        const res = await fetch("/api/images");
        const json = await res.json();
        if (json.status === "success") {
          setImages(json.data);
        }
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    }
    fetchImages();
  }, []);

  return (
    <div className="max-w-6xl">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-6"
      >
        <h1
          className="text-2xl md:text-3xl font-bold tracking-tight mb-1"
          style={{ fontFamily: "var(--font-outfit), sans-serif" }}
          id="library-heading"
        >
          Image Library
        </h1>
        <p className="text-[var(--text-secondary)]">
          Browse and manage all your generated images.
        </p>
      </motion.div>

      {/* Toolbar */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="flex flex-col sm:flex-row items-start sm:items-center gap-3 mb-6"
      >
        <div className="relative flex-1 w-full sm:max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--text-tertiary)]" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by prompt..."
            className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-[var(--border)] bg-[var(--bg-card)] text-sm focus:outline-none focus:border-[var(--accent-cyan)] transition-all placeholder:text-[var(--text-tertiary)]"
            id="library-search"
          />
        </div>

        <div className="flex items-center gap-2">
          <button className="flex items-center gap-2 px-3 py-2.5 rounded-xl border border-[var(--border)] bg-[var(--bg-card)] text-sm text-[var(--text-secondary)] hover:border-[var(--border-hover)] transition-colors">
            <Filter className="w-4 h-4" />
            Filters
          </button>
          <div className="flex border border-[var(--border)] rounded-xl overflow-hidden">
            <button
              onClick={() => setView("grid")}
              className={`p-2.5 transition-colors ${
                view === "grid"
                  ? "bg-[var(--accent-cyan-light)] text-[var(--accent-cyan)]"
                  : "bg-[var(--bg-card)] text-[var(--text-tertiary)]"
              }`}
              id="library-grid-view"
            >
              <Grid3x3 className="w-4 h-4" />
            </button>
            <button
              onClick={() => setView("list")}
              className={`p-2.5 transition-colors ${
                view === "list"
                  ? "bg-[var(--accent-cyan-light)] text-[var(--accent-cyan)]"
                  : "bg-[var(--bg-card)] text-[var(--text-tertiary)]"
              }`}
              id="library-list-view"
            >
              <List className="w-4 h-4" />
            </button>
          </div>
        </div>
      </motion.div>

      {loading ? (
        <div className="py-20 flex justify-center">
          <Loader2 className="w-8 h-8 animate-spin text-[var(--accent-cyan)]" />
        </div>
      ) : images.length === 0 ? (
        <div className="text-center py-20">
          <p className="text-[var(--text-secondary)]">No images generated yet.</p>
        </div>
      ) : (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className={
          view === "grid"
            ? "grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4"
            : "space-y-3"
        }
      >
        {images.map((img, i) => (
          <motion.div
            key={img.id}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.05 * i }}
            onClick={() => setSelectedImage(img)}
            className={
              view === "grid"
                ? "group cursor-pointer"
                : "glass-card p-4 flex items-center gap-4 cursor-pointer group"
            }
          >
            {view === "grid" ? (
              <div className="glass-card overflow-hidden">
                <div className="aspect-square bg-[var(--bg-secondary)] relative">
                  {img.image_url ? (
                    <img src={img.image_url} alt={img.prompt} className="w-full h-full object-cover" />
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <Sparkles className="w-6 h-6 text-[var(--text-tertiary)]" />
                    </div>
                  )}
                  {/* Hover overlay */}
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-all duration-200 flex items-center justify-center opacity-0 group-hover:opacity-100">
                    <div className="flex gap-2">
                      <button className="w-8 h-8 rounded-lg bg-white/20 backdrop-blur-sm flex items-center justify-center text-white hover:bg-white/30 transition-colors">
                        <Download className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
                <div className="p-3">
                  <p className="text-xs font-medium truncate">{img.prompt}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-[10px] text-[var(--text-tertiary)]">
                      {img.aspect_ratio}
                    </span>
                    <span className="text-[var(--border)]">·</span>
                    <span className="text-[10px] text-[var(--text-tertiary)] flex items-center gap-0.5">
                      <Clock className="w-2.5 h-2.5" />
                      {new Date(img.created_at).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              </div>
            ) : (
              <>
                <div
                  className={`w-14 h-14 rounded-lg bg-[var(--bg-secondary)] flex-shrink-0 flex items-center justify-center overflow-hidden`}
                >
                  {img.image_url ? (
                    <img src={img.image_url} alt={img.prompt} className="w-full h-full object-cover" />
                  ) : (
                    <Sparkles className="w-4 h-4 text-[var(--text-tertiary)]" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{img.prompt}</p>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span className="text-xs text-[var(--text-tertiary)]">{img.aspect_ratio}</span>
                    <span className="text-[var(--border)]">·</span>
                    <span className="text-xs text-[var(--text-tertiary)] flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {new Date(img.created_at).toLocaleDateString()}
                    </span>
                  </div>
                </div>
                <a href={img.image_url} download className="p-2 rounded-lg hover:bg-[var(--bg-secondary)] transition-colors">
                  <Download className="w-4 h-4 text-[var(--text-tertiary)]" />
                </a>
              </>
            )}
          </motion.div>
        ))}
      </motion.div>
      )}

      {/* Image Detail Modal */}
      <ImageDetailModal
        isOpen={!!selectedImage}
        onClose={() => setSelectedImage(null)}
        image={selectedImage}
      />
    </div>
  );
}
