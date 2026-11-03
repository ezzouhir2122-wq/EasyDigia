"use client";

import Link from "next/link";
import { useState } from "react";
import { Logo } from "@/components/Logo";

type NavKey = "dashboard" | "leads" | "clients" | "factures" | "blog";

const ITEMS: { key: NavKey; label: string; href: (l: string) => string }[] = [
  { key: "dashboard", label: "Dashboard", href: (l) => `/${l}/admin` },
  { key: "leads", label: "Leads", href: (l) => `/${l}/admin/leads` },
  { key: "clients", label: "Clients", href: (l) => `/${l}/admin/clients` },
  { key: "factures", label: "Factures", href: (l) => `/${l}/admin/factures` },
  { key: "blog", label: "Blog", href: (l) => `/${l}/admin/blog` },
];

export function AdminNav({ locale, active }: { locale: string; active: NavKey }) {
  const [loggingOut, setLoggingOut] = useState(false);

  async function logout() {
    setLoggingOut(true);
    try {
      const { createSupabaseBrowser } = await import("@/lib/supabase-browser");
      const supabase = createSupabaseBrowser();
      await supabase.auth.signOut();
    } catch {
      // ignore — redirect anyway
    }
    window.location.href = `/${locale}/admin/login`;
  }

  return (
    <header className="sticky top-0 z-30 border-b border-white/10 bg-[#0A0B10]/90 backdrop-blur">
      <div className="mx-auto flex max-w-[1100px] flex-wrap items-center gap-x-6 gap-y-3 px-6 py-3.5">
        <Link href={`/${locale}/admin`} className="shrink-0">
          <Logo className="h-8" />
        </Link>

        <nav className="flex flex-1 flex-wrap items-center gap-1">
          {ITEMS.map((item) => {
            const isActive = item.key === active;
            return (
              <Link
                key={item.key}
                href={item.href(locale)}
                className={`rounded-[9px] px-3.5 py-1.5 text-[13.5px] font-medium transition ${
                  isActive
                    ? "bg-[#8FD400]/15 text-[#C6FF00] ring-1 ring-[#8FD400]/40"
                    : "text-[#9BA1B0] hover:bg-white/[0.04] hover:text-[#F5F6FA]"
                }`}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        <button
          onClick={logout}
          disabled={loggingOut}
          className="shrink-0 rounded-[9px] border border-white/10 px-3.5 py-1.5 text-[13px] text-[#9BA1B0] transition hover:border-red-500/40 hover:text-red-400 disabled:opacity-50"
        >
          {loggingOut ? "Déconnexion…" : "⏻ Déconnexion"}
        </button>
      </div>
    </header>
  );
}
