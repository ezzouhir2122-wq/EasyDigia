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

/**
 * File de sujets pilotée par la stratégie (≈8 semaines × 2/sem).
 * Ciblée intention commerciale / génération de clients, organisée par cluster.
 * Le cron la consomme en priorité (rotation via theme_index) et retombe sur
 * BLOG_THEMES une fois épuisée.
 */
export const BLOG_TOPIC_QUEUE: string[] = [
  // Cluster : Agents IA / Chatbot (intention commerciale)
  "Comment un agent IA qualifie vos leads WhatsApp automatiquement (guide PME Maroc)",
  "Chatbot IA pour restaurant : prendre des réservations 24h/24 sans standardiste",
  "Agent IA vs chatbot classique : lequel choisir pour une PME marocaine",
  "Chatbot IA pour agence immobilière : qualifier et relancer les prospects",
  // Cluster : Automatisation (intention mi-commerciale)
  "Automatiser la facturation et les relances clients d'une PME : méthode pas à pas",
  "5 processus à automatiser en premier dans une PME (avec exemples concrets)",
  "Automatiser le service client WhatsApp : combien de temps gagné réellement",
  "Make, n8n ou Zapier : lequel choisir pour automatiser son entreprise au Maroc",
  // Cluster : CRM / Données (mi-funnel)
  "CRM intelligent pour PME : scorer et relancer les leads sans effort",
  "Tableau de bord automatisé : piloter sa PME avec ses données en temps réel",
  // Cluster : Sectoriel (intention client, local)
  "IA pour cliniques et cabinets médicaux : réduire les rendez-vous manqués",
  "Automatisation e-commerce : récupérer les paniers abandonnés avec l'IA",
  "IA pour la logistique au Maroc : suivi des livraisons et notifications clients",
  "Automatiser le tri des candidatures RH : gagner du temps au recrutement",
  // Cluster : Décision / ROI (bottom-funnel)
  "Combien coûte l'automatisation d'une PME au Maroc (et quel ROI attendre)",
  "Transformation digitale d'une PME marocaine : par où commencer concrètement",
];

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
