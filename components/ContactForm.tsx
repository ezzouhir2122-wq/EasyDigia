"use client";
import { useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { Button } from "./Button";

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

  return (
    <form onSubmit={onSubmit} className="mt-8 grid max-w-xl gap-4">
      <label className="grid gap-1">
        {t("name")}
        <input name="name" required className={field} />
      </label>
      <label className="grid gap-1">
        {t("email")}
        <input name="email" type="email" required className={field} />
      </label>
      <label className="grid gap-1">
        {t("company")}
        <input name="company" className={field} />
      </label>
      <label className="grid gap-1">
        {t("service")}
        <input name="service" className={field} />
      </label>
      <label className="grid gap-1">
        {t("message")}
        <textarea name="message" required rows={5} className={field} />
      </label>
      <Button type="submit">{t("submit")}</Button>
      {status === "ok" && <p className="text-accent">{t("success")}</p>}
      {status === "error" && <p className="text-red-400">{t("error")}</p>}
    </form>
  );
}
