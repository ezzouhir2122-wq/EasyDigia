import type { Metadata } from "next";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";

export const metadata: Metadata = {
  title: "Témoignages clients — Résultats réels | EasyDigia",
  description: "Découvrez comment nos clients marocains automatisent leur activité et gagnent des heures chaque semaine grâce à EasyDigia.",
  openGraph: {
    title: "Témoignages clients — Résultats réels | EasyDigia",
    description: "50+ projets livrés. Découvrez les résultats concrets de nos clients.",
    images: [{ url: "https://easydigia.com/og-image.png", width: 1200, height: 630 }],
  },
};

const TESTIMONIALS = [
  { name: "Rachid B.", role: "Directeur Général", company: "Agence immobilière", city: "Marrakech", sector: "Immobilier", stat: "3h récupérées/semaine", quote: "Les relances clients sont désormais automatiques. On récupère 3h par semaine et les oublis ont complètement disparu.", color: "from-[#8FD400]/40 to-[#8FD400]/10 text-[#8FD400]" },
  { name: "Fatima Z.", role: "CEO", company: "Boutique de mode", city: "Casablanca", sector: "Mode & Retail", stat: "+25% de ventes", quote: "Notre chatbot répond aux clients sur WhatsApp 24h/24. Les ventes ont progressé de 25% dès le premier mois.", color: "from-[#00C2FF]/40 to-[#00C2FF]/10 text-[#00C2FF]" },
  { name: "Karim M.", role: "Directeur RH", company: "PME industrielle", city: "Agadir", sector: "Industrie", stat: "2 jours → 2 heures", quote: "L'onboarding des nouveaux collaborateurs est entièrement automatisé. Ce qui prenait 2 jours se fait maintenant en 2 heures.", color: "from-[#A855F7]/40 to-[#A855F7]/10 text-[#A855F7]" },
  { name: "Youssef A.", role: "Fondateur", company: "Startup e-commerce", city: "Rabat", sector: "E-commerce", stat: "−90% temps reporting", quote: "Avant je passais mes dimanches sur Excel. Maintenant j'ai un tableau de bord qui se met à jour seul et m'envoie un résumé le lundi matin.", color: "from-[#F59E0B]/40 to-[#F59E0B]/10 text-[#F59E0B]" },
  { name: "Sara L.", role: "Directrice Marketing", company: "Cabinet de conseil", city: "Casablanca", sector: "Conseil", stat: "4h économisées/jour", quote: "L'agent IA gère notre veille concurrentielle et prépare nos présentations clients. L'équipe est 4x plus productive sur les sujets stratégiques.", color: "from-[#EC4899]/40 to-[#EC4899]/10 text-[#EC4899]" },
  { name: "Omar B.", role: "Gérant", company: "Restauration (3 sites)", city: "Rabat", sector: "Restauration", stat: "−35% pertes stocks", quote: "Le dashboard IA consolide mes 3 restaurants en temps réel. J'ai réduit les pertes sur stocks de 35% et je prends de meilleures décisions.", color: "from-[#10B981]/40 to-[#10B981]/10 text-[#10B981]" },
];

const CASES = [
  { sector: "Immobilier", icon: "🔄", tag: "Automatisation", location: "Marrakech", title: "Relances clients automatisées pour une agence immobilière", result1: { label: "Temps récupéré", value: "3h / semaine" }, result2: { label: "Taux de réponse", value: "+40%" } },
  { sector: "Mode & Retail", icon: "🤖", tag: "Chatbot IA", location: "Casablanca", title: "Chatbot IA WhatsApp pour une boutique de mode", result1: { label: "Ventes en ligne", value: "+25%" }, result2: { label: "Satisfaction client", value: "4.8 / 5" } },
  { sector: "Industrie", icon: "⚙️", tag: "RH Auto", location: "Agadir", title: "Onboarding collaborateur entièrement automatisé", result1: { label: "Durée onboarding", value: "2j → 2h" }, result2: { label: "Erreurs admin.", value: "−80%" } },
  { sector: "Restauration", icon: "📈", tag: "Dashboard IA", location: "Rabat", title: "Tableau de bord IA pour piloter 3 restaurants", result1: { label: "Temps reporting", value: "−90%" }, result2: { label: "Pertes stocks", value: "−35%" } },
];

