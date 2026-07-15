"use client";

import { useEffect, useState } from "react";

export function ScrollToTop() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 400);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  if (!visible) return null;

  return (
    <button
      onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      aria-label="Retour en haut de page"
      className="fixed bottom-[84px] right-6 z-50 flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-[#12141C]/90 text-[18px] text-[#9BA1B0] shadow-lg backdrop-blur-sm transition hover:border-[#8FD400]/40 hover:text-[#8FD400] hover:shadow-[0_0_16px_rgba(143,212,0,0.15)]"
    >
      ↑
    </button>
  );
}
