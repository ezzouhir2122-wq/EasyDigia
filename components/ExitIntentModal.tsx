"use client";

import { useEffect, useState } from "react";
import { useRouter } from "@/i18n/navigation";

export function ExitIntentModal() {
  const [visible, setVisible] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const shown = sessionStorage.getItem("exitModalShown");
    if (shown) return;

    let triggered = false;

    function handleMouseLeave(e: MouseEvent) {
      if (triggered) return;
      if (e.clientY <= 0) {
        triggered = true;
        sessionStorage.setItem("exitModalShown", "1");
        setVisible(true);
      }
    }

    // Small delay so it doesn't fire on page load
    const timer = setTimeout(() => {
      document.addEventListener("mouseleave", handleMouseLeave);
    }, 3000);

    return () => {
      clearTimeout(timer);
      document.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, []);

  if (!visible) return null;

  return (
    <div
      className="fixed inset-0 z-[200] flex items-center justify-center bg-black/70 px-4 backdrop-blur-sm"
      onClick={() => setVisible(false)}
    >
      <div
        className="relative w-full max-w-[480px] overflow-hidden rounded-[24px] border border-[#8FD400]/30 bg-[#0D0F17] shadow-[0_24px_80px_rgba(0,0,0,0.6)]"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="h-[3px] w-full bg-gradient-to-r from-[#8FD400] to-[#C6FF00]" />

        <div className="px-8 pb-8 pt-7">
          <button
            onClick={() => setVisible(false)}
            className="absolute right-5 top-5 flex h-8 w-8 items-center justify-center rounded-full text-[#9BA1B0] transition hover:bg-white/10 hover:text-white"
            aria-label="Fermer"
          >
            ✕
          </button>

          <div className="mb-1 font-mono text-[11px] uppercase tracking-[0.1em] text-[#8FD400]">
            Avant de partir
          </div>
          <h2 className="mb-3 font-heading text-[24px] font-bold leading-[1.1] text-[#F5F6FA]">
            Obtenez votre audit gratuit
          </h2>
          <p className="mb-6 text-[15px] leading-[1.65] text-[#9BA1B0]">
            30 minutes pour identifier les tâches automatisables dans votre entreprise et estimer votre gain de temps — sans engagement.
          </p>

          <div className="flex flex-col gap-3">
            <a
              href="/fr/contact"
              onClick={() => setVisible(false)}
              className="flex items-center justify-center gap-2 rounded-[12px] bg-gradient-to-br from-[#8FD400] to-[#C6FF00] px-6 py-3.5 text-[15px] font-bold text-[#0A0B10] shadow-[0_4px_20px_rgba(143,212,0,0.35)] transition hover:opacity-90"
            >
              Demander mon audit gratuit →
            </a>
            <button
              onClick={() => setVisible(false)}
              className="text-[13px] text-[#9BA1B0] transition hover:text-[#F5F6FA]"
            >
              Non merci, je continue ma visite
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
