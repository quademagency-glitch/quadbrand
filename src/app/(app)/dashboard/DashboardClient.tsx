"use client";

import { motion } from "framer-motion";
import {
  Sparkles,
  ImageIcon,
  Palette,
  TrendingUp,
  Plus,
  ArrowRight,
  Zap,
  Clock,
} from "lucide-react";
import Link from "next/link";

export default function DashboardClient({ 
  stats: userStats,
  recentGenerations: userGenerations,
  fullName
}: {
  stats: {
    creditsRemaining: number;
    imagesGenerated: number;
    activeBrands: number;
    avgGenerationTime: string;
  };
  recentGenerations: any[];
  fullName: string;
}) {
  const displayStats = [
    {
      label: "Credits Remaining",
      value: userStats.creditsRemaining.toString(),
      sublabel: "of 20 this month",
      icon: Sparkles,
      color: "var(--accent-cyan)",
    },
    {
      label: "Images Generated",
      value: userStats.imagesGenerated.toString(),
      sublabel: "lifetime",
      icon: ImageIcon,
      color: "var(--accent-magenta)",
    },
    {
      label: "Active Brands",
      value: userStats.activeBrands.toString(),
      sublabel: "of 1 allowed",
      icon: Palette,
      color: "var(--accent-purple)",
    },
    {
      label: "Avg. Generation Time",
      value: userStats.avgGenerationTime,
      sublabel: "last 7 days",
      icon: TrendingUp,
      color: "var(--success)",
    },
  ];

  // Helper to format date
  const timeAgo = (dateStr: string) => {
    const seconds = Math.floor((new Date().getTime() - new Date(dateStr).getTime()) / 1000);
    let interval = seconds / 31536000;
    if (interval > 1) return Math.floor(interval) + " years ago";
    interval = seconds / 2592000;
    if (interval > 1) return Math.floor(interval) + " months ago";
    interval = seconds / 86400;
    if (interval > 1) return Math.floor(interval) + " days ago";
    interval = seconds / 3600;
    if (interval > 1) return Math.floor(interval) + " hours ago";
    interval = seconds / 60;
    if (interval > 1) return Math.floor(interval) + " mins ago";
    return Math.floor(seconds) + " secs ago";
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.08 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 16 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="max-w-6xl"
    >
      {/* Header */}
      <motion.div variants={itemVariants} className="mb-8">
        <h1
          className="text-2xl md:text-3xl font-bold tracking-tight mb-1"
          style={{ fontFamily: "var(--font-outfit), sans-serif" }}
          id="dashboard-heading"
        >
          Good evening, {fullName.split(" ")[0]} 👋
        </h1>
        <p className="text-[var(--text-secondary)]">
          Here&apos;s what&apos;s happening with your brand today.
        </p>
      </motion.div>

      {/* Stats Grid */}
      <motion.div
        variants={itemVariants}
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8"
      >
        {displayStats.map((stat) => (
          <div
            key={stat.label}
            className="glass-card p-5 group"
            id={`stat-${stat.label.toLowerCase().replace(/\s/g, "-")}`}
          >
            <div className="flex items-center justify-between mb-3">
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center transition-transform duration-300 group-hover:scale-110"
                style={{
                  background: `${stat.color}15`,
                  color: stat.color,
                }}
              >
                <stat.icon className="w-5 h-5" />
              </div>
            </div>
            <p
              className="text-2xl font-bold tracking-tight"
              style={{ fontFamily: "var(--font-outfit), sans-serif" }}
            >
              {stat.value}
            </p>
            <p className="text-xs text-[var(--text-tertiary)] mt-0.5">
              {stat.sublabel}
            </p>
            <p className="text-sm font-medium text-[var(--text-secondary)] mt-1">
              {stat.label}
            </p>
          </div>
        ))}
      </motion.div>

      {/* Quick Actions + Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Quick Actions */}
        <motion.div variants={itemVariants} className="lg:col-span-1">
          <h2
            className="text-lg font-bold mb-4"
            style={{ fontFamily: "var(--font-outfit), sans-serif" }}
          >
            Quick Actions
          </h2>
          <div className="space-y-3">
            <Link href="/generate">
              <div className="glass-card p-4 flex items-center gap-4 cursor-pointer group" id="quick-generate">
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center transition-transform duration-300 group-hover:scale-110"
                  style={{ background: "var(--gradient-primary)" }}
                >
                  <Sparkles className="w-5 h-5 text-white" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold">Generate Image</p>
                  <p className="text-xs text-[var(--text-tertiary)]">
                    Create on-brand visuals
                  </p>
                </div>
                <ArrowRight className="w-4 h-4 text-[var(--text-tertiary)] group-hover:text-[var(--accent-cyan)] transition-colors" />
              </div>
            </Link>

            <Link href="/brands/new">
              <div className="glass-card p-4 flex items-center gap-4 cursor-pointer group" id="quick-brand">
                <div className="w-10 h-10 rounded-xl bg-[var(--accent-cyan-light)] flex items-center justify-center transition-transform duration-300 group-hover:scale-110">
                  <Plus className="w-5 h-5 text-[var(--accent-cyan)]" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold">Add Brand</p>
                  <p className="text-xs text-[var(--text-tertiary)]">
                    Paste URL or set up manually
                  </p>
                </div>
                <ArrowRight className="w-4 h-4 text-[var(--text-tertiary)] group-hover:text-[var(--accent-cyan)] transition-colors" />
              </div>
            </Link>

            <Link href="/library">
              <div className="glass-card p-4 flex items-center gap-4 cursor-pointer group" id="quick-library">
                <div className="w-10 h-10 rounded-xl bg-[var(--accent-magenta-light)] flex items-center justify-center transition-transform duration-300 group-hover:scale-110">
                  <ImageIcon className="w-5 h-5 text-[var(--accent-magenta)]" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold">View Library</p>
                  <p className="text-xs text-[var(--text-tertiary)]">
                    Browse generated assets
                  </p>
                </div>
                <ArrowRight className="w-4 h-4 text-[var(--text-tertiary)] group-hover:text-[var(--accent-cyan)] transition-colors" />
              </div>
            </Link>
          </div>

          {/* Upgrade Card */}
          <div
            className="mt-4 rounded-xl p-5 text-white relative overflow-hidden"
            style={{ background: "var(--gradient-primary)" }}
            id="upgrade-card"
          >
            <div className="absolute -right-6 -top-6 w-24 h-24 rounded-full bg-white/10" />
            <div className="absolute -right-2 bottom-0 w-16 h-16 rounded-full bg-white/10" />
            <Zap className="w-6 h-6 mb-3" />
            <p className="text-sm font-bold mb-1">Upgrade to Starter</p>
            <p className="text-xs text-white/70 mb-3">
              Get 200 credits/month and 3 brands for just $9/mo
            </p>
            <button className="bg-white text-[var(--text-primary)] text-xs font-semibold px-4 py-2 rounded-lg hover:bg-white/90 transition-colors">
              Upgrade Now
            </button>
          </div>
        </motion.div>

        {/* Recent Generations */}
        <motion.div variants={itemVariants} className="lg:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <h2
              className="text-lg font-bold"
              style={{ fontFamily: "var(--font-outfit), sans-serif" }}
            >
              Recent Generations
            </h2>
            <Link
              href="/library"
              className="text-sm text-[var(--accent-cyan)] hover:underline flex items-center gap-1"
            >
              View all <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="glass-card overflow-hidden">
            <div className="divide-y divide-[var(--border)]">
              {userGenerations.length === 0 ? (
                <div className="p-8 text-center text-[var(--text-tertiary)]">
                  <ImageIcon className="w-8 h-8 mx-auto mb-2 opacity-20" />
                  <p className="text-sm">No images generated yet</p>
                </div>
              ) : (
                userGenerations.map((gen, i) => (
                  <div
                    key={i}
                    className="flex items-center gap-4 p-4 hover:bg-[var(--bg-secondary)] transition-colors cursor-pointer"
                  >
                    {/* Thumbnail Placeholder */}
                    <div
                      className={`w-12 h-12 rounded-lg flex-shrink-0 bg-cover bg-center border border-[var(--border)]`}
                      style={{ backgroundImage: `url(${gen.image_url})` }}
                    />

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{gen.prompt}</p>
                    <div className="flex items-center gap-2 mt-0.5">
                      <span className="text-xs text-[var(--text-tertiary)]">
                        {gen.ratio}
                      </span>
                      <span className="text-[var(--border)]">·</span>
                      <span className="flex items-center gap-1 text-xs text-[var(--text-tertiary)]">
                        <Clock className="w-3 h-3" />
                        {timeAgo(gen.created_at)}
                      </span>
                    </div>
                  </div>

                  {/* Status */}
                  <div className="flex items-center gap-1.5">
                    <div className="w-1.5 h-1.5 rounded-full bg-[var(--success)]" />
                    <span className="text-xs text-[var(--success)] font-medium capitalize">
                      {gen.status}
                    </span>
                  </div>
                </div>
                ))
              )}
            </div>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}
