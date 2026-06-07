"use client";

import { Building2, ChevronDown } from "lucide-react";
import { useState } from "react";

export function WorkspaceSwitcher() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-[var(--bg-secondary)] transition-colors border border-transparent hover:border-[var(--border)]"
      >
        <div className="w-6 h-6 rounded bg-[var(--accent-cyan)]/20 text-[var(--accent-cyan)] flex items-center justify-center">
          <Building2 className="w-3.5 h-3.5" />
        </div>
        <span className="text-sm font-medium">My Workspace</span>
        <ChevronDown className="w-4 h-4 text-[var(--text-tertiary)]" />
      </button>

      {isOpen && (
        <div className="absolute top-full left-0 mt-2 w-56 rounded-xl border border-[var(--border)] bg-[var(--bg-card)] shadow-xl overflow-hidden z-50">
          <div className="p-2">
            <button className="w-full flex items-center gap-3 p-2 rounded-lg bg-[var(--bg-secondary)] text-left">
              <div className="w-8 h-8 rounded flex items-center justify-center bg-[var(--accent-cyan)]/20 text-[var(--accent-cyan)]">
                <Building2 className="w-4 h-4" />
              </div>
              <div>
                <p className="text-sm font-medium text-[var(--text-primary)]">My Workspace</p>
                <p className="text-xs text-[var(--text-tertiary)]">Free Plan</p>
              </div>
            </button>
          </div>
          <div className="border-t border-[var(--border)] p-2">
            <button className="w-full text-left p-2 rounded-lg hover:bg-[var(--bg-secondary)] text-sm font-medium transition-colors">
              Create New Workspace
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
