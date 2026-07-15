"use client";

import { useEffect, useState } from "react";

export function CookieBanner() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (!localStorage.getItem("cookieConsent")) {
      setVisible(true);
    }
  }, []);

  function accept() {
    localStorage.setItem("cookieConsent", "accepted");
    setVisible(false);
  }

  function refuse() {
    localStorage.setItem("cookieConsent", "refused");
    setVisible(false);
  }

  if (!visible) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-[150] border-t border-white/[0.07] bg-[#0D0F17]/95 px-[6vw] py-4 backdrop-blur-md">
      <div className="mx-auto flex max-w-[1200px] flex-wrap items-center justify-between gap-4">
        <p className="max-w-[640px] text-[13px] leading-[1.6] text-[#9BA1B0]">
          Ce site utilise des cookies pour améliorer votre expérience de navigation, conformément à la{" "}
          <span className="text-[#F5F6FA]/70">loi n° 09-08</span> relative à la protection des données personnelles
          et sous le contrôle de la{" "}
          <span className="text-[#F5F6FA]/70">CNDP Maroc</span>.
        </p>
        <div className="flex shrink-0 items-center gap-3">
          <button
            onClick={refuse}
            className="rounded-[10px] border border-white/[0.1] px-4 py-2.5 text-[13px] font-medium text-[#9BA1B0] transition hover:border-white/20 hover:text-[#F5F6FA]"
          >
            Refuser
          </button>
          <button
            onClick={accept}
            className="rounded-[10px] bg-gradient-to-br from-[#8FD400] to-[#C6FF00] px-5 py-2.5 text-[13px] font-bold text-[#0A0B10] transition hover:opacity-90"
          >
            Accepter
          </button>
        </div>
      </div>
    </div>
  );
}
