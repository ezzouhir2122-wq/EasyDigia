"use client";

import { useState } from "react";

type Status = "idle" | "loading" | "success" | "error";

export function GuideDownloadForm() {
  const [status, setStatus] = useState<Status>("idle");
  const [form, setForm] = useState({ name: "", company: "", email: "", phone: "" });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("loading");

    try {
      const res = await fetch("/api/guide", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json() as { ok: boolean };
      if (!data.ok) throw new Error("api error");

      setStatus("success");
    } catch {
      setStatus("error");
    }
  };

  if (status === "success") {
    return (
      <div className="rounded-[16px] border border-brand/30 bg-brand/10 p-8 text-center">
        <div className="mb-3 text-[40px]">📩</div>
        <h3 className="mb-2 text-[20px] font-bold text-ink">Vérifiez votre boîte email !</h3>
        <p className="mb-2 text-[14px] text-muted">
          Le guide a été envoyé à <strong className="text-ink">{form.email}</strong> en pièce jointe.
        </p>
        <p className="text-[13px] text-muted">
          Pensez à vérifier vos spams si vous ne le recevez pas dans les 2 minutes.
        </p>
        <p className="mt-4 text-[12px] text-muted">
          Notre équipe vous contactera sous 24h pour votre audit gratuit.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="mb-1.5 block text-[12px] font-medium text-muted">
            Nom complet <span className="text-brand">*</span>
          </label>
          <input
            type="text"
            required
            placeholder="Votre nom"
            value={form.name}
            onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
            className="w-full rounded-[10px] border border-white/10 bg-white/[0.04] px-4 py-3 text-[14px] text-ink placeholder:text-muted/50 outline-none transition focus:border-brand/50 focus:bg-white/[0.06]"
          />
        </div>
        <div>
          <label className="mb-1.5 block text-[12px] font-medium text-muted">
            Entreprise <span className="text-brand">*</span>
          </label>
          <input
            type="text"
            required
            placeholder="Nom de votre entreprise"
            value={form.company}
            onChange={(e) => setForm((f) => ({ ...f, company: e.target.value }))}
            className="w-full rounded-[10px] border border-white/10 bg-white/[0.04] px-4 py-3 text-[14px] text-ink placeholder:text-muted/50 outline-none transition focus:border-brand/50 focus:bg-white/[0.06]"
          />
        </div>
        <div>
          <label className="mb-1.5 block text-[12px] font-medium text-muted">
            Email professionnel <span className="text-brand">*</span>
          </label>
          <input
            type="email"
            required
            placeholder="vous@entreprise.com"
            value={form.email}
            onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
            className="w-full rounded-[10px] border border-white/10 bg-white/[0.04] px-4 py-3 text-[14px] text-ink placeholder:text-muted/50 outline-none transition focus:border-brand/50 focus:bg-white/[0.06]"
          />
        </div>
        <div>
          <label className="mb-1.5 block text-[12px] font-medium text-muted">
            Téléphone <span className="text-brand">*</span>
          </label>
          <input
            type="tel"
            required
            placeholder="+212 6XX XXX XXX"
            value={form.phone}
            onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))}
            className="w-full rounded-[10px] border border-white/10 bg-white/[0.04] px-4 py-3 text-[14px] text-ink placeholder:text-muted/50 outline-none transition focus:border-brand/50 focus:bg-white/[0.06]"
          />
        </div>
      </div>

      {status === "error" && (
        <p className="rounded-[8px] border border-red-500/30 bg-red-500/10 px-4 py-2.5 text-[13px] text-red-400">
          Une erreur est survenue. Réessayez ou contactez-nous directement.
        </p>
      )}

      <button
        type="submit"
        disabled={status === "loading"}
        className="w-full rounded-[10px] bg-gradient-to-br from-brand to-[#C6FF00] py-3.5 text-[15px] font-bold text-[#0A0B10] shadow-[0_4px_20px_rgba(143,212,0,0.35)] transition hover:opacity-90 disabled:opacity-60"
      >
        {status === "loading" ? "Envoi en cours…" : "Recevoir le guide par email →"}
      </button>

      <p className="text-center text-[11px] text-muted">
        🔒 Vos données sont confidentielles. Pas de spam, jamais.
      </p>
    </form>
  );
}
