"use client";
import { useEffect, useState } from "react";

export function LeadMagnetModal() {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "ok" | "err">("idle");

  useEffect(() => {
    if (sessionStorage.getItem("lm_shown")) return;
    const timer = setTimeout(() => setOpen(true), 30_000);
    return () => clearTimeout(timer);
  }, []);

  function dismiss() {
    sessionStorage.setItem("lm_shown", "1");
    setOpen(false);
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("loading");
    try {
      const res = await fetch("/api/lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          email,
          service: "Guide PDF",
          message: "Téléchargement guide PDF — 5 automatisations PME",
          locale: "fr",
        }),
      });
      if (res.ok) {
        setStatus("ok");
        sessionStorage.setItem("lm_shown", "1");
      } else {
        setStatus("err");
      }
    } catch {
      setStatus("err");
    }
  }

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-end justify-center p-4 sm:items-center">
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={dismiss}
        aria-hidden="true"
      />
      <div className="relative z-10 w-full max-w-[480px] rounded-[24px] border border-white/10 bg-[#12141C] p-8 shadow-[0_20px_80px_rgba(0,0,0,0.7)]">
        <button
          onClick={dismiss}
          aria-label="Fermer"
          className="absolute right-5 top-5 flex h-7 w-7 items-center justify-center rounded-full text-[#9BA1B0] transition hover:bg-white/10 hover:text-white"
        >
          ✕
        </button>

        {status === "ok" ? (
          <div className="py-6 text-center">
            <div className="mb-4 text-4xl">📬</div>
            <h3 className="mb-2 font-heading text-[22px] font-bold text-white">
              Guide envoyé !
            </h3>
            <p className="text-[15px] text-[#9BA1B0]">
              Vérifiez votre boîte mail. On vous contacte sous 24h pour en discuter.
            </p>
          </div>
        ) : (
          <>
            <div className="mb-1 font-mono text-[11px] uppercase tracking-[0.1em] text-[#8FD400]">
              Ressource gratuite
            </div>
            <h3 className="mb-2 font-heading text-[22px] font-bold leading-[1.2] text-white">
              5 automatisations pour PME marocaines
            </h3>
            <p className="mb-6 text-[14px] leading-[1.65] text-[#9BA1B0]">
              Téléchargez notre guide PDF : les 5 processus que vous pouvez automatiser
              cette semaine pour gagner des heures chaque mois.
            </p>

            <form onSubmit={submit} className="flex flex-col gap-3">
              <input
                type="text"
                placeholder="Votre prénom"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="rounded-[10px] border border-white/10 bg-white/[0.04] px-4 py-3 text-[14px] text-white placeholder-[#9BA1B0]/60 outline-none transition focus:border-[#8FD400]/40 focus:bg-white/[0.06]"
              />
              <input
                type="email"
                placeholder="Votre email professionnel"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="rounded-[10px] border border-white/10 bg-white/[0.04] px-4 py-3 text-[14px] text-white placeholder-[#9BA1B0]/60 outline-none transition focus:border-[#8FD400]/40 focus:bg-white/[0.06]"
              />
              <button
                type="submit"
                disabled={status === "loading"}
                className="mt-1 rounded-[10px] bg-gradient-to-br from-[#8FD400] to-[#C6FF00] py-3.5 text-[15px] font-bold text-[#0A0B10] transition hover:opacity-90 disabled:opacity-60"
              >
                {status === "loading" ? "Envoi…" : "Recevoir le guide gratuit →"}
              </button>
              {status === "err" && (
                <p className="text-center text-[13px] text-red-400">
                  Une erreur est survenue. Réessayez.
                </p>
              )}
              <p className="text-center text-[11px] text-[#9BA1B0]/50">
                Pas de spam. Désabonnement en 1 clic.
              </p>
            </form>
          </>
        )}
      </div>
    </div>
  );
}