export default function Temoignages() {
  const t = useTranslations("nav");

  return (
    <main className="min-h-screen bg-[#0A0B10]">
      {/* Hero */}
      <section className="mx-auto max-w-[860px] px-[6vw] pb-12 pt-20 text-center">
        <div className="mb-4 font-mono text-[12px] uppercase tracking-[0.1em] text-[#8FD400]">
          Ils nous font confiance
        </div>
        <h1 className="font-heading text-[clamp(32px,5vw,52px)] font-bold leading-[1.08] tracking-[-0.02em] text-[#F5F6FA]">
          Des résultats réels, des clients satisfaits
        </h1>
        <p className="mx-auto mt-5 max-w-[580px] text-[17px] leading-[1.65] text-[#9BA1B0]">
          50+ projets livrés au Maroc. Voici ce que nos clients disent de leur transformation digitale.
        </p>
      </section>

      {/* Stats strip */}
      <section className="border-y border-white/[0.05] bg-[#0D0F17]/80">
        <div className="mx-auto grid max-w-[900px] grid-cols-3 px-[6vw]">
          {[
            { value: "50+", label: "Projets livrés" },
            { value: "100%", label: "Clients satisfaits" },
            { value: "3+", label: "Années d'expérience" },
          ].map((s) => (
            <div key={s.label} className="py-8 text-center">
              <p className="font-heading text-[42px] font-bold leading-none text-[#C6FF00]">{s.value}</p>
              <p className="mt-2 text-[12px] uppercase tracking-[0.08em] text-[#9BA1B0]/70">{s.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Testimonials grid */}
      <section className="mx-auto max-w-[1100px] px-[6vw] py-20">
        <div className="mb-8 flex items-center gap-3">
          <div className="h-px flex-1 bg-white/[0.06]" />
          <span className="font-mono text-[11px] uppercase tracking-[0.1em] text-[#9BA1B0]/60">Témoignages</span>
          <div className="h-px flex-1 bg-white/[0.06]" />
        </div>
        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {TESTIMONIALS.map((item) => (
            <div key={item.name} className="flex flex-col rounded-[20px] border border-white/[0.07] bg-[#12141C] p-7">
              <div className="mb-3 flex gap-0.5 text-[#F5A623]">{"★★★★★".split("").map((s, j) => <span key={j}>{s}</span>)}</div>
              <div className="mb-4 self-start rounded-full border border-[#8FD400]/30 bg-[#8FD400]/[0.08] px-3 py-1 font-mono text-[11px] font-semibold text-[#C6FF00]">{item.stat}</div>
              <p className="mb-5 flex-1 text-[14px] leading-[1.7] text-[#F5F6FA]/90">&ldquo;{item.quote}&rdquo;</p>
              <div className="flex items-center gap-3 border-t border-white/[0.06] pt-5">
                <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gradient-to-br text-[12px] font-bold ${item.color}`}>
                  {item.name.split(" ").map(w => w[0]).join("").slice(0, 2).toUpperCase()}
                </div>
                <div>
                  <p className="text-[13.5px] font-semibold text-[#F5F6FA]">{item.name}</p>
                  <p className="text-[11px] text-[#9BA1B0]">{item.role} · {item.company} — {item.city}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Case studies */}
      <section className="border-t border-white/[0.05] bg-[#0D0F17]">
        <div className="mx-auto max-w-[1100px] px-[6vw] py-20">
          <div className="mb-8 flex items-center gap-3">
            <div className="h-px flex-1 bg-white/[0.06]" />
            <span className="font-mono text-[11px] uppercase tracking-[0.1em] text-[#9BA1B0]/60">Cas clients détaillés</span>
            <div className="h-px flex-1 bg-white/[0.06]" />
          </div>
          <div className="grid gap-5 md:grid-cols-2">
            {CASES.map((c) => (
              <div key={c.title} className="overflow-hidden rounded-[20px] border border-white/[0.07] bg-[#12141C]">
                <div className="h-[2px] w-full bg-gradient-to-r from-[#8FD400] to-[#C6FF00] opacity-60" />
                <div className="p-7">
                  <div className="mb-3 flex items-center gap-2">
                    <span className="text-xl">{c.icon}</span>
                    <span className="rounded-full border border-[#8FD400]/25 bg-[#8FD400]/[0.07] px-2.5 py-0.5 font-mono text-[10px] uppercase tracking-[0.06em] text-[#C6FF00]">{c.tag}</span>
                    <span className="text-[12px] text-[#9BA1B0]">{c.sector} · {c.location}</span>
                  </div>
                  <h3 className="mb-4 font-heading text-[16px] font-bold leading-[1.3] text-[#F5F6FA]">{c.title}</h3>
                  <div className="flex gap-3">
                    <div className="flex-1 rounded-[10px] border border-[#8FD400]/20 bg-[#8FD400]/[0.04] px-3 py-2.5 text-center">
                      <p className="font-heading text-[18px] font-bold text-[#C6FF00]">{c.result1.value}</p>
                      <p className="text-[11px] text-[#9BA1B0]">{c.result1.label}</p>
                    </div>
                    <div className="flex-1 rounded-[10px] border border-[#8FD400]/20 bg-[#8FD400]/[0.04] px-3 py-2.5 text-center">
                      <p className="font-heading text-[18px] font-bold text-[#C6FF00]">{c.result2.value}</p>
                      <p className="text-[11px] text-[#9BA1B0]">{c.result2.label}</p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="pb-24">
        <div className="mx-auto max-w-[620px] px-[6vw] text-center">
          <div className="rounded-[24px] border border-[#8FD400]/20 bg-gradient-to-b from-[#8FD400]/[0.06] to-transparent px-8 py-12">
            <h3 className="mb-4 font-heading text-[22px] font-bold text-[#F5F6FA]">Votre entreprise, prochaine success story ?</h3>
            <Link href="/contact" className="inline-flex items-center gap-2 rounded-[12px] bg-gradient-to-br from-[#8FD400] to-[#C6FF00] px-8 py-3.5 text-[15px] font-bold text-[#0A0B10] shadow-[0_4px_24px_rgba(143,212,0,0.4)] transition hover:opacity-90">
              Demander mon audit gratuit →
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
