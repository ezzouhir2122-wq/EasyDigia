"use client";
import { useState } from "react";
import { useLocale, useTranslations } from "next-intl";

export function ContactForm() {
  const t = useTranslations("contact");
  const locale = useLocale();
  const [status, setStatus] = useState<"idle" | "sending" | "ok" | "error">("idle");

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("sending");
    const form = new FormData(e.currentTarget);
    const payload = {
      name: String(form.get("name") || ""),
      email: String(form.get("email") || ""),
      company: String(form.get("company") || ""),
      service: String(form.get("service") || ""),
      message: String(form.get("message") || ""),
      locale,
    };
    try {
      const res = await fetch("/api/lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      setStatus(res.ok ? "ok" : "error");
    } catch {
      setStatus("error");
    }
  }

  const field = "w-full rounded-lg border border-ink/20 bg-transparent px-4 py-3 text-ink";

  if (status === "ok") {
    return (
      <div className="mt-8 flex max-w-xl flex-col items-center gap-4 rounded-[16px] border border-[#8FD400]/20 bg-[#8FD400]/5 px-8 py-12 text-center">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[#8FD400]/15 text-3xl">
          ✅
        </div>
        <h2 className="text-xl font-semibold text-ink">{t("success")}</h2>
        <p className="text-sm text-muted">Nous vous répondons sous 24h.</p>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="grid gap-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="grid gap-1.5 text-[14px] text-muted">
          {t("name")} <span className="text-brand">*</span>
          <input name="name" required className={field} />
        </label>
        <label className="grid gap-1.5 text-[14px] text-muted">
          {t("email")} <span className="text-brand">*</span>
          <input name="email" type="email" required className={field} />
        </label>
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="grid gap-1.5 text-[14px] text-muted">
          {t("company")}
          <input name="company" className={field} />
        </label>
        <label className="grid gap-1.5 text-[14px] text-muted">
          {t("service")}
          <input name="service" className={field} />
        </label>
      </div>
      <label className="grid gap-1.5 text-[14px] text-muted">
        {t("message")} <span className="text-brand">*</span>
        <textarea name="message" required rows={4} className={field} />
      </label>
      <button
        type="submit"
        disabled={status === "sending"}
        className="rounded-lg bg-gradient-to-br from-brand to-brand-deep px-6 py-3.5 font-semibold text-white shadow-[0_4px_20px_rgba(143,212,0,0.35)] transition hover:opacity-90 disabled:opacity-60"
      >
        {status === "sending" ? "Envoi en cours…" : t("submit")}
      </button>
      {status === "error" && <p className="text-red-400">{t("error")}</p>}
    </form>
  );
}
