import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";

export default function Formations() {
  const t = useTranslations("formations");
  const items = t.raw("items") as Array<{ title: string; desc: string; video: string }>;

  return (
    <main className="min-h-screen bg-[#0A0B10]">
      <section className="mx-auto max-w-[900px] px-[6vw] pb-10 pt-20 text-center">
        <div className="mb-4 inline-block font-mono text-[12px] uppercase tracking-[0.1em] text-[#8FD400]">
          {t("kicker")}
        </div>
        <h1 className="font-heading text-[clamp(32px,5vw,52px)] font-bold leading-[1.08] tracking-[-0.02em] text-[#F5F6FA]">
          {t("title")}
        </h1>
        <p className="mx-auto mt-5 max-w-[600px] text-[17px] leading-[1.65] text-[#9BA1B0]">
          {t("sub")}
        </p>
      </section>

      <section className="mx-auto max-w-[900px] px-[6vw] pb-24">
        <div className="grid gap-8 md:grid-cols-2">
          {items.map((item) => (
            <div
              key={item.video}
              className="flex flex-col rounded-[22px] border border-white/[0.08] bg-[#12141C] p-5"
            >
              {/* shortcut: no poster image, browser shows first frame via preload=metadata */}
              <video
                src={item.video}
                controls
                playsInline
                preload="metadata"
                className="aspect-[9/16] w-full rounded-[16px] bg-black object-cover"
                aria-label={item.title}
              />
              <h2 className="mt-5 font-heading text-[20px] font-bold text-[#F5F6FA]">{item.title}</h2>
              <p className="mt-2 mb-6 text-[14.5px] leading-[1.65] text-[#9BA1B0]">{item.desc}</p>
              <Link
                href="/contact"
                className="mt-auto flex w-full items-center justify-center rounded-[12px] bg-gradient-to-br from-[#8FD400] to-[#C6FF00] px-6 py-3.5 text-[14px] font-bold text-[#0A0B10] shadow-[0_4px_20px_rgba(143,212,0,0.35)] transition hover:opacity-90"
              >
                {t("cta")} →
              </Link>
            </div>
          ))}
        </div>
        <p className="mt-6 text-center text-[13px] text-[#9BA1B0]/60">{t("ctaSub")}</p>
      </section>
    </main>
  );
}
