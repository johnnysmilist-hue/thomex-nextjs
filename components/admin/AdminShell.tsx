"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  ShoppingBag,
  Package,
  Image as ImageIcon,
  Users,
  Settings,
  ExternalLink,
  LogOut,
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";

const navItems = [
  { label: "Dashboard", href: "/admin", icon: LayoutDashboard },
  { label: "Orders", href: "/admin/orders", icon: ShoppingBag },
  { label: "Products", href: "/admin/products", icon: Package },
  { label: "Media", href: "/admin/media", icon: ImageIcon },
  { label: "Users", href: "/admin/users", icon: Users },
  { label: "Settings", href: "/admin/settings", icon: Settings },
];

export default function AdminShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { user, signOut } = useAuth();

  const isActive = (href: string) =>
    href === "/admin" ? pathname === "/admin" : pathname.startsWith(href);

  return (
    <div className="min-h-screen bg-[#f0f0f1] font-sans text-[#1d2327]">
      {/* Top admin bar */}
      <div className="flex h-8 items-center justify-between bg-[#1d2327] px-3 text-xs text-[#c3c4c7]">
        <div className="flex items-center gap-4">
          <span className="font-semibold text-white">Thomex Admin</span>
        </div>
        <div className="flex items-center gap-4">
          <Link
            href="/"
            target="_blank"
            className="flex items-center gap-1 hover:text-white"
          >
            <ExternalLink size={12} /> Visit store
          </Link>
          <span className="hidden sm:inline">Howdy, {user?.email}</span>
          <button
            onClick={signOut}
            className="flex items-center gap-1 hover:text-white"
          >
            <LogOut size={12} /> Sign out
          </button>
        </div>
      </div>

      <div className="flex">
        {/* Sidebar */}
        <aside className="sticky top-8 h-[calc(100vh-2rem)] w-14 shrink-0 bg-[#1d2327] sm:w-[160px]">
          <nav className="py-2">
            {navItems.map(({ label, href, icon: Icon }) => {
              const active = isActive(href);
              return (
                <Link
                  key={href}
                  href={href}
                  className={`flex items-center gap-2.5 px-3 py-2.5 text-[13px] font-medium transition-colors sm:px-4 ${
                    active
                      ? "bg-[#2271b1] text-white"
                      : "text-[#c3c4c7] hover:bg-[#2c3338] hover:text-white"
                  }`}
                >
                  <Icon size={16} className="shrink-0" />
                  <span className="hidden sm:inline">{label}</span>
                </Link>
              );
            })}
          </nav>
        </aside>

        {/* Content */}
        <main className="min-w-0 flex-1 px-4 py-6 sm:px-8">{children}</main>
      </div>
    </div>
  );
}
