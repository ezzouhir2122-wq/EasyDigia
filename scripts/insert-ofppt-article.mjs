/**
 * Insère l'article "IA et Formation Professionnelle OFPPT Maroc" dans Supabase.
 * Run: node scripts/insert-ofppt-article.mjs
 */
import { createClient } from "@supabase/supabase-js";
import { readFileSync } from "fs";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const envPath = join(__dirname, "../.env.local");
for (const line of readFileSync(envPath, "utf-8").split("\n")) {
  const m = line.match(/^([^#=]+)=(.*)$/);
  if (m) process.env[m[1].trim()] = m[2].trim();
}

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY ?? process.env.SUPABASE_ANON_KEY,
  { auth: { persistSession: false } }
);

/* ─────────────────────────── BODY FR ─────────────────────────── */
const bodyFr = `
<blockquote style="border-left:4px solid #8FD400;padding:16px 20px;margin:24px 0;background:rgba(143,212,0,0.06);border-radius:0 8px 8px 0">
  <strong style="color:#C6FF00;display:block;margin-bottom:8px">Points Clés</strong>
  <ul style="margin:0;padding-left:20px">
    <li>En 2025-2026, l'OFPPT forme <strong>746 500 stagiaires</strong> dans 510 établissements — un record — mais le Maroc reste <strong>78e/81</strong> en compétences futures (QS Future Skills Index, 2025).</li>
    <li>Le WEF prévoit la création de <strong>170 millions de nouveaux emplois</strong> d'ici 2030, dont la majorité exigeront des compétences en IA et numérique (<a href="https://www.weforum.org/press/2025/01/future-of-jobs-report-2025-78-million-new-job-opportunities-by-2030-but-urgent-upskilling-needed-to-prepare-workforces/" target="_blank" rel="noopener">WEF Future of Jobs, 2025</a>).</li>
    <li>Le marché de l'IA dans l'éducation au Moyen-Orient et en Afrique atteindra <strong>1,64 milliard USD d'ici 2030</strong>, avec un CAGR de 32,6 % (Grand View Research, 2025).</li>
    <li>L'OFPPT a ouvert <strong>65 nouvelles filières</strong> et investi <strong>6,3 milliards DH</strong> dans son plan d'action 2026 pour accélérer la transformation numérique.</li>
  </ul>
</blockquote>

<h2>Pourquoi le Maroc ne Peut Plus Attendre sur l'IA dans la Formation</h2>

<p>En janvier 2025, le Forum Économique Mondial a publié son rapport <em>Future of Jobs 2025</em> : d'ici 2030, l'automatisation et l'IA vont créer <strong>170 millions de nouveaux rôles</strong> et en supprimer 92 millions, soit un gain net de <strong>78 millions d'emplois</strong> (<a href="https://www.weforum.org/press/2025/01/future-of-jobs-report-2025-78-million-new-job-opportunities-by-2030-but-urgent-upskilling-needed-to-prepare-workforces/" target="_blank" rel="noopener">WEF Future of Jobs Report, 2025</a>). Ce qui compte pour le Maroc, c'est la nature de ces emplois : ils exigent presque tous une maîtrise des outils numériques et de l'IA.</p>

<p><strong>63 % des employeurs</strong> interrogés dans 55 économies citent le déficit de compétences comme leur principal frein à la croissance, et <strong>85 %</strong> prévoient de prioriser l'upskilling de leurs équipes d'ici 2030. Pour aller plus loin sur l'impact du numérique dans les entreprises marocaines, consultez notre <a href="/fr/blog/formation-ia-equipe-prompt-dirigeants">guide de formation IA pour les équipes et dirigeants de PME</a>.</p>

<p>L'OFPPT accueille chaque année des centaines de milliers de jeunes marocains qui entrent directement sur le marché du travail à l'issue de leur formation. Si ces jeunes sortent sans maîtrise des outils d'IA, ils seront en compétition défavorable avec des profils formés en Tunisie, en Égypte ou en Europe. Le coût de l'inaction se mesure en points de compétitivité nationale.</p>

<figure style="margin:32px 0;text-align:center">
<svg viewBox="0 0 560 300" xmlns="http://www.w3.org/2000/svg" style="max-width:100%;border-radius:12px" role="img" aria-label="Impact de l'IA sur l'emploi mondial d'ici 2030 selon le WEF">
  <rect width="560" height="300" fill="#0f172a" rx="12"/>
  <text x="280" y="30" text-anchor="middle" font-family="system-ui,sans-serif" font-size="13" font-weight="700" fill="#f1f5f9">Impact de l'IA sur l'emploi mondial d'ici 2030</text>
  <text x="280" y="48" text-anchor="middle" font-family="system-ui,sans-serif" font-size="10" fill="#94a3b8">Source : WEF Future of Jobs Report, janvier 2025</text>
  <rect x="50" y="72" width="190" height="58" rx="6" fill="#22c55e"/>
  <text x="145" y="108" text-anchor="middle" font-family="system-ui,sans-serif" font-size="22" font-weight="800" fill="#fff">+170M</text>
  <text x="145" y="148" text-anchor="middle" font-family="system-ui,sans-serif" font-size="11" fill="#86efac">Nouveaux emplois créés</text>
  <rect x="320" y="72" width="190" height="58" rx="6" fill="#ef4444"/>
  <text x="415" y="108" text-anchor="middle" font-family="system-ui,sans-serif" font-size="22" font-weight="800" fill="#fff">−92M</text>
  <text x="415" y="148" text-anchor="middle" font-family="system-ui,sans-serif" font-size="11" fill="#fca5a5">Emplois supprimés</text>
  <rect x="155" y="172" width="250" height="46" rx="6" fill="#3b82f6"/>
  <text x="280" y="201" text-anchor="middle" font-family="system-ui,sans-serif" font-size="17" font-weight="800" fill="#fff">Gain net : +78M emplois</text>
  <text x="140" y="250" text-anchor="middle" font-family="system-ui,sans-serif" font-size="11" fill="#94a3b8">63% des employeurs</text>
  <text x="140" y="266" text-anchor="middle" font-family="system-ui,sans-serif" font-size="10" fill="#64748b">citent le déficit de compétences</text>
  <text x="140" y="282" text-anchor="middle" font-family="system-ui,sans-serif" font-size="10" fill="#64748b">comme 1er frein</text>
  <text x="420" y="250" text-anchor="middle" font-family="system-ui,sans-serif" font-size="11" fill="#94a3b8">85% prévoient de</text>
  <text x="420" y="266" text-anchor="middle" font-family="system-ui,sans-serif" font-size="10" fill="#64748b">prioriser l'upskilling</text>
  <text x="420" y="282" text-anchor="middle" font-family="system-ui,sans-serif" font-size="10" fill="#64748b">d'ici 2030</text>
</svg>
<figcaption style="font-size:12px;color:#64748b;margin-top:8px">Source : WEF Future of Jobs Report, janvier 2025 — <a href="https://weforum.org" target="_blank" rel="noopener">weforum.org</a></figcaption>
</figure>

<h2>L'IA dans la Formation Professionnelle : De Quoi Parle-t-on Concrètement ?</h2>

<p>En 2025, selon le <em>Coursera Global Skills Report 2025</em>, le Maroc occupe la <strong>71e place mondiale en compétences numériques</strong> et la <strong>80e en maturité IA</strong> sur 109 pays évalués. Ces classements reflètent un retard réel, mais ils indiquent aussi que l'écart est comblable — d'autres économies comparables ont rattrapé plusieurs positions en deux à trois ans grâce à des programmes structurés. Pour explorer les outils concrets, notre <a href="/fr/blog/formation-ia-equipe-prompt-dirigeants">guide du prompt pour formateurs et dirigeants</a> est un point de départ idéal.</p>

<p>Voici les quatre grandes catégories d'application de l'IA dans un centre de formation professionnelle :</p>

<ul>
  <li><strong>Les tuteurs IA personnalisés :</strong> des outils comme Khanmigo ou des LLM intégrés permettent à chaque stagiaire de progresser à son rythme — personnalisation impossible en classe de 30 avec un seul formateur.</li>
  <li><strong>L'évaluation automatisée :</strong> correction automatique de QCM, d'épreuves écrites et même de productions techniques filmées, libérant le formateur des tâches répétitives.</li>
  <li><strong>La simulation et les environnements virtuels :</strong> en maintenance industrielle ou bâtiment, les stagiaires s'entraînent sur des scénarios réels sans risque et sans abîmer de matériel.</li>
  <li><strong>L'aide à la préparation pédagogique :</strong> un formateur OFPPT peut utiliser ChatGPT ou Claude pour générer en cinq minutes un plan de séance, des exercices différenciés ou un résumé bilingue français/arabe.</li>
</ul>

<img src="https://plus.unsplash.com/premium_photo-1708879452883-73be1eb9dd99?fm=jpg&q=60&w=1400&auto=format&fit=crop" alt="Personne tenant une pancarte Learn AI symbolisant la formation à l'intelligence artificielle dans les centres OFPPT au Maroc" style="width:100%;border-radius:12px;margin:24px 0" loading="lazy" />

<h2>Ce que l'OFPPT a Déjà Mis en Place : Programmes et Investissements 2026</h2>

<p>En mai 2026, l'OFPPT a présenté un plan d'action ambitieux : <strong>65 nouvelles filières</strong>, 3 nouvelles Cités des Métiers et des Compétences, et un budget de <strong>6,3 milliards de dirhams</strong> (<a href="https://medias24.com" target="_blank" rel="noopener">Medias24</a>, mai 2026). Le secteur "Digital &amp; Intelligence Artificielle" figure parmi les trois domaines prioritaires de la rentrée 2025-2026. Dans la seule région Fès-Meknès, ce secteur représente <strong>10 463 places de formation — 24 % de l'offre régionale</strong>.</p>

<blockquote style="border-left:4px solid #3b82f6;padding:16px 20px;margin:24px 0;background:rgba(59,130,246,0.06);border-radius:0 8px 8px 0">
  <strong>Notre analyse :</strong> La montée en puissance quantitative de l'OFPPT (746 500 stagiaires en 2025-2026) crée une fenêtre d'opportunité unique. Mais sans transformation qualitative des méthodes pédagogiques — et sans intégration de l'IA comme outil transversal — le risque est de produire davantage de diplômés déconnectés des besoins réels du marché.
</blockquote>

<figure style="margin:32px 0;text-align:center">
<svg viewBox="0 0 560 290" xmlns="http://www.w3.org/2000/svg" style="max-width:100%;border-radius:12px" role="img" aria-label="Évolution des stagiaires OFPPT 2021-2026">
  <rect width="560" height="290" fill="#0f172a" rx="12"/>
  <text x="280" y="28" text-anchor="middle" font-family="system-ui,sans-serif" font-size="13" font-weight="700" fill="#f1f5f9">Évolution des Stagiaires OFPPT (2021–2026)</text>
  <text x="280" y="46" text-anchor="middle" font-family="system-ui,sans-serif" font-size="10" fill="#94a3b8">Source : OFPPT communiqués officiels 2025-2026</text>
  <line x1="60" y1="230" x2="520" y2="230" stroke="#334155" stroke-width="1.5"/>
  <line x1="60" y1="60" x2="60" y2="230" stroke="#334155" stroke-width="1.5"/>
  <text x="50" y="234" text-anchor="end" font-family="system-ui,sans-serif" font-size="9" fill="#64748b">0</text>
  <text x="50" y="185" text-anchor="end" font-family="system-ui,sans-serif" font-size="9" fill="#64748b">150K</text>
  <text x="50" y="135" text-anchor="end" font-family="system-ui,sans-serif" font-size="9" fill="#64748b">400K</text>
  <text x="50" y="90" text-anchor="end" font-family="system-ui,sans-serif" font-size="9" fill="#64748b">600K</text>
  <text x="50" y="65" text-anchor="end" font-family="system-ui,sans-serif" font-size="9" fill="#64748b">750K</text>
  <rect x="90" y="214" width="45" height="16" rx="3" fill="#6366f1"/>
  <text x="112" y="210" text-anchor="middle" font-family="system-ui,sans-serif" font-size="8" fill="#a5b4fc">25K</text>
  <text x="112" y="248" text-anchor="middle" font-family="system-ui,sans-serif" font-size="9" fill="#94a3b8">2021</text>
  <rect x="200" y="200" width="45" height="30" rx="3" fill="#6366f1"/>
  <text x="222" y="196" text-anchor="middle" font-family="system-ui,sans-serif" font-size="8" fill="#a5b4fc">50K</text>
  <text x="222" y="248" text-anchor="middle" font-family="system-ui,sans-serif" font-size="9" fill="#94a3b8">2023</text>
  <rect x="310" y="96" width="45" height="134" rx="3" fill="#22c55e" opacity="0.25"/>
  <rect x="310" y="176" width="45" height="54" rx="3" fill="#22c55e"/>
  <text x="332" y="92" text-anchor="middle" font-family="system-ui,sans-serif" font-size="8" fill="#86efac">678K</text>
  <text x="332" y="172" text-anchor="middle" font-family="system-ui,sans-serif" font-size="8" fill="#86efac">100K</text>
  <text x="332" y="248" text-anchor="middle" font-family="system-ui,sans-serif" font-size="9" fill="#94a3b8">2024-25</text>
  <rect x="420" y="63" width="45" height="167" rx="3" fill="#3b82f6" opacity="0.25"/>
  <rect x="420" y="163" width="45" height="67" rx="3" fill="#3b82f6"/>
  <text x="442" y="58" text-anchor="middle" font-family="system-ui,sans-serif" font-size="10" font-weight="700" fill="#93c5fd">746.5K</text>
  <text x="442" y="159" text-anchor="middle" font-family="system-ui,sans-serif" font-size="8" fill="#93c5fd">100K+</text>
  <text x="442" y="248" text-anchor="middle" font-family="system-ui,sans-serif" font-size="9" fill="#94a3b8">2025-26</text>
</svg>
<figcaption style="font-size:12px;color:#64748b;margin-top:8px">Sources : <a href="https://www.ofppt.ma/fr/communiques-de-presse/rentree-de-formation-2025-2026-une-dynamique-renouvelee-au-service-du" target="_blank" rel="noopener">OFPPT communiqués officiels</a> — La formation par apprentissage a quadruplé entre 2021 et 2025</figcaption>
</figure>

<h2>Le Marché de l'IA dans l'Éducation MEA : Une Opportunité à ne pas Rater</h2>

<p>En 2024, le marché de l'IA dans l'éducation pour la région Moyen-Orient et Afrique a atteint <strong>280,8 millions USD</strong>. Il devrait atteindre <strong>1,645 milliard USD d'ici 2030</strong>, avec un taux de croissance annuel composé de <strong>32,6 %</strong> (<a href="https://www.grandviewresearch.com/horizon/outlook/ai-in-education-market/mea" target="_blank" rel="noopener">Grand View Research</a>, 2025).</p>

<p>La stratégie <strong>Digital Morocco 2030</strong> s'inscrit dans cette logique avec <strong>11 milliards DH</strong> alloués sur 2024-2026, pour créer <strong>240 000 emplois numériques d'ici 2030</strong> et former <strong>100 000 jeunes par an</strong> aux métiers du numérique (<a href="https://medias24.com/2024/09/25/maroc-digital-2030-11-mmdh-alloues-entre-2024-et-2026-creation-de-100-000-emplois-par-an-a-lhorizon-2030/" target="_blank" rel="noopener">Medias24</a>, septembre 2024). Pour en savoir plus sur ce que ces opportunités représentent concrètement pour les entreprises, consultez <a href="/fr/blog/services-ia-automatisation-pme-maroc">notre guide des services IA au Maroc</a>.</p>

<figure style="margin:32px 0;text-align:center">
<svg viewBox="0 0 560 280" xmlns="http://www.w3.org/2000/svg" style="max-width:100%;border-radius:12px" role="img" aria-label="Croissance du marché IA dans l'éducation MEA 2024-2030">
  <rect width="560" height="280" fill="#0f172a" rx="12"/>
  <text x="280" y="28" text-anchor="middle" font-family="system-ui,sans-serif" font-size="13" font-weight="700" fill="#f1f5f9">Marché IA dans l'Éducation — Région MEA (USD)</text>
  <text x="280" y="46" text-anchor="middle" font-family="system-ui,sans-serif" font-size="10" fill="#94a3b8">Source : Grand View Research, 2025 — CAGR 32,6 %</text>
  <line x1="70" y1="220" x2="520" y2="220" stroke="#334155" stroke-width="1.5"/>
  <line x1="70" y1="60" x2="70" y2="220" stroke="#334155" stroke-width="1.5"/>
  <line x1="70" y1="167" x2="520" y2="167" stroke="#1e293b" stroke-width="1" stroke-dasharray="4,4"/>
  <line x1="70" y1="114" x2="520" y2="114" stroke="#1e293b" stroke-width="1" stroke-dasharray="4,4"/>
  <line x1="70" y1="61" x2="520" y2="61" stroke="#1e293b" stroke-width="1" stroke-dasharray="4,4"/>
  <text x="60" y="224" text-anchor="end" font-family="system-ui,sans-serif" font-size="9" fill="#64748b">0</text>
  <text x="60" y="171" text-anchor="end" font-family="system-ui,sans-serif" font-size="9" fill="#64748b">500M</text>
  <text x="60" y="118" text-anchor="end" font-family="system-ui,sans-serif" font-size="9" fill="#64748b">1B</text>
  <text x="60" y="65" text-anchor="end" font-family="system-ui,sans-serif" font-size="9" fill="#64748b">1.6B</text>
  <polygon points="100,200 195,192 290,177 385,147 480,63 480,220 100,220" fill="#3b82f6" opacity="0.15"/>
  <polyline points="100,200 195,192 290,177 385,147 480,63" fill="none" stroke="#3b82f6" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>
  <circle cx="100" cy="200" r="5" fill="#3b82f6"/>
  <circle cx="195" cy="192" r="5" fill="#3b82f6"/>
  <circle cx="290" cy="177" r="5" fill="#3b82f6"/>
  <circle cx="385" cy="147" r="5" fill="#3b82f6"/>
  <circle cx="480" cy="63" r="7" fill="#22c55e"/>
  <text x="100" y="192" text-anchor="middle" font-family="system-ui,sans-serif" font-size="9" fill="#93c5fd">$281M</text>
  <text x="100" y="238" text-anchor="middle" font-family="system-ui,sans-serif" font-size="9" fill="#94a3b8">2024</text>
  <text x="195" y="184" text-anchor="middle" font-family="system-ui,sans-serif" font-size="9" fill="#93c5fd">$373M</text>
  <text x="195" y="238" text-anchor="middle" font-family="system-ui,sans-serif" font-size="9" fill="#94a3b8">2025</text>
  <text x="290" y="169" text-anchor="middle" font-family="system-ui,sans-serif" font-size="9" fill="#93c5fd">$495M</text>
  <text x="290" y="238" text-anchor="middle" font-family="system-ui,sans-serif" font-size="9" fill="#94a3b8">2026</text>
  <text x="385" y="139" text-anchor="middle" font-family="system-ui,sans-serif" font-size="9" fill="#93c5fd">$870M</text>
  <text x="385" y="238" text-anchor="middle" font-family="system-ui,sans-serif" font-size="9" fill="#94a3b8">2028</text>
  <text x="480" y="53" text-anchor="middle" font-family="system-ui,sans-serif" font-size="11" font-weight="700" fill="#86efac">$1.64B</text>
  <text x="480" y="238" text-anchor="middle" font-family="system-ui,sans-serif" font-size="9" fill="#94a3b8">2030</text>
</svg>
<figcaption style="font-size:12px;color:#64748b;margin-top:8px">Source : <a href="https://www.grandviewresearch.com/horizon/outlook/ai-in-education-market/mea" target="_blank" rel="noopener">Grand View Research, AI in Education Market — MEA Segment, 2025</a>. CAGR projeté : 32,6 % sur 2024-2030</figcaption>
</figure>

<h2>Comment Intégrer l'IA Concrètement dans une Salle de Formation OFPPT ?</h2>

<p>Voici ce qu'un formateur OFPPT peut faire dès demain matin, sans budget supplémentaire et sans expertise technique avancée. En 2026, <strong>plus d'un salarié marocain sur deux</strong> utilise déjà des outils d'IA de sa propre initiative au travail, sans formation institutionnelle (<a href="https://www.jobsquare.ma/blog/intelligence-artificielle-emploi-maroc-2026/" target="_blank" rel="noopener">JobSquare.ma</a>, juin 2026). Ce phénomène de "Shadow IA" touche aussi les centres de formation — raison de plus pour structurer l'intégration.</p>

<ul>
  <li><strong>Étape 1 — Démarrer avec les outils de préparation :</strong> ChatGPT, Claude ou Gemini peuvent générer en quelques minutes un plan de cours structuré, des exercices pratiques, des QCM adaptés au niveau des stagiaires, ou des résumés bilingues français/arabe. Une séance qui prenait deux heures à préparer en prend vingt minutes.</li>
  <li><strong>Étape 2 — Intégrer la personnalisation :</strong> des plateformes comme Coursera for Teams ou des outils open-source permettent de créer des parcours adaptatifs. Le stagiaire progresse à son rythme, le formateur se consacre aux cas complexes.</li>
  <li><strong>Étape 3 — Utiliser l'IA pour l'évaluation formative :</strong> des outils comme Quizziz IA corrigent automatiquement les exercices et identifient les lacunes individuelles. Le formateur reçoit un tableau de bord des performances sans saisie manuelle.</li>
  <li><strong>Étape 4 — Former les stagiaires à l'IA comme compétence transversale :</strong> la compétence la plus recherchée en 2026 n'est pas de "programmer une IA" — c'est de savoir formuler de bons prompts et intégrer l'IA dans un flux de travail réel, quelle que soit la filière.</li>
</ul>

<img src="https://images.unsplash.com/photo-1677442136019-21780ecad995?fm=jpg&q=60&w=1400&auto=format&fit=crop" alt="Rendu 3D du texte AI symbolisant la transformation digitale et l'intégration de l'intelligence artificielle dans les systèmes de formation au Maroc" style="width:100%;border-radius:12px;margin:24px 0" loading="lazy" />

<h2>Les Obstacles Réels et Comment les Surmonter</h2>

<p>En 2025, <strong>68 % des enseignants marocains</strong> déclaraient ne pas disposer des compétences nécessaires pour intégrer l'IA dans leur enseignement (<a href="https://leseco.ma/maroc/maroc-la-majorite-des-enseignants-encore-peu-prepares-a-lia.html" target="_blank" rel="noopener">LesEco.ma</a>, 2025). Ce chiffre n'est pas une fatalité — c'est un point de départ pour définir les priorités de formation des formateurs. Pour accompagner vos équipes dans cette transition, notre <a href="/fr/blog/formation-ia-equipe-prompt-dirigeants">guide pratique de formation IA pour équipes</a> offre une feuille de route actionnable.</p>

<figure style="margin:32px 0;text-align:center">
<svg viewBox="0 0 560 240" xmlns="http://www.w3.org/2000/svg" style="max-width:100%;border-radius:12px" role="img" aria-label="Positionnement du Maroc dans les classements compétences numériques et IA 2025">
  <rect width="560" height="240" fill="#0f172a" rx="12"/>
  <text x="280" y="28" text-anchor="middle" font-family="system-ui,sans-serif" font-size="13" font-weight="700" fill="#f1f5f9">Positionnement du Maroc — Compétences Numériques et IA</text>
  <text x="280" y="46" text-anchor="middle" font-family="system-ui,sans-serif" font-size="10" fill="#94a3b8">Sources : QS Future Skills Index 2025 | Coursera Global Skills Report 2025</text>
  <text x="178" y="80" text-anchor="end" font-family="system-ui,sans-serif" font-size="10" fill="#94a3b8">QS Future Skills (score/100)</text>
  <rect x="188" y="68" width="300" height="20" rx="4" fill="#1e293b"/>
  <rect x="188" y="68" width="91.5" height="20" rx="4" fill="#ef4444"/>
  <text x="285" y="83" font-family="system-ui,sans-serif" font-size="10" font-weight="700" fill="#fff">30.5 / 100 — Rang 78e/81</text>
  <text x="178" y="116" text-anchor="end" font-family="system-ui,sans-serif" font-size="10" fill="#94a3b8">Compétences Numériques (Coursera)</text>
  <rect x="188" y="104" width="300" height="20" rx="4" fill="#1e293b"/>
  <rect x="188" y="104" width="194" height="20" rx="4" fill="#f59e0b"/>
  <text x="386" y="119" font-family="system-ui,sans-serif" font-size="10" font-weight="700" fill="#fff">71e / 109 pays</text>
  <text x="178" y="152" text-anchor="end" font-family="system-ui,sans-serif" font-size="10" fill="#94a3b8">Maturité IA (Coursera)</text>
  <rect x="188" y="140" width="300" height="20" rx="4" fill="#1e293b"/>
  <rect x="188" y="140" width="220" height="20" rx="4" fill="#f97316"/>
  <text x="412" y="155" font-family="system-ui,sans-serif" font-size="10" font-weight="700" fill="#fff">80e / 109 pays</text>
  <text x="178" y="188" text-anchor="end" font-family="system-ui,sans-serif" font-size="10" fill="#94a3b8">Enseignants sans comp. IA</text>
  <rect x="188" y="176" width="300" height="20" rx="4" fill="#1e293b"/>
  <rect x="188" y="176" width="204" height="20" rx="4" fill="#6366f1"/>
  <text x="396" y="191" font-family="system-ui,sans-serif" font-size="10" font-weight="700" fill="#fff">68 %</text>
  <text x="280" y="225" text-anchor="middle" font-family="system-ui,sans-serif" font-size="9" fill="#64748b">Benchmark mondial QS : 50/100 — Le Maroc reste en dessous de la moyenne mais devant plusieurs pairs africains</text>
</svg>
<figcaption style="font-size:12px;color:#64748b;margin-top:8px">Sources : QS World Future Skills Index 2025 ; Coursera Global Skills Report 2025 ; LesEco.ma 2025</figcaption>
</figure>

<p>Trois obstacles concrets et leurs réponses :</p>

<ul>
  <li><strong>L'infrastructure numérique :</strong> certains centres OFPPT en zones rurales disposent d'une connectivité limitée. La réponse passe par des outils IA hors ligne ou à faible bande passante, et par le déploiement prioritaire de la fibre via Digital Morocco 2030.</li>
  <li><strong>La résistance au changement :</strong> 68 % d'enseignants non préparés, ce ne sont pas 68 % de réfractaires — c'est 68 % de formateurs qui n'ont pas encore eu accès à une démonstration pratique. Une initiation de deux jours suffit pour lever les premières réticences et montrer les gains concrets.</li>
  <li><strong>La validation institutionnelle :</strong> l'IA dans une salle de formation doit s'inscrire dans un cadre pédagogique clair, validé par la direction. Ce cadre rassure les formateurs, protège les stagiaires et garantit la cohérence des pratiques. Découvrez comment structurer ce déploiement avec notre guide sur les <a href="/fr/blog/5-processus-automatiser-pme">5 processus à automatiser en priorité dans votre structure</a>.</li>
</ul>

<h2>Questions Fréquentes sur l'IA et la Formation Professionnelle au Maroc</h2>

<p><strong>L'OFPPT propose-t-il des formations spécifiques en intelligence artificielle ?</strong><br/>
Oui. Pour la rentrée 2025-2026, l'OFPPT a classé le secteur "Digital &amp; Intelligence Artificielle" parmi ses trois domaines prioritaires. La région Fès-Meknès seule offre 10 463 places dans ce secteur (24 % de l'offre régionale). 65 nouvelles filières ont été lancées en 2026 avec un budget de 6,3 milliards DH (<a href="https://medias24.com" target="_blank" rel="noopener">Medias24</a>, mai 2026).</p>

<p><strong>Faut-il être technicien pour utiliser l'IA en formation professionnelle ?</strong><br/>
Non. Les outils IA les plus utiles pour un formateur — générateurs de plans de cours, correcteurs automatiques, chatbots pédagogiques — ne nécessitent aucune compétence en programmation. Une initiation de quelques heures suffit. Le vrai prérequis est une connexion Internet et la volonté d'expérimenter.</p>

<p><strong>Quels métiers marocains sont les plus menacés par l'IA d'ici 2030 ?</strong><br/>
Selon le WEF Future of Jobs Report 2025, les emplois les plus exposés sont ceux à forte composante répétitive : saisie de données, traitement de dossiers, certaines opérations de comptabilité. À l'inverse, les métiers qui combinent compétences techniques ET relationnelles — soin, enseignement, maintenance complexe — restent difficiles à automatiser.</p>

<p><strong>Comment un centre OFPPT peut-il démarrer sans budget spécifique ?</strong><br/>
En commençant par les outils gratuits : ChatGPT, Google Classroom, Canva IA pour créer des supports pédagogiques visuels. L'investissement initial est nul ; le gain pédagogique est immédiat. L'étape suivante est de former un formateur référent IA par établissement.</p>

<p><strong>Le Maroc peut-il rattraper son retard en compétences IA avant 2030 ?</strong><br/>
C'est réalisable. La stratégie Digital Morocco 2030 vise à former 100 000 jeunes par an aux métiers du numérique. L'OFPPT, avec 746 500 stagiaires, est l'opérateur le plus à même d'accélérer cette transition à grande échelle si l'IA est intégrée comme outil pédagogique transversal.</p>

<h2>Conclusion : L'IA comme Levier, Pas comme Menace</h2>

<p>Le débat sur l'IA dans la formation professionnelle marocaine ne devrait pas être "faut-il y aller ?" mais "comment y aller vite et bien ?". Les données sont sans ambiguïté : le marché du travail de 2030 sera profondément différent, et les jeunes formés aujourd'hui sont ceux qui y entreront demain. L'OFPPT a enclenché la transformation — 65 nouvelles filières, 6,3 milliards DH, le Digital &amp; IA en tête des secteurs prioritaires.</p>

<p>Pour les formateurs : commencez petit — un outil, une séance, mesurez le gain. Pour les décideurs : investissez dans la formation des formateurs avant d'investir dans la technologie. La formation professionnelle marocaine a toutes les ressources humaines nécessaires. L'intelligence artificielle lui donne les outils pour les transformer en avantage compétitif durable. Vous souhaitez mettre en place une stratégie IA pour votre organisation ? <a href="/fr/contact">Contactez l'équipe EasyDigia</a> pour un audit gratuit sous 24h.</p>

<h2>Sources</h2>
<ul>
  <li><a href="https://www.ofppt.ma/fr/communiques-de-presse/rentree-de-formation-2025-2026-une-dynamique-renouvelee-au-service-du" target="_blank" rel="noopener">OFPPT — Rentrée 2025-2026 : 746 500 stagiaires (communiqué officiel)</a>, septembre 2025</li>
  <li><a href="https://medias24.com/2026/05/15/ofppt-65-nouvelles-filieres-3-nouvelles-cites-des-metiers-et-63-milliards-de-dh-pour-le-plan-daction-2026-1678565" target="_blank" rel="noopener">Medias24 — OFPPT : 65 nouvelles filières et 6,3 milliards DH</a>, mai 2026</li>
  <li><a href="https://medias24.com/2024/09/25/maroc-digital-2030-11-mmdh-alloues-entre-2024-et-2026-creation-de-100-000-emplois-par-an-a-lhorizon-2030/" target="_blank" rel="noopener">Medias24 — Digital Morocco 2030 : 11 MMDH, 100 000 formations/an</a>, septembre 2024</li>
  <li><a href="https://www.weforum.org/press/2025/01/future-of-jobs-report-2025-78-million-new-job-opportunities-by-2030-but-urgent-upskilling-needed-to-prepare-workforces/" target="_blank" rel="noopener">WEF — Future of Jobs Report 2025</a>, janvier 2025</li>
  <li><a href="https://www.moroccoworldnews.com/2025/01/165530/morocco-struggles-in-global-skills-index-but-stays-ahead-of-regional-peers/" target="_blank" rel="noopener">Morocco World News — QS Future Skills Index 2025 : Maroc 78e/81</a>, janvier 2025</li>
  <li><a href="https://maroc-diplomatique.net/rapport-coursera-2025-le-maroc-a-la-traine-en-competences-numeriques-et-en-intelligence-artificielle/" target="_blank" rel="noopener">Coursera Global Skills Report 2025 — Maroc 71e en compétences numériques</a>, 2025</li>
  <li><a href="https://www.grandviewresearch.com/horizon/outlook/ai-in-education-market/mea" target="_blank" rel="noopener">Grand View Research — AI in Education Market, MEA Segment</a>, 2025</li>
  <li><a href="https://leseco.ma/maroc/maroc-la-majorite-des-enseignants-encore-peu-prepares-a-lia.html" target="_blank" rel="noopener">LesEco.ma — 68 % des enseignants marocains non préparés à l'IA</a>, 2025</li>
  <li><a href="https://www.jobsquare.ma/blog/intelligence-artificielle-emploi-maroc-2026/" target="_blank" rel="noopener">JobSquare.ma — IA et emploi au Maroc 2026</a>, juin 2026</li>
</ul>
`;

/* ─────────────────────────── BODY EN ─────────────────────────── */
const bodyEn = `
<blockquote style="border-left:4px solid #8FD400;padding:16px 20px;margin:24px 0;background:rgba(143,212,0,0.06);border-radius:0 8px 8px 0">
  <strong style="color:#C6FF00;display:block;margin-bottom:8px">Key Takeaways</strong>
  <ul style="margin:0;padding-left:20px">
    <li>In 2025-2026, OFPPT trains <strong>746,500 trainees</strong> across 510 centres — a record — yet Morocco ranks <strong>78th out of 81</strong> in future skills (QS Future Skills Index, 2025).</li>
    <li>The WEF forecasts <strong>170 million new jobs</strong> by 2030, most requiring AI and digital skills (WEF Future of Jobs, 2025).</li>
    <li>The MEA AI-in-education market will reach <strong>USD 1.64 billion by 2030</strong>, growing at 32.6% CAGR (Grand View Research, 2025).</li>
    <li>OFPPT launched <strong>65 new training programmes</strong> and committed <strong>MAD 6.3 billion</strong> in its 2026 action plan to accelerate digital transformation.</li>
  </ul>
</blockquote>

<h2>Why Morocco Cannot Afford to Wait on AI in Training</h2>

<p>In January 2025, the World Economic Forum published its <em>Future of Jobs 2025</em> report: by 2030, automation and AI will create <strong>170 million new roles</strong> and eliminate 92 million, for a net gain of <strong>78 million jobs</strong> (<a href="https://www.weforum.org/press/2025/01/future-of-jobs-report-2025-78-million-new-job-opportunities-by-2030-but-urgent-upskilling-needed-to-prepare-workforces/" target="_blank" rel="noopener">WEF, 2025</a>). For Morocco, what matters is the nature of these jobs: almost all require digital and AI skills.</p>

<p><strong>63% of employers</strong> across 55 economies cite the skills gap as their top barrier to growth, and <strong>85%</strong> plan to prioritise upskilling by 2030. Vocational training is the first line of response. OFPPT trains hundreds of thousands of young Moroccans who enter the job market directly upon graduating. Without AI skills, they will compete at a disadvantage against profiles trained in Tunisia, Egypt or Europe.</p>

<h2>What AI in Vocational Training Actually Means</h2>

<p>In 2025, the <em>Coursera Global Skills Report 2025</em> ranked Morocco <strong>71st in digital skills</strong> and <strong>80th in AI maturity</strong> out of 109 countries. The gap is real — but closable. Countries at comparable levels have climbed multiple positions in two to three years through structured programmes.</p>

<p>There are four main application areas of AI in a vocational training centre:</p>
<ul>
  <li><strong>Personalised AI tutors:</strong> each trainee progresses at their own pace — personalisation impossible in a class of 30 with one trainer.</li>
  <li><strong>Automated assessment:</strong> auto-grading of MCQs, written assignments and even filmed technical work, freeing trainers from repetitive tasks.</li>
  <li><strong>Simulation and virtual environments:</strong> trainees in industrial maintenance or construction practise real scenarios without risk.</li>
  <li><strong>Pedagogical preparation tools:</strong> a trainer can use ChatGPT or Claude to generate a lesson plan, differentiated exercises or a bilingual French/Arabic summary in five minutes.</li>
</ul>

<h2>What OFPPT Has Already Done: 2026 Programmes and Investment</h2>

<p>In May 2026, OFPPT announced <strong>65 new training programmes</strong>, 3 new Skills Cities, and a budget of <strong>MAD 6.3 billion</strong> for its 2026 action plan (<a href="https://medias24.com" target="_blank" rel="noopener">Medias24</a>, May 2026). The "Digital &amp; Artificial Intelligence" sector is one of three priority areas for the 2025-2026 intake. In the Fès-Meknès region alone, this sector accounts for <strong>10,463 training places — 24% of the regional offering</strong>.</p>

<p>The <strong>Digital Morocco 2030</strong> strategy reinforces this with MAD 11 billion allocated for 2024-2026, targeting <strong>240,000 digital jobs by 2030</strong> and training <strong>100,000 young people per year</strong> in digital skills (<a href="https://medias24.com/2024/09/25/maroc-digital-2030-11-mmdh-alloues-entre-2024-et-2026-creation-de-100-000-emplois-par-an-a-lhorizon-2030/" target="_blank" rel="noopener">Medias24</a>, September 2024).</p>

<h2>Practical AI Integration in an OFPPT Training Room</h2>

<p>A trainer can start tomorrow morning, with no additional budget and no advanced technical skills. In 2026, <strong>more than one in two Moroccan employees</strong> already use AI tools on their own initiative at work, without any institutional training (<a href="https://www.jobsquare.ma/blog/intelligence-artificielle-emploi-maroc-2026/" target="_blank" rel="noopener">JobSquare.ma</a>, June 2026). This "Shadow AI" phenomenon also affects training centres — all the more reason to structure integration.</p>
<ul>
  <li><strong>Step 1 — Start with preparation tools:</strong> ChatGPT, Claude or Gemini can generate a structured lesson plan, practical exercises or bilingual summaries in minutes.</li>
  <li><strong>Step 2 — Integrate personalisation:</strong> adaptive learning platforms let trainees progress at their own pace while the trainer focuses on complex cases.</li>
  <li><strong>Step 3 — Use AI for formative assessment:</strong> tools like Quizziz AI automatically grade exercises and identify individual gaps.</li>
  <li><strong>Step 4 — Train trainees to use AI as a transversal skill:</strong> the most sought-after skill in 2026 is crafting effective prompts and integrating AI into real work flows, whatever the programme.</li>
</ul>

<h2>Real Obstacles and How to Overcome Them</h2>

<p>In 2025, <strong>68% of Moroccan teachers</strong> said they lacked the skills to integrate AI into their teaching (<a href="https://leseco.ma/maroc/maroc-la-majorite-des-enseignants-encore-peu-prepares-a-lia.html" target="_blank" rel="noopener">LesEco.ma</a>, 2025). That figure is not a ceiling — it is a starting point. Three obstacles and their responses:</p>
<ul>
  <li><strong>Digital infrastructure:</strong> some OFPPT centres in rural areas have limited connectivity. Low-bandwidth or offline AI tools, combined with Digital Morocco 2030 fibre rollout, are the answer.</li>
  <li><strong>Resistance to change:</strong> 68% unprepared is not 68% opposed. A two-day practical initiation is enough to remove initial reluctance and demonstrate concrete gains.</li>
  <li><strong>Institutional validation:</strong> AI in a training room must fit within a clear pedagogical framework, validated by management. This framework reassures trainers, protects trainees and ensures consistent practices.</li>
</ul>

<h2>FAQ</h2>
<p><strong>Does OFPPT offer specific AI training programmes?</strong><br/>Yes. For 2025-2026, "Digital &amp; Artificial Intelligence" is one of three priority sectors. The Fès-Meknès region alone offers 10,463 places in this sector. 65 new programmes were launched in 2026 with a MAD 6.3 billion budget.</p>
<p><strong>Do trainers need technical skills to use AI?</strong><br/>No. The most useful AI tools for trainers require no coding skills — a few hours of initiation is enough. The only prerequisites are an internet connection and a willingness to experiment.</p>
<p><strong>Can Morocco close its AI skills gap by 2030?</strong><br/>Yes, if current efforts accelerate. Digital Morocco 2030 targets 100,000 young people trained in digital skills per year. OFPPT, with 746,500 trainees, is the most scalable operator for this transition.</p>

<h2>Conclusion: AI as a Lever, Not a Threat</h2>

<p>The debate on AI in Moroccan vocational training should not be "should we embrace it?" but "how do we move fast and smart?". The data is unambiguous: the 2030 job market will be profoundly different, and the young people being trained today will be the ones entering it. OFPPT has started the transformation. The next step is bringing AI into every training room — not just specialist programmes.</p>

<p>For trainers: start small — one tool, one session, measure the gain. For decision-makers: invest in trainer upskilling before investing in technology. Want to build an AI strategy for your organisation? <a href="/en/contact">Contact the EasyDigia team</a> for a free 24-hour audit.</p>
`;

/* ─────────────────────────── BODY AR ─────────────────────────── */
const bodyAr = `
<blockquote style="border-left:4px solid #8FD400;padding:16px 20px;margin:24px 0;background:rgba(143,212,0,0.06);border-radius:0 8px 8px 0;direction:rtl;text-align:right">
  <strong style="color:#C6FF00;display:block;margin-bottom:8px">النقاط الرئيسية</strong>
  <ul style="margin:0;padding-right:20px;padding-left:0">
    <li>في 2025-2026، يُدرّب OFPPT <strong>746 500 متدرب</strong> في 510 مؤسسة — رقم قياسي — لكن المغرب يحتل المرتبة <strong>78 من 81</strong> في مؤشر مهارات المستقبل (QS، 2025).</li>
    <li>يتوقع WEF خلق <strong>170 مليون وظيفة جديدة</strong> بحلول 2030، معظمها يتطلب مهارات الذكاء الاصطناعي والرقمنة (WEF، 2025).</li>
    <li>سيبلغ سوق الذكاء الاصطناعي في التعليم بمنطقة الشرق الأوسط وأفريقيا <strong>1.64 مليار دولار بحلول 2030</strong> بمعدل نمو 32.6 % سنوياً (Grand View Research، 2025).</li>
    <li>أطلق OFPPT <strong>65 تخصصاً جديداً</strong> واستثمر <strong>6.3 مليار درهم</strong> في خطة عمل 2026 لتسريع التحول الرقمي.</li>
  </ul>
</blockquote>

<h2>لماذا لا يمكن للمغرب الانتظار في مجال الذكاء الاصطناعي والتكوين؟</h2>

<p>في يناير 2025، نشر المنتدى الاقتصادي العالمي تقرير <em>وظائف المستقبل 2025</em> : بحلول 2030، ستخلق الأتمتة والذكاء الاصطناعي <strong>170 مليون دور جديد</strong> وستُلغي 92 مليوناً، بصافي ربح قدره <strong>78 مليون وظيفة</strong> (<a href="https://www.weforum.org/press/2025/01/future-of-jobs-report-2025-78-million-new-job-opportunities-by-2030-but-urgent-upskilling-needed-to-prepare-workforces/" target="_blank" rel="noopener">WEF، 2025</a>). ما يهم المغرب هو طبيعة هذه الوظائف: تستلزم جميعها تقريباً إتقان أدوات الرقمنة والذكاء الاصطناعي.</p>

<p>يستقبل OFPPT سنوياً مئات الآلاف من الشباب المغربي الذي يدخل سوق الشغل مباشرة بعد التكوين. إذا تخرجوا دون إتقان أدوات الذكاء الاصطناعي، ستجدهم في وضع تنافسي سلبي أمام الكفاءات المكوَّنة في تونس أو مصر أو أوروبا. تكلفة التقاعس تُقاس بنقاط القدرة التنافسية الوطنية.</p>

<h2>الذكاء الاصطناعي في التكوين المهني : ما الذي يُقصد به فعلياً؟</h2>

<p>في 2025، صنّف <em>تقرير Coursera العالمي للمهارات 2025</em> المغرب في المرتبة <strong>71 عالمياً في الكفاءات الرقمية</strong> و<strong>80 في نضج الذكاء الاصطناعي</strong> من أصل 109 دول. هذا التأخر حقيقي، لكنه قابل للتعويض.</p>

<p>أربع فئات رئيسية لتطبيقات الذكاء الاصطناعي في مركز تكوين مهني:</p>
<ul style="direction:rtl;text-align:right;padding-right:20px;padding-left:0">
  <li><strong>المدرّسون الذكيون الشخصيون:</strong> كل متدرب يتقدم بوتيرته الخاصة — تخصيص مستحيل في فصل من 30 شخصاً مع مكوِّن واحد.</li>
  <li><strong>التقييم التلقائي:</strong> تصحيح تلقائي للاختبارات والأسئلة الكتابية، يحرر المكوِّن من المهام التكرارية.</li>
  <li><strong>المحاكاة والبيئات الافتراضية:</strong> في الصيانة الصناعية والبناء، يتدرب المتدربون على سيناريوهات حقيقية بدون مخاطر.</li>
  <li><strong>أدوات التحضير البيداغوجي:</strong> مكوِّن OFPPT يمكنه استخدام ChatGPT أو Claude لإنتاج خطة درس في خمس دقائق.</li>
</ul>

<h2>ما الذي حقّقه OFPPT بالفعل: البرامج والاستثمارات 2026</h2>

<p>في مايو 2026، قدّم OFPPT خطة طموحة: <strong>65 تخصصاً جديداً</strong> و3 مدن جديدة للمهن والكفاءات، وميزانية <strong>6.3 مليار درهم</strong> لخطة العمل 2026. يحتل قطاع "الرقمنة والذكاء الاصطناعي" مرتبة من بين أولويات الموسم الدراسي 2025-2026 الثلاث. في إقليم فاس-مكناس وحده، يمثّل هذا القطاع <strong>10 463 مقعداً للتكوين — 24 % من العرض الإقليمي</strong>.</p>

<p>تُعزز استراتيجية <strong>المغرب الرقمي 2030</strong> هذا التوجه بـ 11 مليار درهم مخصصة لـ 2024-2026، بهدف خلق <strong>240 000 وظيفة رقمية بحلول 2030</strong> وتكوين <strong>100 000 شاب سنوياً</strong> في المهن الرقمية.</p>

<h2>كيف تُدمج الذكاء الاصطناعي فعلياً في قاعة التكوين بـ OFPPT؟</h2>

<p>يمكن لأي مكوِّن البدء غداً صباحاً، بدون ميزانية إضافية أو خبرة تقنية متقدمة. في 2026، <strong>أكثر من موظف مغربي من كل اثنين</strong> يستخدم أدوات الذكاء الاصطناعي من تلقاء نفسه في العمل دون تكوين مؤسسي (<a href="https://www.jobsquare.ma/blog/intelligence-artificielle-emploi-maroc-2026/" target="_blank" rel="noopener">JobSquare.ma</a>، يونيو 2026). هذه الظاهرة تمسّ مراكز التكوين أيضاً.</p>

<ul style="direction:rtl;text-align:right;padding-right:20px;padding-left:0">
  <li><strong>الخطوة 1 — ابدأ بأدوات التحضير:</strong> ChatGPT أو Claude أو Gemini يمكنها توليد خطة درس وتمارين عملية وملخصات ثنائية اللغة في دقائق معدودة.</li>
  <li><strong>الخطوة 2 — أدمج التخصيص:</strong> منصات التعلم التكيفي تتيح لكل متدرب التقدم بوتيرته الخاصة.</li>
  <li><strong>الخطوة 3 — استخدم الذكاء الاصطناعي للتقييم التكويني:</strong> أدوات مثل Quizziz IA تصحح التمارين تلقائياً وتحدد الثغرات الفردية.</li>
  <li><strong>الخطوة 4 — درّب المتدربين على الذكاء الاصطناعي كمهارة تكاملية:</strong> الكفاءة الأكثر طلباً في 2026 ليست برمجة ذكاء اصطناعي، بل صياغة طلبات فعّالة (prompts) ودمج الذكاء الاصطناعي في سير العمل الفعلي.</li>
</ul>

<h2>العوائق الحقيقية وكيفية تجاوزها</h2>

<p>في 2025، أعلن <strong>68 % من المدرسين المغاربة</strong> عن افتقارهم للكفاءات اللازمة لدمج الذكاء الاصطناعي في تدريسهم (LesEco.ma، 2025). ثلاثة عوائق وحلولها:</p>

<ul style="direction:rtl;text-align:right;padding-right:20px;padding-left:0">
  <li><strong>البنية التحتية الرقمية:</strong> بعض مراكز OFPPT في المناطق القروية تعاني من ضعف الاتصال. الحل في أدوات الذكاء الاصطناعي منخفضة النطاق الترددي أو دون اتصال، إلى جانب نشر الألياف البصرية عبر المغرب الرقمي 2030.</li>
  <li><strong>مقاومة التغيير:</strong> 68 % غير مستعدين لا يعني 68 % رافضين — فهم مكوِّنون لم يتعرضوا بعد لعرض توضيحي عملي. تكوين يوم واحد يكفي لرفع الحواجز الأولى.</li>
  <li><strong>التحقق المؤسسي:</strong> الذكاء الاصطناعي في قاعة التكوين يجب أن يندرج ضمن إطار بيداغوجي واضح يطمئن المكوِّنين ويحمي المتدربين.</li>
</ul>

<h2>أسئلة شائعة</h2>

<p><strong>هل يقدم OFPPT تكويناً متخصصاً في الذكاء الاصطناعي؟</strong><br/>
نعم. في موسم 2025-2026، صنّف OFPPT قطاع "الرقمنة والذكاء الاصطناعي" ضمن أولوياته الثلاث. إقليم فاس-مكناس وحده يوفر 10 463 مقعداً في هذا القطاع. أُطلق 65 تخصصاً جديداً في 2026 بميزانية 6.3 مليار درهم.</p>

<p><strong>هل يحتاج المكوِّن إلى مهارات تقنية لاستخدام الذكاء الاصطناعي؟</strong><br/>
لا. أكثر الأدوات فائدة للمكوِّن لا تتطلب أي برمجة. بضع ساعات من التعريف تكفي للبدء. المتطلب الوحيد هو اتصال بالإنترنت والاستعداد للتجربة.</p>

<p><strong>هل يمكن للمغرب تعويض تأخره في الكفاءات الرقمية قبل 2030؟</strong><br/>
نعم. استراتيجية المغرب الرقمي 2030 تستهدف تكوين 100 000 شاب سنوياً في المهن الرقمية. OFPPT، بـ 746 500 متدرب، هو الجهة الأكثر قدرة على تسريع هذا التحول على نطاق واسع.</p>

<h2>خلاصة: الذكاء الاصطناعي رافعة لا تهديد</h2>

<p>المناقشة حول الذكاء الاصطناعي في التكوين المهني المغربي لا ينبغي أن تكون "هل نتبناه؟" بل "كيف نتبناه سريعاً وبجودة؟". البيانات لا تقبل الجدل: سوق الشغل 2030 سيكون مختلفاً جذرياً، والشباب المتكوَّن اليوم هو من سيدخله غداً. OFPPT انطلق في التحول — 65 تخصصاً جديداً، 6.3 مليار درهم، الرقمنة والذكاء الاصطناعي في صدارة الأولويات.</p>

<p>للمكوِّنين: ابدؤوا بخطوة صغيرة — أداة واحدة، حصة واحدة، قيسوا النتيجة. لصانعي القرار: استثمروا في تكوين المكوِّنين قبل الاستثمار في التكنولوجيا. هل تودّون بناء استراتيجية ذكاء اصطناعي لمؤسستكم؟ <a href="/ar/contact">تواصلوا مع فريق EasyDigia</a> للحصول على تشخيص مجاني خلال 24 ساعة.</p>
`;

/* ─────────────────────────── RECORD ─────────────────────────── */
const record = {
  slug: "ia-formation-professionnelle-ofppt-maroc",
  category: "strategy",
  read_min: 11,
  published: true,
  published_at: new Date().toISOString(),
  image_url:
    "https://plus.unsplash.com/premium_photo-1683121710572-7723bd2e235d?fm=jpg&q=60&w=1400&auto=format&fit=crop&ixlib=rb-4.1.0",
  content: {
    fr: {
      title:
        "Comment l'Intelligence Artificielle Transforme la Formation Professionnelle au Maroc : Le Cas OFPPT",
      tag: "Stratégie digitale",
      excerpt:
        "746 500 stagiaires OFPPT mais Maroc 78e/81 en compétences futures : découvrez comment l'IA comble ce paradoxe et prépare les jeunes aux métiers de 2030.",
      body: bodyFr,
    },
    en: {
      title:
        "How AI Is Transforming Vocational Training in Morocco: The OFPPT Case",
      tag: "Digital strategy",
      excerpt:
        "746,500 OFPPT trainees yet Morocco ranks 78th/81 in future skills: find out how AI bridges this gap and prepares young people for the jobs of 2030.",
      body: bodyEn,
    },
    ar: {
      title:
        "كيف يحوّل الذكاء الاصطناعي التكوين المهني في المغرب : حالة OFPPT",
      tag: "الاستراتيجية الرقمية",
      excerpt:
        "746 500 متدرب في OFPPT والمغرب في المرتبة 78 من 81 في مهارات المستقبل: اكتشف كيف يسدّ الذكاء الاصطناعي هذه الهوة ويُعدّ الشباب لوظائف 2030.",
      body: bodyAr,
    },
  },
};

/* ─────────────────────────── LOG SIZES ─────────────────────────── */
for (const lang of ["fr", "en", "ar"]) {
  const text = record.content[lang].body.replace(/<[^>]+>/g, " ");
  const words = text.split(/\s+/).filter(Boolean).length;
  console.log(`📝 ${lang.toUpperCase()}: ~${words} mots/words`);
}

/* ─────────────────────────── INSERT ─────────────────────────── */
const { data, error } = await supabase
  .from("blog_articles")
  .insert(record)
  .select("id, slug, published")
  .single();

if (error) {
  console.error("❌ Insert failed:", error.message);
  process.exit(1);
}

console.log(`\n✅ Article publié — id: ${data.id}, slug: ${data.slug}, published: ${data.published}`);
console.log(`🔗 https://www.easydigia.com/fr/blog/${data.slug}`);
