"use client";

import { useEffect, useState } from "react";

const ENTRIES = [
  { name: "Fatima Z.",    action: "a contacté EasyDigia",              city: "Casablanca",   ago: "il y a 10 min" },
  { name: "Karim M.",     action: "vient de demander un devis",        city: "Agadir",       ago: "il y a 15 min" },
  { name: "Nadia E.",     action: "a réservé une consultation",        city: "Casablanca",   ago: "il y a 20 min" },
  { name: "Youssef A.",   action: "vient de demander un audit IA",     city: "Rabat",        ago: "il y a 25 min" },
  { name: "Sara L.",      action: "a demandé une démo chatbot",        city: "Tanger",       ago: "il y a 30 min" },
  { name: "Chaimaa R.",   action: "vient de demander un audit IA",     city: "Marrakech",    ago: "il y a 35 min" },
  { name: "Salma F.",     action: "vient de demander un audit IA",     city: "Casablanca",   ago: "il y a 40 min" },
  { name: "Zineb R.",     action: "a demandé une démo automatisation", city: "Rabat",        ago: "il y a 45 min" },
  { name: "Meryem A.",    action: "a demandé une démo automatisation", city: "Kénitra",      ago: "il y a 50 min" },
  { name: "Rachid B.",    action: "vient de demander un audit",        city: "Marrakech",    ago: "il y a 60 min" },
  { name: "Imane W.",     action: "a contacté EasyDigia",              city: "Marrakech",    ago: "il y a 10 min" },
  { name: "Amine T.",     action: "a démarré un projet IA",            city: "Marrakech",    ago: "il y a 25 min" },
  { name: "Dounia M.",    action: "a réservé une consultation",        city: "Casablanca",   ago: "il y a 15 min" },
  { name: "Omar H.",      action: "vient de demander un audit",        city: "Fès",          ago: "il y a 35 min" },
  { name: "Hasnaa K.",    action: "a contacté EasyDigia",              city: "Meknès",       ago: "il y a 20 min" },
  { name: "Tariq B.",     action: "a réservé une consultation",        city: "Oujda",        ago: "il y a 50 min" },
  { name: "Mehdi O.",     action: "vient de demander un devis",        city: "Tanger",       ago: "il y a 30 min" },
  { name: "Loubna S.",    action: "a demandé une démo chatbot",        city: "Agadir",       ago: "il y a 45 min" },
  { name: "Hamza D.",     action: "a démarré un projet automation",    city: "Rabat",        ago: "il y a 60 min" },
  { name: "Khalid N.",    action: "vient de demander un audit",        city: "El Jadida",    ago: "il y a 25 min" },
  { name: "Soufiane G.",  action: "a demandé une démo chatbot",        city: "Fès",          ago: "il y a 40 min" },
  { name: "Iliass C.",    action: "vient de demander un devis",        city: "Tétouan",      ago: "il y a 15 min" },
];

export function FomoNotification() {
  // Démarrer aléatoirement pour ne pas toujours commencer par la même personne
  const [index, setIndex] = useState(() => Math.floor(Math.random() * ENTRIES.length));
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    // First show after 8s
    const initial = setTimeout(() => setVisible(true), 8000);
    return () => clearTimeout(initial);
  }, []);

  useEffect(() => {
    if (!visible) return;
    // Hide after 5s, then show next after 30s
    const hide = setTimeout(() => setVisible(false), 5000);
    const next = setTimeout(() => {
      setIndex((i) => (i + 1) % ENTRIES.length);
      setVisible(true);
    }, 35000);
    return () => { clearTimeout(hide); clearTimeout(next); };
  }, [visible, index]);

  const entry = ENTRIES[index];
  if (!visible) return null;

  return (
    <div className="fixed bottom-20 left-4 z-[80] max-w-[280px] animate-[slideIn_0.4s_ease-out] overflow-hidden rounded-[14px] border border-white/[0.09] bg-[#12141C] shadow-[0_8px_32px_rgba(0,0,0,0.5)]">
      <div className="h-[2px] w-full bg-gradient-to-r from-[#8FD400] to-[#C6FF00]" />
      <div className="flex items-start gap-3 p-4">
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#8FD400]/15 text-[14px] font-bold text-[#8FD400]">
          {entry.name[0]}
        </div>
        <div>
          <p className="text-[13px] leading-[1.4] text-[#F5F6FA]">
            <span className="font-semibold">{entry.name}</span> {entry.action}
          </p>
          <p className="mt-0.5 text-[11px] text-[#9BA1B0]">
            {entry.city} · {entry.ago}
          </p>
        </div>
      </div>
    </div>
  );
}
