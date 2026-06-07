"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Building2, Plus, Settings, Users, Key, Shield, Trash2, Mail } from "lucide-react";

export default function WorkspacePage() {
  const [activeTab, setActiveTab] = useState("General");
  return (
    <div className="max-w-4xl">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h1
          className="text-2xl md:text-3xl font-bold tracking-tight mb-1"
          style={{ fontFamily: "var(--font-outfit), sans-serif" }}
        >
          Workspace Settings
        </h1>
        <p className="text-[var(--text-secondary)]">
          Manage your team, API keys, and workspace preferences.
        </p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Nav Sidebar */}
        <div className="space-y-1">
          {[
            { icon: Building2, label: "General" },
            { icon: Users, label: "Members" },
            { icon: Key, label: "API Keys" },
            { icon: Shield, label: "Security" },
          ].map((item) => (
            <button
              key={item.label}
              onClick={() => setActiveTab(item.label)}
              className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                activeTab === item.label
                  ? "bg-[var(--bg-secondary)] text-[var(--text-primary)]"
                  : "text-[var(--text-secondary)] hover:bg-[var(--bg-secondary)] hover:text-[var(--text-primary)]"
              }`}
            >
              <item.icon className="w-4 h-4" />
              {item.label}
            </button>
          ))}
        </div>

        {/* Content Area */}
        <div className="md:col-span-2 space-y-6">
          {activeTab === "General" && (
            <>
              {/* General Settings */}
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="glass-card p-6"
              >
                <h2 className="text-lg font-bold mb-4">Workspace Details</h2>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-1.5">Workspace Name</label>
                    <input
                      type="text"
                      defaultValue="My Workspace"
                      className="w-full px-3 py-2 rounded-lg border border-[var(--border)] bg-[var(--bg-secondary)] text-sm focus:outline-none focus:border-[var(--accent-cyan)] transition-colors"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-1.5">Workspace Logo</label>
                    <div className="flex items-center gap-4">
                      <div className="w-16 h-16 rounded-xl bg-[var(--bg-secondary)] border border-[var(--border)] flex items-center justify-center">
                        <Building2 className="w-6 h-6 text-[var(--text-tertiary)]" />
                      </div>
                      <button className="btn-secondary text-sm">Upload Logo</button>
                    </div>
                  </div>
                </div>

                <div className="mt-6 pt-6 border-t border-[var(--border)] flex justify-end">
                  <button className="btn-gradient text-sm !py-2 !px-4">Save Changes</button>
                </div>
              </motion.div>

              {/* Danger Zone */}
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.15 }}
                className="border border-[var(--error)]/20 rounded-2xl p-6 bg-[var(--error)]/5"
              >
                <h2 className="text-lg font-bold text-[var(--error)] mb-2">Danger Zone</h2>
                <p className="text-sm text-[var(--text-secondary)] mb-4">
                  Deleting your workspace will permanently remove all brands, generated images, and data. This action cannot be undone.
                </p>
                <button className="px-4 py-2 rounded-lg border border-[var(--error)]/30 text-[var(--error)] text-sm font-medium hover:bg-[var(--error)]/10 transition-colors">
                  Delete Workspace
                </button>
              </motion.div>
            </>
          )}

          {activeTab === "Members" && (
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              className="glass-card p-6"
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-bold">Workspace Members</h2>
                <button className="btn-gradient text-sm !py-2 !px-4 flex items-center gap-2">
                  <Plus className="w-4 h-4" /> Invite Member
                </button>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 rounded-xl border border-[var(--border)] bg-[var(--bg-secondary)]">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-[var(--accent-cyan)]/20 text-[var(--accent-cyan)] flex items-center justify-center font-bold">
                      ME
                    </div>
                    <div>
                      <p className="text-sm font-semibold">You (Owner)</p>
                      <p className="text-xs text-[var(--text-tertiary)]">you@example.com</p>
                    </div>
                  </div>
                  <span className="text-xs font-medium px-2 py-1 bg-[var(--bg-card)] rounded-md border border-[var(--border)]">
                    Owner
                  </span>
                </div>
                
                {/* Placeholder for future members */}
                <div className="text-center py-8">
                  <Users className="w-8 h-8 text-[var(--text-tertiary)] mx-auto mb-2" />
                  <p className="text-sm font-medium">No other members</p>
                  <p className="text-xs text-[var(--text-tertiary)]">Invite your team to collaborate.</p>
                </div>
              </div>
            </motion.div>
          )}
          
          {activeTab === "API Keys" && (
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              className="glass-card p-6"
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-bold">API Keys</h2>
                <button className="btn-gradient text-sm !py-2 !px-4 flex items-center gap-2">
                  <Plus className="w-4 h-4" /> Create Key
                </button>
              </div>
              <p className="text-sm text-[var(--text-secondary)] mb-6">
                Use these keys to authenticate API requests. Do not share them publicly.
              </p>
              
              <div className="text-center py-8 border border-dashed border-[var(--border)] rounded-xl">
                <Key className="w-8 h-8 text-[var(--text-tertiary)] mx-auto mb-2" />
                <p className="text-sm font-medium">No API keys generated</p>
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
}
