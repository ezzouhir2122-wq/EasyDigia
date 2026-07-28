import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Link } from "@/i18n/navigation";
import { Orbs } from "@/components/Orbs";
import {
  getAllPseoSlugs,
  getAllPseoGeoSlugs,
  getPseoPage,
  getPseoGeoPage,
  PSEO_SERVICES,
  PSEO_SECTORS,
  PSEO_CITIES,
  type PseoService,
  type PseoSector,
  type PseoCity,
} from "@/config/pseo-data";

type Props = { params: Promise<{ slug: string; locale: string }> };

export async function generateStaticParams() {
  return [
    ...getAllPseoSlugs().map((slug) => ({ slug })),
    ...getAllPseoGeoSlugs().map((slug) => ({ slug, locale: "fr" })),
  ];
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;

  // Essayer d'abord le slug géo
  const geoPage = getPseoGeoPage(slug);
  if (geoPage) {
    const { service, sector, city } = geoPage;
    const title = `${service.label} pour ${sector.labelFull} à ${city.label} | EasyDigia`;
    const description = `Déployez un ${service.label.toLowerCase()} pour ${sector.label} à ${city.label}. ${service.description.slice(0, 100)}… Résultats mesurables dès 30 jours.`;
    return {
      title,
      description,
      openGraph: {
        title,
        description,
        url: `https://www.easydigia.com/fr/solutions/${slug}`,
        images: [{ url: "https://www.easydigia.com/og-image.png", width: 1200, height: 630 }],
      },
      alternates: { canonical: `https://www.easydigia.com/fr/solutions/${slug}` },
    };
  }

  // Fallback : slug national (comportement d'origine)
  const page = getPseoPage(slug);
  if (!page) return {};
  const { service, sector } = page;
  const title = `${service.label} pour ${sector.labelFull} au Maroc | EasyDigia`;
  const description = `Déployez un ${service.label.toLowerCase()} sur mesure pour ${sector.label} au Maroc. ${service.description.slice(0, 100)}… Résultats mesurables dès 30 jours.`;
  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url: `https://www.easydigia.com/fr/solutions/${slug}`,
      images: [{ url: "https://www.easydigia.com/og-image.png", width: 1200, height: 630 }],
    },
    alternates: { canonical: `https://www.easydigia.com/fr/solutions/${slug}` },
  };
}

