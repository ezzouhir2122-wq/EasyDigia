"use client";

import { useEffect, useState } from "react";
import { Link } from "@/i18n/navigation";

export function FloatingCTA() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    function onScroll() {
      setVisible(window.scrollY > 500);
    }
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  if (!visible) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-[90] border-t border-[#8FD400]/20 bg-[#0D0F17]/95 backdrop-blur-md">
      <div className="mx-auto flex max-w-[1200px] items-center justify-between gap-4 px-[6vw] py-3">
        <p className="hidden text-[13.5px] font-medium text-[#9BA1B0] sm:block">
          <span className="text-[#F5F6FA]">Audit gratuit</span> — Identifiez vos gains d&apos;automatisation en 30 min · Réponse sous 24h
        </p>
        <p className="text-[13px] font-medium text-[#9BA1B0] sm:hidden">
          Audit gratuit · Réponse sous 24h
        </p>
        <Link
          href="/contact"
          className="shrink-0 rounded-[10px] bg-gradient-to-br from-[#8FD400] to-[#C6FF00] px-5 py-2.5 text-[13.5px] font-bold text-[#0A0B10] shadow-[0_4px_20px_rgba(143,212,0,0.3)] transition hover:opacity-90"
        >
          Demander mon audit →
        </Link>
      </div>
    </div>
  );
}
