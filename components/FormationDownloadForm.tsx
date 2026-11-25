"use client";
import { useState } from "react";
import { useLocale, useTranslations } from "next-intl";

export function FormationDownloadForm() {
  const t = useTranslations("formations.download");
  const locale = useLocale();
  const [status, setStatus] = useState<"idle" | "sending" | "ok" | "error">("idle");
  const [email, setEmail] = useState("");

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("sending");
    const form = new FormData(e.currentTarget);
    const to = String(form.get("email") || "");
    try {
      const res = await fetch("/api/formation", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: String(form.get("name") || ""),
          email: to,
          phone: String(form.get("phone") || ""),
          company: String(form.get("company") || ""),
          locale,
        }),
      });
      setEmail(to);
      setStatus(res.ok ? "ok" : "error");
    } catch {
      setStatus("error");
    }
  }

  const field =
    "w-full rounded-[10px] border border-white/10 bg-white/[0.04] px-4 py-3 text-[14px] text-[#F5F6FA] outline-none transition focus:border-[#8FD400]/50";

  if (status === "ok") {
    return (
      <div className="rounded-[16px] border border-[#8FD400]/30 bg-[#8FD400]/10 p-8 text-center" role="status">
        <div className="mb-3 text-[40px]">📩</div>
        <h3 className="text-[20px] font-bold text-[#F5F6FA]">{t("successTitle")}</h3>
        <p className="mt-2 text-[14px] text-[#9BA1B0]">
          {t("successSub")} <strong className="text-[#F5F6FA]">{email}</strong>
        </p>
        <p className="mt-2 text-[13px] text-[#9BA1B0]">{t("spam")}</p>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="grid gap-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="grid gap-1.5 text-[13px] text-[#9BA1B0]">
          <span>
            {t("name")} <span className="text-[#8FD400]">*</span>
          </span>
          <input name="name" required maxLength={120} autoComplete="name" className={field} />
        </label>
        <label className="grid gap-1.5 text-[13px] text-[#9BA1B0]">
          <span>
            {t("email")} <span className="text-[#8FD400]">*</span>
          </span>
          <input name="email" type="email" required autoComplete="email" className={field} />
        </label>
        <label className="grid gap-1.5 text-[13px] text-[#9BA1B0]">
          <span>
            {t("phone")} <span className="text-[#8FD400]">*</span>
          </span>
          <input
            name="phone"
            type="tel"
            required
            autoComplete="tel"
            inputMode="tel"
            minLength={6}
            maxLength={30}
            pattern="[0-9+\(\)\s\-]*"
            placeholder="+212 6XX XXX XXX"
            className={field}
          />
        </label>
        <label className="grid gap-1.5 text-[13px] text-[#9BA1B0]">
          {t("company")}
          <input name="company" maxLength={120} autoComplete="organization" className={field} />
        </label>
      </div>
      <button
        type="submit"
        disabled={status === "sending"}
        className="rounded-[12px] bg-gradient-to-br from-[#8FD400] to-[#C6FF00] px-6 py-3.5 text-[15px] font-bold text-[#0A0B10] shadow-[0_4px_20px_rgba(143,212,0,0.35)] transition hover:opacity-90 disabled:opacity-60"
      >
        {status === "sending" ? t("sending") : t("submit")}
      </button>
      {status === "error" && <p className="text-[13px] text-red-400">{t("error")}</p>}
    </form>
  );
}
