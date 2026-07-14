"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { usePathname } from "@/i18n/navigation";
import { LangSwitcher } from "./LangSwitcher";
import { Logo } from "./Logo";
import type { User } from "@supabase/supabase-js";

export function Header() {
  const t = useTranslations("nav");
  const [user, setUser] = useState<User | null>(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const pathname = usePathname();

  // Close mobile menu on route change
  useEffect(() => { setMenuOpen(false); }, [pathname]);

  useEffect(() => {
    // Guard: if env vars missing, skip silently
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL) return;

    import("@/lib/supabase-browser").then(({ createSupabaseBrowser }) => {
      const supabase = createSupabaseBrowser();
      supabase.auth.getUser().then(({ data }) => setUser(data.user ?? null));
      const { data: { subscription } } = supabase.auth.onAuthStateChange(
        (_, session) => setUser(session?.user ?? null)
      );
      return () => subscription.unsubscribe();
    }).catch(() => {});
  }, []);

  async function handleLogout() {
    const { createSupabaseBrowser } = await import("@/lib/supabase-browser");
    const supabase = createSupabaseBrowser();
    await supabase.auth.signOut();
    setUser(null);
    window.location.href = "/fr/admin/login";
  }

  const isAdmin = user?.user_metadata?.role === "admin";

  const navLinks = [
    { href: "/", label: t("home") },
    { href: "/services", label: t("services") },
    { href: "/about", label: t("about") },
    { href: "/blog", label: t("blog") },
    { href: "/tarifs", label: t("tarifs") },
    { href: "/realisations", label: t("realisations") },
    { href: "/faq", label: t("faq") },
    { href: "/temoignages", label: t("temoignages") },
    { href: "/contact", label: t("contact") },
  ];

  return (
    <header className="sticky top-0 z-50 border-b border-white/[0.06] bg-base/80 backdrop-blur-md">
      <div className="mx-auto flex max-w-[1440px] items-center gap-6 px-[6vw] py-4">

        {/* Logo */}
        <Link href="/" className="flex shrink-0 items-center" aria-label="EasyDigia — accueil">
          <Logo className="h-16" />
        </Link>

        {/* Nav desktop */}
        <nav className="mx-auto hidden items-center gap-7 lg:flex">
          {navLinks.map((l) => (
            <Link key={l.href} href={l.href} className="text-[14.5px] font-medium text-muted transition hover:text-ink">{l.label}</Link>
          ))}
        </nav>

        {/* Hamburger — mobile only */}
        <button
          onClick={() => setMenuOpen((o) => !o)}
          className="ms-auto flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-white/10 text-muted transition hover:border-brand/40 hover:text-ink lg:hidden"
          aria-label="Menu"
          aria-expanded={menuOpen}
        >
          {menuOpen ? (
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <line x1="3" y1="3" x2="15" y2="15" /><line x1="15" y1="3" x2="3" y2="15" />
            </svg>
          ) : (
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <line x1="2" y1="5" x2="16" y2="5" /><line x1="2" y1="9" x2="16" y2="9" /><line x1="2" y1="13" x2="16" y2="13" />
            </svg>
          )}
        </button>

        {/* Right actions */}
        <div className="hidden shrink-0 items-center gap-2 lg:flex lg:ms-0">
          <LangSwitcher />

          {isAdmin && (
            <Link
              href="/admin/blog"
              className="rounded-lg border border-[#8FD400]/40 bg-[#8FD400]/10 px-3.5 py-2 text-[13px] font-semibold text-[#8FD400] transition hover:bg-[#8FD400]/20"
            >
              ⚙ Admin
            </Link>
          )}

          {user ? (
            <button
              onClick={handleLogout}
              className="rounded-lg border border-white/10 px-4 py-2.5 text-[13.5px] font-medium text-muted transition hover:border-red-500/40 hover:text-red-400"
            >
              Déconnexion
            </button>
          ) : (
            <>
              <Link
                href="/auth"
                className="rounded-lg border border-white/10 px-4 py-2.5 text-[13.5px] font-medium text-muted transition hover:border-brand/40 hover:text-ink"
              >
                S&apos;inscrire
              </Link>
              <Link
                href="/contact"
                className="hidden rounded-lg bg-gradient-to-br from-brand to-brand-deep px-5 py-2.5 text-[14px] font-semibold text-white shadow-[0_4px_20px_rgba(143,212,0,0.35)] transition hover:opacity-90 sm:inline-block"
              >
                {t("cta")}
              </Link>
            </>
          )}
        </div>
      </div>
      {/* Mobile drawer */}
      {menuOpen && (
        <nav className="border-t border-white/[0.06] bg-base/95 px-[6vw] pb-6 pt-4 lg:hidden">
          <ul className="flex flex-col gap-1">
            {navLinks.map((l) => (
              <li key={l.href}>
                <Link
                  href={l.href}
                  className="block rounded-lg px-3 py-3 text-[15px] font-medium text-muted transition hover:bg-white/[0.04] hover:text-ink"
                >
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
          <div className="mt-4 flex items-center gap-3">
            <LangSwitcher />
            <Link
              href="/contact"
              className="flex-1 rounded-lg bg-gradient-to-br from-brand to-brand-deep px-5 py-2.5 text-center text-[14px] font-semibold text-white shadow-[0_4px_20px_rgba(143,212,0,0.35)] transition hover:opacity-90"
            >
              {t("cta")}
            </Link>
          </div>
        </nav>
      )}
    </header>
  );
}
