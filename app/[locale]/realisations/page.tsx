import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";

type Project = {
  name: string;
  sector: string;
  icon: string;
  tag: string;
  title: string;
  desc: string;
  stats: { label: string; value: string }[];
  url: string;
};

type Case = {
  sector: string;
  icon: string;
  tag: string;
  location: string;
  title: string;
  context: string;
  solution: string;
  results: { label: string; value: string }[];
};

const PROJECTS: Project[] = [
  {
    name: "EasyParking",
    sector: "Voyage & Mobilité",
    icon: "🅿️",
    tag: "Plateforme SaaS",
    title: "Comparateur de parkings aéroport en Europe",
    desc: "Plateforme permettant de comparer et réserver des parkings aéroport partout en Europe, à partir de 9€/jour — paiement sécurisé et avis voyageurs vérifiés.",
    stats: [
      { label: "Prix d'entrée", value: "9€ / jour" },
      { label: "Couverture", value: "Toute l'Europe" },
      { label: "Support", value: "WhatsApp 24h/24" },
    ],
    url: "https://easyparking.one",
  },
  {
    name: "EasyBarber",
    sector: "Beauté & Bien-être",
    icon: "💈",
    tag: "SaaS Maroc",
    title: "Marketplace de réservation pour salons & barbershops",
    desc: "Trouver et réserver un salon de coiffure ou barbershop 24h/24 sans appel, avec paiement Mobile Money, avis clients vérifiés et tableau de bord pour les gérants.",
    stats: [
      { label: "Rendez-vous pris", value: "85 000+" },
      { label: "Salons partenaires", value: "1 250+" },
      { label: "Villes couvertes", value: "45+" },
    ],
    url: "https://barbershops-saas.vercel.app",
  },
  {
    name: "Finance Scan Maroc",
    sector: "Finance & Comptabilité",
    icon: "📊",
    tag: "IA Financière",
    title: "Analyse financière IA conforme aux normes marocaines",
    desc: "Diagnostic complet de santé financière pour entreprises marocaines : 50+ ratios, score 0-100, 6 rapports PDF, conformité CGNC — en moins de 30 minutes.",
    stats: [
      { label: "Ratios analysés", value: "50+" },
      { label: "Durée d'analyse", value: "< 30 min" },
      { label: "Types de rapports", value: "6 PDF" },
    ],
    url: "https://finance-scan-maroc-web.vercel.app",
  },
  {
    name: "Générateur OFPPT",
    sector: "Formation professionnelle",
    icon: "🎓",
    tag: "Outil IA",
    title: "Générateur de séances pédagogiques pour formateurs OFPPT",
    desc: "Application IA qui génère automatiquement des séances de formation complètes au format OFPPT standard, exportables en PDF et Word en moins de 30 secondes.",
    stats: [
      { label: "Génération", value: "< 30 secondes" },
      { label: "Formats export", value: "PDF & Word" },
      { label: "Conformité", value: "Format OFPPT" },
    ],
    url: "https://generateur-seances-ofppt-ezzouhir2122-9529s-projects.vercel.app",
  },
  {
    name: "Easy Location IMMO",
    sector: "Immobilier",
    icon: "🏠",
    tag: "Application web",
    title: "Plateforme de gestion locative immobilière",
    desc: "Solution de gestion des locations immobilières avec espace sécurisé pour propriétaires et locataires — suivi des dossiers, contrats et communications en ligne.",
    stats: [
      { label: "Accès", value: "24h/24" },
      { label: "Interface", value: "FR / AR" },
      { label: "Sécurité", value: "Auth sécurisée" },
    ],
    url: "https://easy-location-immo.vercel.app",
  },
  {
    name: "Gestion Syndic",
    sector: "Immobilier",
    icon: "🏢",
    tag: "Application web",
    title: "Plateforme multi-modules de gestion pour syndics",
    desc: "Solution unifiée pour la gestion des résidences et syndics au Maroc : comptabilité, charges, communication résidents et gestion des prestataires dans une seule interface.",
    stats: [
      { label: "Architecture", value: "Multi-modules" },
      { label: "Interface", value: "Unifiée" },
      { label: "Marché", value: "Maroc" },
    ],
    url: "https://gestion-syndic.vercel.app",
  },
];

