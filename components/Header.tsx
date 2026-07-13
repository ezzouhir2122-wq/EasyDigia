"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { LangSwitcher } from "./LangSwitcher";
import { Logo } from "./Logo";
import { createSupabaseBrowser } from "@/lib/supabase-browser";
import type { User } from "@supabase/supabase-js";

const ADMIN_EMAIL = "ezzouhir2122@gmail.com";

export function Header() {
  const t = useTranslations("nav");
  const [user, setUser] = useState<User | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const supabase = createSupabaseBrowser();
    supabase.auth.getUser().then(({ data }) => {
      setUser(data.user);
      setReady(true);
    });
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_, session) => {
      setUser(session?.user ?? null);
    });
    return () => subscription.unsubscribe();
  }, []);

  async function handleLogout() {
    const supabase = createSupabaseBrowser();
    await supabase.auth.signOut();
    setUser(null);
    window.location.href = "/fr";
  }

  const isAdmin = user?.email === ADMIN_EMAIL;

  return (
    <header className="sticky top-0 z-50 border-b border-white/[0.06] bg-base/80 backdrop-blur-md">
      <div className="mx-auto flex max-w-[1440px] items-center gap-6 px-[6vw] py-4">

        {/* Logo */}
        <Link href="/" className="flex shrink-0 items-center" aria-label="EasyDigia — accueil">
          <Logo className="h-16" />
        </Link>

        {/* Nav desktop */}
        <nav className="mx-auto hidden items-center gap-7 lg:flex">
          <Link href="/" className="text-[14.5px] font-medium text-muted transition hover:text-ink">{t("home")}</Link>
          <Link href="/services" className="text-[14.5px] font-medium text-muted transition hover:text-ink">{t("services")}</Link>
          <Link href="/about" className="text-[14.5px] font-medium text-muted transition hover:text-ink">{t("about")}</Link>
          <Link href="/blog" className="text-[14.5px] font-medium text-muted transition hover:text-ink">{t("blog")}</Link>
          <Link href="/tarifs" className="text-[14.5px] font-medium text-muted transition hover:text-ink">{t("tarifs")}</Link>
          <Link href="/realisations" className="text-[14.5px] font-medium text-muted transition hover:text-ink">{t("realisations")}</Link>
          <Link href="/contact" className="text-[14.5px] font-medium text-muted transition hover:text-ink">{t("contact")}</Link>
        </nav>

        {/* Right section */}
        <div className="ms-auto flex shrink-0 items-center gap-3 lg:ms-0">
          <LangSwitcher />

          {/* Admin badge — visible dès que connecté en tant qu'admin */}
          {isAdmin && (
            <Link
              href="/admin/blog"
              className="rounded-lg border border-[#8FD400]/40 bg-[#8FD400]/10 px-3.5 py-2 text-[13px] font-semibold text-[#8FD400] transition hover:bg-[#8FD400]/20"
            >
              ⚙ Admin
            </Link>
          )}

          {/* Auth buttons */}
          {ready && (
            user ? (
              <div className="flex items-center gap-2">
                <span className="hidden max-w-[130px] truncate text-[13px] text-muted sm:block">
                  {user.email}
                </span>
                <button
                  onClick={handleLogout}
                  className="rounded-lg border border-white/10 px-3.5 py-2 text-[13px] font-medium text-muted transition hover:border-red-500/40 hover:text-red-400"
                >
                  Déconnexion
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
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
              </div>
            )
          )}
        </div>
      </div>
    </header>
  );
}
