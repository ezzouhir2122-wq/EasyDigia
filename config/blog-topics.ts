export const BLOG_THEMES = [
  "Automatisation des processus pour PME marocaines",
  "Agents IA et chatbots pour entreprises",
  "Intégration API et connecteurs métier",
  "Intelligence artificielle pour dirigeants",
  "Transformation digitale au Maroc",
  "Outils no-code et automatisation (Make, n8n, Zapier)",
  "IA pour le service client et WhatsApp",
  "Tableaux de bord et pilotage par la data",
  "Formation et adoption de l'IA en entreprise",
  "ROI et mesure de l'automatisation",
] as const;

export type BlogTheme = (typeof BLOG_THEMES)[number];

export function topicGenerationPrompt(theme: string): string {
  return `Tu es un expert SEO francophone spécialisé en IA et automatisation pour PME.
Génère UN sujet d'article de blog précis, optimisé pour les moteurs de recherche et les IA (GEO/SEO),
basé sur ce thème : "${theme}"

Règles :
- Sujet sous forme de question ou titre actionnable (ex: "Comment automatiser ses relances clients avec Make")
- Inclure "Maroc" ou "PME" si pertinent naturellement
- Longue traîne : 6 à 12 mots
- Inédit, différent des angles évidents
- En français uniquement

Réponds UNIQUEMENT avec le sujet, sans guillemets, sans explication.`;
}
