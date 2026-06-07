"use client";

import { motion } from "framer-motion";
import { Plus, Palette, ArrowRight, Globe } from "lucide-react";
import Link from "next/link";

const brands = [
  {
    id: "1",
    name: "Demo Brand",
    url: "https://demo-brand.com",
    colors: ["#00D4FF", "#FF00E5", "#7B61FF", "#0F1019"],
    status: "ready",
    imagesGenerated: 7,
  },
];

export default function BrandsPage() {
  return (
    <div className="max-w-4xl">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between mb-8"
      >
        <div>
          <h1
            className="text-2xl md:text-3xl font-bold tracking-tight mb-1"
            style={{ fontFamily: "var(--font-outfit), sans-serif" }}
            id="brands-heading"
          >
            Your Brands
          </h1>
          <p className="text-[var(--text-secondary)]">
            Manage your brand identities and visual guidelines.
          </p>
        </div>
        <Link href="/brands/new">
          <button className="btn-gradient" id="brands-add">
            <Plus className="w-4 h-4" />
            <span>Add Brand</span>
          </button>
        </Link>
      </motion.div>

      {/* Brand Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {brands.map((brand, i) => (
          <motion.div
            key={brand.id}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
          >
            <Link href={`/brands/${brand.id}`}>
              <div className="glass-card p-5 cursor-pointer group" id={`brand-${brand.id}`}>
                <div className="flex items-start gap-4">
                  <div
                    className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 transition-transform duration-300 group-hover:scale-110"
                    style={{ background: "var(--gradient-primary)" }}
                  >
                    <Palette className="w-6 h-6 text-white" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-bold text-base mb-0.5">{brand.name}</h3>
                    <p className="text-xs text-[var(--text-tertiary)] flex items-center gap-1 mb-3">
                      <Globe className="w-3 h-3" />
                      {brand.url}
                    </p>

                    {/* Color Swatches */}
                    <div className="flex gap-1.5 mb-3">
                      {brand.colors.map((color) => (
                        <div
                          key={color}
                          className="w-6 h-6 rounded-md border border-[var(--border)]"
                          style={{ backgroundColor: color }}
                          title={color}
                        />
                      ))}
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-xs text-[var(--text-secondary)]">
                        {brand.imagesGenerated} images generated
                      </span>
                      <div className="flex items-center gap-1">
                        <div className="w-1.5 h-1.5 rounded-full bg-[var(--success)]" />
                        <span className="text-xs text-[var(--success)] font-medium capitalize">
                          {brand.status}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </Link>
          </motion.div>
        ))}

        {/* Add Brand Card */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
        >
          <Link href="/brands/new">
            <div className="border-2 border-dashed border-[var(--border)] rounded-2xl p-8 text-center hover:border-[var(--accent-cyan)] transition-all duration-200 cursor-pointer group h-full flex flex-col items-center justify-center">
              <div className="w-12 h-12 rounded-xl bg-[var(--accent-cyan-light)] flex items-center justify-center mb-3 transition-transform duration-300 group-hover:scale-110">
                <Plus className="w-6 h-6 text-[var(--accent-cyan)]" />
              </div>
              <p className="text-sm font-semibold mb-1">Add New Brand</p>
              <p className="text-xs text-[var(--text-tertiary)]">
                Paste URL or set up manually
              </p>
            </div>
          </Link>
        </motion.div>
      </div>
    </div>
  );
}