function GeoPage({
  service,
  sector,
  city,
}: {
  service: PseoService;
  sector: PseoSector;
  city: PseoCity;
}) {
  const nationalSlug = `${service.slug}-pour-${sector.slug}`;
  const otherCities = PSEO_CITIES.filter((c) => c.slug !== city.slug);
  const otherServices = PSEO_SERVICES.filter((s) => s.slug !== service.slug);

  return (
    <main className="relative min-h-screen overflow-hidden bg-base text-ink">
      <Orbs />

      {/* Breadcrumb */}
      <div className="relative z-10 mx-auto max-w-[1100px] px-[6vw] pt-8">
        <nav className="flex items-center gap-2 text-[13px] text-muted">
          <Link href="/" className="hover:text-ink">Accueil</Link>
          <span>/</span>
          <Link href="/services" className="hover:text-ink">Solutions</Link>
          <span>/</span>
          <Link href={`/solutions/${nationalSlug}` as "/"} className="hover:text-ink">
            {service.label} pour {sector.labelFull}
          </Link>
          <span>/</span>
          <span className="text-brand">{city.label}</span>
        </nav>
      </div>

      {/* Hero */}
      <section className="relative z-10 mx-auto max-w-[1100px] px-[6vw] pb-16 pt-10">
        <div className="max-w-[720px]">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-brand/30 bg-brand/10 px-4 py-1.5 text-[13px] font-semibold text-brand">
            <span>{sector.icon}</span>
            {sector.labelFull} — {city.label}
          </div>

          <h1 className="mb-4 text-[38px] font-extrabold leading-[1.15] tracking-tight text-ink lg:text-[52px]">
            {service.label}{" "}
            <span className="bg-gradient-to-r from-brand to-[#C6FF00] bg-clip-text text-transparent">
              pour {sector.label}
            </span>{" "}
            à {city.label}
          </h1>

          <p className="mb-3 text-[18px] font-medium text-[#C8CDD8]">
            {service.tagline}
          </p>

          <p className="mb-8 text-[16px] leading-relaxed text-muted">
            Les {sector.label} de <strong className="text-[#C8CDD8]">{city.label}</strong>,{" "}
            {city.context}, font face à des défis croissants en matière de productivité et
            d&apos;expérience client. {service.description} Conçu spécifiquement pour les{" "}
            <strong className="text-[#C8CDD8]">{sector.label}</strong> à {city.label}, avec des
            résultats mesurables dès les 30 premiers jours.
          </p>

          <div className="flex flex-wrap gap-3">
            <Link
              href="/contact"
              className="rounded-[10px] bg-gradient-to-br from-brand to-[#C6FF00] px-6 py-3 text-[15px] font-bold text-[#0A0B10] shadow-[0_4px_20px_rgba(143,212,0,0.4)] transition hover:opacity-90"
            >
              Démarrer votre projet à {city.label} →
            </Link>
            <Link
              href="/tarifs"
              className="rounded-[10px] border border-white/10 px-6 py-3 text-[15px] font-semibold text-muted transition hover:border-brand/40 hover:text-ink"
            >
              Voir les tarifs
            </Link>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="relative z-10 border-y border-white/[0.06] bg-white/[0.02] py-10">
        <div className="mx-auto flex max-w-[1100px] flex-wrap justify-center gap-10 px-[6vw]">
          {sector.stats.map((stat) => (
            <div key={stat.value} className="text-center">
              <div className="text-[42px] font-extrabold text-brand">{stat.value}</div>
              <div className="mt-1 max-w-[200px] text-[13px] text-muted">{stat.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Benefits */}
      <section className="relative z-10 mx-auto max-w-[1100px] px-[6vw] py-20">
        <h2 className="mb-2 text-center text-[13px] font-semibold uppercase tracking-[0.1em] text-brand">
          Ce que vous gagnez
        </h2>
        <h3 className="mb-12 text-center text-[28px] font-bold tracking-tight text-ink lg:text-[34px]">
          {service.label} adapté aux{" "}
          <span className="text-brand">{sector.label}</span> de {city.label}
        </h3>
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {sector.benefits.map((b) => (
            <div
              key={b.title}
              className="rounded-[16px] border border-white/[0.07] bg-white/[0.03] p-6 transition hover:border-brand/30 hover:bg-white/[0.05]"
            >
              <div className="mb-3 flex h-11 w-11 items-center justify-center rounded-[10px] bg-brand/15 text-[20px]">
                {b.icon}
              </div>
              <h4 className="mb-2 font-semibold text-ink">{b.title}</h4>
              <p className="text-[14px] leading-relaxed text-muted">{b.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Comment ça marche */}
      <section className="relative z-10 border-y border-white/[0.06] bg-white/[0.02] py-20">
        <div className="mx-auto max-w-[1100px] px-[6vw]">
          <h2 className="mb-2 text-center text-[13px] font-semibold uppercase tracking-[0.1em] text-brand">
            Comment ça marche
          </h2>
          <h3 className="mb-12 text-center text-[28px] font-bold tracking-tight text-ink lg:text-[34px]">
            Opérationnel en 3 étapes
          </h3>
          <div className="grid gap-6 md:grid-cols-3">
            {service.steps.map((step, i) => (
              <div key={step.title} className="relative">
                {i < service.steps.length - 1 && (
                  <div className="absolute right-0 top-6 hidden h-[2px] w-[calc(50%-24px)] bg-brand/20 md:block" />
                )}
                <div className="rounded-[16px] border border-white/[0.07] bg-white/[0.03] p-6">
                  <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-full bg-brand/15 text-[16px] font-extrabold text-brand">
                    {i + 1}
                  </div>
                  <h4 className="mb-2 font-semibold text-ink">{step.title}</h4>
                  <p className="text-[14px] leading-relaxed text-muted">{step.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ — questions secteur + question géo */}
      <section className="relative z-10 mx-auto max-w-[800px] px-[6vw] py-20">
        <h2 className="mb-2 text-center text-[13px] font-semibold uppercase tracking-[0.1em] text-brand">
          Questions fréquentes
        </h2>
        <h3 className="mb-12 text-center text-[28px] font-bold tracking-tight text-ink">
          On répond à vos questions
        </h3>
        <div className="space-y-4">
          {sector.faq.map((item) => (
            <div
              key={item.q}
              className="rounded-[14px] border border-white/[0.07] bg-white/[0.03] p-6"
            >
              <h4 className="mb-3 font-semibold text-ink">{item.q}</h4>
              <p className="text-[14px] leading-relaxed text-muted">{item.a}</p>
            </div>
          ))}
          {/* FAQ géo */}
          <div className="rounded-[14px] border border-white/[0.07] bg-white/[0.03] p-6">
            <h4 className="mb-3 font-semibold text-ink">
              Intervenez-vous à {city.label} ?
            </h4>
            <p className="text-[14px] leading-relaxed text-muted">
              Oui, EasyDigia intervient à {city.label} et dans toute la région {city.region}.
              Nous accompagnons les {sector.label} de {city.label} de A à Z : audit, déploiement
              et suivi — 100% à distance ou en présentiel selon vos préférences.
            </p>
          </div>
        </div>
      </section>

      {/* Bloc maillage géo */}
      <section className="relative z-10 border-t border-white/[0.06] mx-auto max-w-[1100px] px-[6vw] py-16">
        {/* Retour national */}
        <Link
          href={`/solutions/${nationalSlug}` as "/"}
          className="mb-8 inline-flex items-center gap-2 text-[14px] text-muted transition hover:text-ink"
        >
          ← Voir tous les {sector.label} au Maroc
        </Link>

        <div className="mt-6 grid gap-10 md:grid-cols-2">
          {/* Autres villes */}
          <div>
            <h3 className="mb-4 text-[13px] font-semibold uppercase tracking-[0.1em] text-brand">
              {service.label} dans d&apos;autres villes
            </h3>
            <div className="flex flex-wrap gap-2">
              {otherCities.map((c) => (
                <Link
                  key={c.slug}
                  href={`/solutions/${service.slug}-pour-${sector.slug}-a-${c.slug}` as "/"}
                  className="rounded-[8px] border border-white/[0.07] bg-white/[0.02] px-3 py-2 text-[13px] text-muted transition hover:border-brand/40 hover:text-ink"
                >
                  {service.label} à {c.label}
                </Link>
              ))}
            </div>
          </div>

          {/* Autres services dans cette ville */}
          <div>
            <h3 className="mb-4 text-[13px] font-semibold uppercase tracking-[0.1em] text-brand">
              Aussi à {city.label}
            </h3>
            <div className="flex flex-wrap gap-2">
              {otherServices.map((s) => (
                <Link
                  key={s.slug}
                  href={`/solutions/${s.slug}-pour-${sector.slug}-a-${city.slug}` as "/"}
                  className="rounded-[8px] border border-white/[0.07] bg-white/[0.02] px-3 py-2 text-[13px] text-muted transition hover:border-brand/40 hover:text-ink"
                >
                  <span className="mr-1">{s.icon}</span>
                  {s.label}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA Final */}
      <section className="relative z-10 mx-auto max-w-[1100px] px-[6vw] pb-24">
        <div className="rounded-[24px] border border-brand/20 bg-gradient-to-br from-brand/10 to-transparent p-10 text-center">
          <div className="mb-4 text-[40px]">{sector.icon}</div>
          <h2 className="mb-4 text-[28px] font-bold tracking-tight text-ink">
            Prêt à démarrer votre projet à {city.label} ?
          </h2>
          <p className="mx-auto mb-8 max-w-[540px] text-[16px] text-muted">
            Obtenez une démo personnalisée de notre {service.label.toLowerCase()} pour{" "}
            {sector.label} à {city.label}. Gratuit, sans engagement, 30 minutes.
          </p>
          <Link
            href="/contact"
            className="inline-block rounded-[10px] bg-gradient-to-br from-brand to-[#C6FF00] px-8 py-3.5 text-[16px] font-bold text-[#0A0B10] shadow-[0_4px_24px_rgba(143,212,0,0.45)] transition hover:opacity-90"
          >
            Démarrer votre projet à {city.label} →
          </Link>
        </div>
      </section>
    </main>
  );
}

export default async function PseoPage({ params }: Props) {
  const { slug } = await params;

  // Cas géo
  const geoPage = getPseoGeoPage(slug);
  if (geoPage) {
    return <GeoPage {...geoPage} />;
  }

  // Cas national (comportement d'origine)
  const page = getPseoPage(slug);
  if (!page) notFound();

  const { service, sector } = page;

  return (
    <main className="relative min-h-screen overflow-hidden bg-base text-ink">
      <Orbs />

      {/* Breadcrumb */}
      <div className="relative z-10 mx-auto max-w-[1100px] px-[6vw] pt-8">
        <nav className="flex items-center gap-2 text-[13px] text-muted">
          <Link href="/" className="hover:text-ink">Accueil</Link>
          <span>/</span>
          <Link href="/services" className="hover:text-ink">Solutions</Link>
          <span>/</span>
          <span className="text-brand">{service.label} pour {sector.labelFull}</span>
        </nav>
      </div>

      {/* Hero */}
      <section className="relative z-10 mx-auto max-w-[1100px] px-[6vw] pb-16 pt-10">
        <div className="max-w-[720px]">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-brand/30 bg-brand/10 px-4 py-1.5 text-[13px] font-semibold text-brand">
            <span>{sector.icon}</span>
            {sector.labelFull}
          </div>

          <h1 className="mb-4 text-[38px] font-extrabold leading-[1.15] tracking-tight text-ink lg:text-[52px]">
            {service.label}{" "}
            <span className="bg-gradient-to-r from-brand to-[#C6FF00] bg-clip-text text-transparent">
              pour {sector.label}
            </span>
          </h1>

          <p className="mb-3 text-[18px] font-medium text-[#C8CDD8]">
            {service.tagline}
          </p>

          <p className="mb-8 text-[16px] leading-relaxed text-muted">
            {service.description} Conçu spécifiquement pour les{" "}
            <strong className="text-[#C8CDD8]">{sector.label}</strong> au Maroc,
            avec des résultats mesurables dès les 30 premiers jours.
          </p>

          <div className="flex flex-wrap gap-3">
            <Link
              href="/contact"
              className="rounded-[10px] bg-gradient-to-br from-brand to-[#C6FF00] px-6 py-3 text-[15px] font-bold text-[#0A0B10] shadow-[0_4px_20px_rgba(143,212,0,0.4)] transition hover:opacity-90"
            >
              Demander une démo gratuite
            </Link>
            <Link
              href="/tarifs"
              className="rounded-[10px] border border-white/10 px-6 py-3 text-[15px] font-semibold text-muted transition hover:border-brand/40 hover:text-ink"
            >
              Voir les tarifs
            </Link>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="relative z-10 border-y border-white/[0.06] bg-white/[0.02] py-10">
        <div className="mx-auto flex max-w-[1100px] flex-wrap justify-center gap-10 px-[6vw]">
          {sector.stats.map((stat) => (
            <div key={stat.value} className="text-center">
              <div className="text-[42px] font-extrabold text-brand">{stat.value}</div>
              <div className="mt-1 max-w-[200px] text-[13px] text-muted">{stat.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Benefits */}
      <section className="relative z-10 mx-auto max-w-[1100px] px-[6vw] py-20">
        <h2 className="mb-2 text-center text-[13px] font-semibold uppercase tracking-[0.1em] text-brand">
          Ce que vous gagnez
        </h2>
        <h3 className="mb-12 text-center text-[28px] font-bold tracking-tight text-ink lg:text-[34px]">
          {service.label} adapté aux{" "}
          <span className="text-brand">{sector.label}</span>
        </h3>

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {sector.benefits.map((b) => (
            <div
              key={b.title}
              className="rounded-[16px] border border-white/[0.07] bg-white/[0.03] p-6 transition hover:border-brand/30 hover:bg-white/[0.05]"
            >
              <div className="mb-3 flex h-11 w-11 items-center justify-center rounded-[10px] bg-brand/15 text-[20px]">
                {b.icon}
              </div>
              <h4 className="mb-2 font-semibold text-ink">{b.title}</h4>
              <p className="text-[14px] leading-relaxed text-muted">{b.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Comment ça marche */}
      <section className="relative z-10 border-y border-white/[0.06] bg-white/[0.02] py-20">
        <div className="mx-auto max-w-[1100px] px-[6vw]">
          <h2 className="mb-2 text-center text-[13px] font-semibold uppercase tracking-[0.1em] text-brand">
            Comment ça marche
          </h2>
          <h3 className="mb-12 text-center text-[28px] font-bold tracking-tight text-ink lg:text-[34px]">
            Opérationnel en 3 étapes
          </h3>

          <div className="grid gap-6 md:grid-cols-3">
            {service.steps.map((step, i) => (
              <div key={step.title} className="relative">
                {i < service.steps.length - 1 && (
                  <div className="absolute right-0 top-6 hidden h-[2px] w-[calc(50%-24px)] bg-brand/20 md:block" />
                )}
                <div className="rounded-[16px] border border-white/[0.07] bg-white/[0.03] p-6">
                  <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-full bg-brand/15 text-[16px] font-extrabold text-brand">
                    {i + 1}
                  </div>
                  <h4 className="mb-2 font-semibold text-ink">{step.title}</h4>
                  <p className="text-[14px] leading-relaxed text-muted">{step.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="relative z-10 mx-auto max-w-[800px] px-[6vw] py-20">
        <h2 className="mb-2 text-center text-[13px] font-semibold uppercase tracking-[0.1em] text-brand">
          Questions fréquentes
        </h2>
        <h3 className="mb-12 text-center text-[28px] font-bold tracking-tight text-ink">
          On répond à vos questions
        </h3>

        <div className="space-y-4">
          {sector.faq.map((item) => (
            <div
              key={item.q}
              className="rounded-[14px] border border-white/[0.07] bg-white/[0.03] p-6"
            >
              <h4 className="mb-3 font-semibold text-ink">{item.q}</h4>
              <p className="text-[14px] leading-relaxed text-muted">{item.a}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Maillage interne — autres services pour ce secteur */}
      <section className="relative z-10 mx-auto max-w-[1100px] px-[6vw] py-16">
        <h2 className="mb-2 text-[13px] font-semibold uppercase tracking-[0.1em] text-brand">
          Autres solutions
        </h2>
        <h3 className="mb-8 text-[22px] font-bold tracking-tight text-ink">
          Plus de services pour {sector.labelFull}
        </h3>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {PSEO_SERVICES.filter((s) => s.slug !== service.slug).map((s) => (
            <Link
              key={s.slug}
              href={`/solutions/${s.slug}-pour-${sector.slug}` as "/"}
              className="flex items-center gap-3 rounded-[12px] border border-white/[0.07] bg-white/[0.02] px-4 py-3.5 text-[14px] font-medium text-muted transition hover:border-brand/40 hover:text-ink"
            >
              <span className="text-[18px]">{s.icon}</span>
              {s.label}
            </Link>
          ))}
        </div>
      </section>

      {/* Maillage interne — même service pour d'autres secteurs */}
      <section className="relative z-10 border-t border-white/[0.06] mx-auto max-w-[1100px] px-[6vw] py-16">
        <h2 className="mb-2 text-[13px] font-semibold uppercase tracking-[0.1em] text-brand">
          Par secteur
        </h2>
        <h3 className="mb-8 text-[22px] font-bold tracking-tight text-ink">
          {service.label} pour d&apos;autres secteurs
        </h3>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {PSEO_SECTORS.filter((sec) => sec.slug !== sector.slug).map((sec) => (
            <Link
              key={sec.slug}
              href={`/solutions/${service.slug}-pour-${sec.slug}` as "/"}
              className="flex items-center gap-3 rounded-[12px] border border-white/[0.07] bg-white/[0.02] px-4 py-3.5 text-[14px] font-medium text-muted transition hover:border-brand/40 hover:text-ink"
            >
              <span className="text-[18px]">{sec.icon}</span>
              {sec.labelFull}
            </Link>
          ))}
        </div>
      </section>

      {/* CTA Final */}
      <section className="relative z-10 mx-auto max-w-[1100px] px-[6vw] pb-24">
        <div className="rounded-[24px] border border-brand/20 bg-gradient-to-br from-brand/10 to-transparent p-10 text-center">
          <div className="mb-4 text-[40px]">{sector.icon}</div>
          <h2 className="mb-4 text-[28px] font-bold tracking-tight text-ink">
            Prêt à automatiser votre {sector.label.replace("s", "").toLowerCase()} ?
          </h2>
          <p className="mx-auto mb-8 max-w-[540px] text-[16px] text-muted">
            Obtenez une démo personnalisée de notre {service.label.toLowerCase()} pour{" "}
            {sector.label}. Gratuit, sans engagement, 30 minutes.
          </p>
          <Link
            href="/contact"
            className="inline-block rounded-[10px] bg-gradient-to-br from-brand to-[#C6FF00] px-8 py-3.5 text-[16px] font-bold text-[#0A0B10] shadow-[0_4px_24px_rgba(143,212,0,0.45)] transition hover:opacity-90"
          >
            Demander ma démo gratuite →
          </Link>
        </div>
      </section>
    </main>
  );
}
