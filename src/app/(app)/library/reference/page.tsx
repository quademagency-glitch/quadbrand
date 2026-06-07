"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Search, Loader2, Sparkles, Filter, Copy } from "lucide-react";
import ImageDetailModal from "@/components/library/ImageDetailModal";

interface Ad {
  id: string;
  image_url: string;
  brand_name: string;
  industry: string;
  vertical: string;
  tags: string[];
}

export default function ReferenceLibraryPage() {
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [ads, setAds] = useState<Ad[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState<any | null>(null);

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
    }, 500);
    return () => clearTimeout(timer);
  }, [search]);

  useEffect(() => {
    async function fetchAds() {
      setLoading(true);
      try {
        const url = debouncedSearch ? `/api/reference-ads?q=${encodeURIComponent(debouncedSearch)}` : "/api/reference-ads";
        const res = await fetch(url);
        const json = await res.json();
        if (json.status === "success") {
          setAds(json.data);
        }
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    }
    fetchAds();
  }, [debouncedSearch]);

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
        >
          Reference Ad Library
        </h1>
        <p className="text-[var(--text-secondary)]">
          Search high-performing ads and recreate them in your brand identity.
        </p>
      </motion.div>

      {/* Toolbar */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="flex flex-col sm:flex-row items-start sm:items-center gap-3 mb-6"
      >
        <div className="relative flex-1 w-full sm:max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--text-tertiary)]" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search 'minimalist bold typography for SaaS'..."
            className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-[var(--border)] bg-[var(--bg-card)] text-sm focus:outline-none focus:border-[var(--accent-cyan)] transition-all placeholder:text-[var(--text-tertiary)]"
          />
        </div>

        <button className="flex items-center gap-2 px-3 py-2.5 rounded-xl border border-[var(--border)] bg-[var(--bg-card)] text-sm text-[var(--text-secondary)] hover:border-[var(--border-hover)] transition-colors">
          <Filter className="w-4 h-4" />
          Industry / Tags
        </button>
      </motion.div>

      {/* Grid */}
      {loading ? (
        <div className="py-20 flex justify-center">
          <Loader2 className="w-8 h-8 animate-spin text-[var(--accent-cyan)]" />
        </div>
      ) : ads.length === 0 ? (
        <div className="text-center py-20">
          <p className="text-[var(--text-secondary)]">No reference ads found.</p>
        </div>
      ) : (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4"
        >
          {ads.map((ad, i) => (
            <motion.div
              key={ad.id}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.05 * i }}
              className="glass-card overflow-hidden group cursor-pointer"
              onClick={() => {
                setSelectedImage({
                  id: ad.id,
                  prompt: `Style of ${ad.brand_name} ad. ${ad.tags.join(", ")}.`,
                  aspect_ratio: "Unknown",
                  image_url: ad.image_url,
                  storage_path: null,
                  status: "completed",
                  created_at: new Date().toISOString(),
                });
              }}
            >
              <div className="aspect-square bg-[var(--bg-secondary)] relative">
                <img src={ad.image_url} alt={ad.brand_name} className="w-full h-full object-cover" />
                
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/60 transition-all duration-200 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 p-4">
                  <button className="btn-gradient w-full text-sm mb-2">
                    <Sparkles className="w-4 h-4 mr-2 inline" />
                    Recreate with my Brand
                  </button>
                  <button className="btn-secondary w-full text-sm">
                    <Copy className="w-4 h-4 mr-2 inline" />
                    Copy Prompt
                  </button>
                </div>
              </div>
              <div className="p-3 border-t border-[var(--border)]">
                <p className="text-sm font-semibold truncate">{ad.brand_name}</p>
                <p className="text-xs text-[var(--text-tertiary)] truncate">{ad.industry} • {ad.vertical}</p>
              </div>
            </motion.div>
          ))}
        </motion.div>
      )}

      <ImageDetailModal
        isOpen={!!selectedImage}
        onClose={() => setSelectedImage(null)}
        image={selectedImage}
      />
    </div>
  );
}
