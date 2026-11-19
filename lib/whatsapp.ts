// WhatsApp click-to-chat (wa.me) for manual outreach from the admin: no API, the admin presses "Envoyer".

/** Moroccan mobile (06/07, +212 6/7) → "2126XXXXXXXX"; null for landlines (05) or unknown formats. */
export function waNumber(phone?: string | null): string | null {
  let d = (phone ?? "").replace(/\D/g, "");
  if (d.startsWith("00")) d = d.slice(2);
  if (d.length === 10 && d.startsWith("0")) d = "212" + d.slice(1);
  return /^212[67]\d{8}$/.test(d) ? d : null;
}

const PITCH: Record<string, string> = {
  immobil:
    "On met en place pour les agences immobilières un assistant WhatsApp qui répond aux demandes 24h/24 (français, arabe, anglais), qualifie les acheteurs et locataires (budget, quartier) et planifie les visites dans votre agenda.",
};
const DEFAULT_PITCH =
  "On aide les entreprises marocaines à gagner du temps avec un assistant WhatsApp et des agents IA qui répondent aux clients 24h/24 et automatisent les tâches répétitives.";

export function waMessage(lead: { company?: string | null; name?: string | null; sector?: string | null }): string {
  const who = lead.company || lead.name || "votre entreprise";
  const sector = (lead.sector ?? "").toLowerCase();
  const pitch = Object.entries(PITCH).find(([k]) => sector.includes(k))?.[1] ?? DEFAULT_PITCH;
  return `Bonjour, ici Easydigia 👋\n\nJe vous contacte au sujet de ${who}. ${pitch}\n\nJe peux vous montrer une démo de 15 minutes ?\n\nwww.easydigia.com\n(Répondez STOP si cela ne vous intéresse pas.)`;
}

export function waLink(lead: { phone?: string | null; company?: string | null; name?: string | null; sector?: string | null }): string | null {
  const n = waNumber(lead.phone);
  return n ? `https://wa.me/${n}?text=${encodeURIComponent(waMessage(lead))}` : null;
}