const CASES: Case[] = [
  {
    sector: "Immobilier",
    icon: "🔄",
    tag: "Automatisation",
    location: "Marrakech",
    title: "Relances clients automatisées pour une agence immobilière",
    context:
      "L'agence gérait manuellement ses relances prospects par WhatsApp et email — un processus chronophage et source d'oublis fréquents.",
    solution:
      "Workflow automatisé : dès qu'un prospect remplit un formulaire, il reçoit un message personnalisé, puis des relances échelonnées à J+2, J+7 et J+14 selon son comportement.",
    results: [
      { label: "Temps récupéré", value: "3h / semaine" },
      { label: "Leads manqués", value: "0" },
      { label: "Taux de réponse", value: "+40 %" },
    ],
  },
  {
    sector: "Mode & Retail",
    icon: "🤖",
    tag: "Chatbot IA",
    location: "Casablanca",
    title: "Chatbot IA WhatsApp pour une boutique de mode",
    context:
      "La boutique recevait des dizaines de questions par jour sur WhatsApp — l'équipe passait 2h/jour à répondre manuellement.",
    solution:
      "Agent IA entraîné sur le catalogue produits, les FAQ et la politique de livraison. Il répond 24h/24, qualifie les acheteurs et transfère les demandes complexes à un humain.",
    results: [
      { label: "Ventes en ligne", value: "+25 %" },
      { label: "Temps SAV économisé", value: "2h / jour" },
      { label: "Satisfaction client", value: "4.8 / 5" },
    ],
  },
  {
    sector: "Industrie",
    icon: "⚙️",
    tag: "Automatisation RH",
    location: "Agadir",
    title: "Onboarding collaborateur entièrement automatisé",
    context:
      "Chaque nouvel employé nécessitait 2 jours d'administratif : collecte de documents, création de comptes, formation initiale — tout fait à la main.",
    solution:
      "Workflow RH complet : formulaire d'entrée, collecte automatique des pièces, création des accès systèmes, envoi du plan de formation et relances jusqu'à validation.",
    results: [
      { label: "Durée onboarding", value: "2 jours → 2h" },
      { label: "Erreurs admin.", value: "−80 %" },
      { label: "Satisfaction équipe", value: "+60 %" },
    ],
  },
  {
    sector: "Restauration",
    icon: "📈",
    tag: "Dashboard IA",
    location: "Rabat",
    title: "Tableau de bord IA pour piloter 3 restaurants",
    context:
      "Le dirigeant pilotait 3 restaurants avec des données éparpillées : caisse, stocks, réservations et avis clients dans des outils différents, sans vue consolidée.",
    solution:
      "Dashboard unifié : consolidation des données en temps réel, alertes automatiques sur stocks critiques et pics de réservations, résumé quotidien par email.",
    results: [
      { label: "Temps de reporting", value: "−90 %" },
      { label: "Pertes sur stocks", value: "−35 %" },
      { label: "Décisions data-driven", value: "× 3" },
    ],
  },
];

