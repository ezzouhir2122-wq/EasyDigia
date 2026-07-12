"use client";
import { useLocale } from "next-intl";
import { usePathname, useRouter } from "@/i18n/navigation";

const LOCALES = [
  { code: "fr", label: "FR" },
  { code: "en", label: "EN" },
  { code: "ar", label: "ع" },
] as const;

export function LangSwitcher() {
  const locale = useLocale();
  const pathname = usePathname();
  const router = useRouter();
  return (
    <div className="flex gap-2 text-sm">
      {LOCALES.map((l) => (
        <button
          key={l.code}
          onClick={() => router.replace(pathname, { locale: l.code })}
          className={
            l.code === locale ? "font-bold text-accent" : "text-ink/70 hover:text-ink"
          }
          aria-current={l.code === locale ? "true" : undefined}
        >
          {l.label}
        </button>
      ))}
    </div>
  );
}
