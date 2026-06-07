"use client";

import { useState } from "react";
import { Search, Bell, ChevronDown, LogOut } from "lucide-react";
import { auth } from "@/lib/firebase/client";
import { signOut } from "firebase/auth";
import { useRouter } from "next/navigation";

export default function TopBar() {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await signOut(auth);
      await fetch("/api/auth/session", { method: "DELETE" });
      router.push("/");
    } catch (error) {
      console.error("Logout failed", error);
    }
  };

  return (
    <header
      className="h-16 bg-[var(--bg-card)] border-b border-[var(--border)] flex items-center justify-between px-6"
      id="app-topbar"
    >
      {/* Search */}
      <div className="flex-1 max-w-md">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--text-tertiary)]" />
          <input
            type="text"
            placeholder="Search brands, assets, prompts..."
            className="w-full pl-9 pr-4 py-2 rounded-xl border border-[var(--border)] bg-[var(--bg-secondary)] text-sm focus:outline-none focus:border-[var(--accent-cyan)] focus:ring-2 focus:ring-[var(--accent-cyan)]/20 transition-all duration-200 placeholder:text-[var(--text-tertiary)]"
            id="topbar-search"
          />
        </div>
      </div>

      {/* Right Side */}
      <div className="flex items-center gap-3 ml-4">
        {/* Notifications */}
        <button
          className="relative p-2 rounded-xl hover:bg-[var(--bg-secondary)] transition-colors"
          id="topbar-notifications"
          aria-label="Notifications"
        >
          <Bell className="w-5 h-5 text-[var(--text-secondary)]" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-[var(--accent-magenta)]" />
        </button>

        {/* User Dropdown */}
        <div className="relative">
          <button
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className="flex items-center gap-2 px-3 py-1.5 rounded-xl hover:bg-[var(--bg-secondary)] transition-colors"
            id="topbar-user"
          >
            <div className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold text-white"
              style={{ background: "var(--gradient-primary)" }}
            >
              U
            </div>
            <span className="text-sm font-medium hidden sm:block">User</span>
            <ChevronDown className={`w-3.5 h-3.5 text-[var(--text-tertiary)] transition-transform ${dropdownOpen ? "rotate-180" : ""}`} />
          </button>

          {dropdownOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-[var(--bg-card)] border border-[var(--border)] rounded-xl shadow-lg overflow-hidden py-1 z-50">
              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-2 px-4 py-2 text-sm text-[var(--error)] hover:bg-[var(--error)]/5 transition-colors text-left"
              >
                <LogOut className="w-4 h-4" />
                Log out
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