export default function Realisations() {
  const t = useTranslations("realisations");

  return (
    <main className="min-h-screen bg-[#0A0B10]">
      {/* Hero */}
      <section className="mx-auto max-w-[860px] px-[6vw] pb-12 pt-20 text-center">
        <div className="mb-4 font-mono text-[12px] uppercase tracking-[0.1em] text-[#8FD400]">
          {t("kicker")}
        </div>
        <h1 className="font-heading text-[clamp(32px,5vw,52px)] font-bold leading-[1.08] tracking-[-0.02em] text-[#F5F6FA]">
          {t("title")}
        </h1>
        <p className="mx-auto mt-5 max-w-[620px] text-[17px] leading-[1.65] text-[#9BA1B0]">
          {t("sub")}
        </p>
      </section>

      {/* Projects grid */}
      <section className="mx-auto max-w-[1100px] px-[6vw] pb-24">
        <div className="mb-8 flex items-center gap-3">
          <div className="h-px flex-1 bg-white/[0.06]" />
          <span className="font-mono text-[11px] uppercase tracking-[0.1em] text-[#9BA1B0]/60">
            Projets & applications
          </span>
          <div className="h-px flex-1 bg-white/[0.06]" />
        </div>

        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {PROJECTS.map((p) => (
            <a
              key={p.name}
              href={p.url}
              target="_blank"
              rel="noopener noreferrer"
              className="group flex flex-col overflow-hidden rounded-[22px] border border-white/[0.07] bg-[#12141C] transition hover:border-[#8FD400]/30 hover:shadow-[0_0_40px_rgba(143,212,0,0.06)]"
            >
              <div className="h-[2px] w-full bg-gradient-to-r from-[#8FD400] to-[#C6FF00] opacity-50 transition group-hover:opacity-100" />

              <div className="flex flex-1 flex-col p-6">
                {/* Header */}
                <div className="mb-4 flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-[12px] bg-[#8FD400]/10 text-[22px]">
                      {p.icon}
                    </span>
                    <div>
                      <p className="font-heading text-[16px] font-bold text-[#F5F6FA]">
                        {p.name}
                      </p>
                      <p className="text-[12px] text-[#9BA1B0]">{p.sector}</p>
                    </div>
                  </div>
                  <span className="shrink-0 rounded-full border border-[#8FD400]/25 bg-[#8FD400]/[0.07] px-2.5 py-0.5 font-mono text-[10px] uppercase tracking-[0.06em] text-[#C6FF00]">
                    {p.tag}
                  </span>
                </div>

                {/* Title + desc */}
                <p className="mb-4 text-[14px] font-semibold leading-[1.35] text-[#F5F6FA]/90">
                  {p.title}
                </p>
                <p className="mb-5 flex-1 text-[13px] leading-[1.65] text-[#9BA1B0]">
                  {p.desc}
                </p>

                {/* Stats */}
                <div className="mb-5 grid grid-cols-3 gap-2">
                  {p.stats.map((s) => (
                    <div
                      key={s.label}
                      className="rounded-[10px] border border-white/[0.06] bg-white/[0.02] px-2 py-2 text-center"
                    >
                      <p className="font-heading text-[13px] font-bold text-[#C6FF00]">
                        {s.value}
                      </p>
                      <p className="text-[10px] leading-[1.3] text-[#9BA1B0]">{s.label}</p>
                    </div>
                  ))}
                </div>

                {/* CTA */}
                <div className="flex items-center gap-1.5 text-[13px] font-semibold text-[#8FD400] transition group-hover:gap-2.5">
                  Voir le projet
                  <span aria-hidden="true">→</span>
                </div>
              </div>
            </a>
          ))}
        </div>
      </section>

      {/* Case studies */}
      <section className="border-t border-white/[0.05]">
        <div className="mx-auto max-w-[1100px] px-[6vw] py-20">
          <div className="mb-8 flex items-center gap-3">
            <div className="h-px flex-1 bg-white/[0.06]" />
            <span className="font-mono text-[11px] uppercase tracking-[0.1em] text-[#9BA1B0]/60">
              Cas clients — automatisation & IA
            </span>
            <div className="h-px flex-1 bg-white/[0.06]" />
          </div>

          <div className="flex flex-col gap-6">
            {CASES.map((c, i) => (
              <div
                key={i}
                className="overflow-hidden rounded-[22px] border border-white/[0.07] bg-[#12141C]"
              >
                <div className="h-[2px] w-full bg-gradient-to-r from-[#8FD400] to-[#C6FF00] opacity-50" />

                <div className="p-7 md:p-9">
                  {/* Header */}
                  <div className="mb-5 flex flex-wrap items-start justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-[12px] bg-[#8FD400]/10 text-[22px]">
                        {c.icon}
                      </span>
                      <div>
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="rounded-full border border-[#8FD400]/25 bg-[#8FD400]/[0.07] px-2.5 py-0.5 font-mono text-[10px] uppercase tracking-[0.06em] text-[#C6FF00]">
                            {c.tag}
                          </span>
                          <span className="text-[12px] text-[#9BA1B0]">
                            {c.sector} · {c.location}
                          </span>
                        </div>
                        <h2 className="mt-1 font-heading text-[18px] font-bold leading-[1.2] text-[#F5F6FA]">
                          {c.title}
                        </h2>
                      </div>
                    </div>

                    {/* Results */}
                    <div className="flex flex-wrap gap-2.5">
                      {c.results.map((r, j) => (
                        <div
                          key={j}
                          className="rounded-[10px] border border-[#8FD400]/20 bg-[#8FD400]/[0.05] px-3.5 py-2 text-center"
                        >
                          <p className="font-heading text-[16px] font-bold text-[#C6FF00]">
                            {r.value}
                          </p>
                          <p className="text-[11px] text-[#9BA1B0]">{r.label}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Body */}
                  <div className="grid gap-5 md:grid-cols-2">
                    <div>
                      <p className="mb-1 font-mono text-[10px] uppercase tracking-[0.08em] text-[#9BA1B0]/60">
                        Contexte
                      </p>
                      <p className="text-[14px] leading-[1.7] text-[#F5F6FA]/80">{c.context}</p>
                    </div>
                    <div>
                      <p className="mb-1 font-mono text-[10px] uppercase tracking-[0.08em] text-[#9BA1B0]/60">
                        Solution
                      </p>
                      <p className="text-[14px] leading-[1.7] text-[#F5F6FA]/80">{c.solution}</p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="pb-24">
        <div className="mx-auto max-w-[620px] px-[6vw] text-center">
          <div className="rounded-[24px] border border-[#8FD400]/20 bg-gradient-to-b from-[#8FD400]/[0.06] to-transparent px-8 py-12">
            <p className="mb-2 font-mono text-[11px] uppercase tracking-[0.1em] text-[#8FD400]">
              Votre projet
            </p>
            <h3 className="mb-4 font-heading text-[24px] font-bold text-[#F5F6FA]">
              {t("ctaTitle")}
            </h3>
            <p className="mb-7 text-[15px] text-[#9BA1B0]">{t("ctaSub")}</p>
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 rounded-[12px] bg-gradient-to-br from-[#8FD400] to-[#C6FF00] px-8 py-3.5 text-[15px] font-bold text-[#0A0B10] shadow-[0_4px_24px_rgba(143,212,0,0.4)] transition hover:opacity-90"
            >
              {t("cta")} →
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
