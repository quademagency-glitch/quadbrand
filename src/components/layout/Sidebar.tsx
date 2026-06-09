"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Logo from "@/components/ui/Logo";
import {
  LayoutDashboard,
  Palette,
  Sparkles,
  Image as ImageIcon,
  Settings,
  CreditCard,
  ChevronLeft,
  Plus,
  BarChart2,
  Gift
} from "lucide-react";
import CreditMeter from "./CreditMeter";

const navItems = [
  {
    label: "Dashboard",
    href: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    label: "Brands",
    href: "/brands",
    icon: Palette,
  },
  {
    label: "Generate",
    href: "/generate",
    icon: Sparkles,
  },
  {
    label: "Library",
    href: "/library",
    icon: ImageIcon,
  },
  {
    label: "Analytics",
    href: "/analytics",
    icon: BarChart2,
  },
];

const bottomNavItems = [
  {
    label: "Billing",
    href: "/billing",
    icon: CreditCard,
  },
  {
    label: "Workspace",
    href: "/workspace",
    icon: Settings,
  },
  {
    label: "Refer & Earn",
    href: "/referrals",
    icon: Gift,
  },
];

export default function Sidebar() {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);

  return (
    <aside
      className={`fixed top-0 left-0 h-screen bg-[var(--bg-card)] border-r border-[var(--border)] flex flex-col z-40 transition-all duration-300 ${
        collapsed ? "w-[68px]" : "w-[250px]"
      }`}
      id="app-sidebar"
    >
      {/* Logo */}
      <div className="h-16 flex items-center px-4 border-b border-[var(--border)] overflow-hidden">
        <Link href="/dashboard" className="flex items-center">
          <Logo showText={!collapsed} className="transition-all" />
        </Link>
      </div>

      {/* New Brand Button */}
      <div className="px-3 pt-4 pb-2">
        <Link href="/brands/new">
          <button
            className={`btn-gradient w-full !rounded-xl !py-2.5 text-sm ${
              collapsed ? "!px-0 justify-center" : ""
            }`}
            id="sidebar-new-brand"
          >
            <Plus className="w-4 h-4" />
            {!collapsed && <span>New Brand</span>}
          </button>
        </Link>
      </div>

      {/* Main Navigation */}
      <nav className="flex-1 px-3 py-2 space-y-1">
        {navItems.map((item) => {
          const active = pathname.startsWith(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${
                active
                  ? "bg-[var(--accent-cyan-light)] text-[var(--accent-cyan-dark)]"
                  : "text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-secondary)]"
              } ${collapsed ? "justify-center" : ""}`}
              id={`sidebar-${item.label.toLowerCase()}`}
              title={collapsed ? item.label : undefined}
            >
              <item.icon className={`w-5 h-5 flex-shrink-0 ${active ? "text-[var(--accent-cyan)]" : ""}`} />
              {!collapsed && <span>{item.label}</span>}
            </Link>
          );
        })}
      </nav>

      {/* Credit Meter */}
      {!collapsed && (
        <div className="px-3 mb-2">
          <CreditMeter used={7} total={20} />
        </div>
      )}

      {/* Bottom Navigation */}
      <div className="px-3 py-2 border-t border-[var(--border)] space-y-1">
        {bottomNavItems.map((item) => {
          const active = pathname.startsWith(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${
                active
                  ? "bg-[var(--accent-cyan-light)] text-[var(--accent-cyan-dark)]"
                  : "text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-secondary)]"
              } ${collapsed ? "justify-center" : ""}`}
              title={collapsed ? item.label : undefined}
            >
              <item.icon className="w-5 h-5 flex-shrink-0" />
              {!collapsed && <span>{item.label}</span>}
            </Link>
          );
        })}
      </div>

      {/* Collapse Toggle */}
      <button
        onClick={() => setCollapsed(!collapsed)}
        className="absolute -right-3 top-20 w-6 h-6 rounded-full bg-[var(--bg-card)] border border-[var(--border)] flex items-center justify-center text-[var(--text-tertiary)] hover:text-[var(--text-primary)] hover:border-[var(--border-hover)] transition-all duration-200 shadow-sm"
        id="sidebar-collapse"
        aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
      >
        <ChevronLeft
          className={`w-3.5 h-3.5 transition-transform duration-300 ${
            collapsed ? "rotate-180" : ""
          }`}
        />
      </button>
    </aside>
  );
}
