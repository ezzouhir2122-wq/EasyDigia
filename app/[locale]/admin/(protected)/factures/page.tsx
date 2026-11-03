"use client";

import { useEffect, useMemo, useState } from "react";
import { useParams } from "next/navigation";
import { AdminNav } from "@/components/admin/AdminNav";

type Lead = {
  id: string;
  name: string;
  email: string;
  company?: string;
  locale: string;
  status?: string;
  created_at: string;
  quote_sent_at?: string | null;
  quote_requested?: boolean;
};

function devisNumber(lead: Lead) {
  const year = lead.quote_sent_at
    ? new Date(lead.quote_sent_at).getFullYear()
    : new Date().getFullYear();
  return `DEVIS-${year}-${lead.id.slice(0, 6).toUpperCase()}`;
}

function exportCSV(rows: Lead[]) {
  const cols = ["N° Devis", "Client", "Email", "Société", "Date d'envoi"];
  const data = rows.map((l) => [
    devisNumber(l),
    l.name,
    l.email,
    l.company ?? "",
    l.quote_sent_at ? new Date(l.quote_sent_at).toLocaleDateString("fr-FR") : "",
  ]);
  const csv = [cols, ...data].map((r) => r.join(";")).join("\n");
  const blob = new Blob(["﻿" + csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `factures-easydigia-${new Date().toISOString().slice(0, 10)}.csv`;
  a.click();
  URL.revokeObjectURL(url);
}

export default function AdminFactures() {
  const params = useParams();
  const locale = (params?.locale as string) ?? "fr";
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      setLoading(true);
      try {
        const res = await fetch("/api/admin/leads");
        const json = await res.json();
        if (json.ok) setLeads(json.leads ?? []);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const sent = useMemo(
    () =>
      leads
        .filter((l) => !!l.quote_sent_at)
        .sort((a, b) => +new Date(b.quote_sent_at!) - +new Date(a.quote_sent_at!)),
    [leads]
  );
  const pending = useMemo(
    () => leads.filter((l) => l.quote_requested && !l.quote_sent_at),
    [leads]
  );

  return (
    <div className="min-h-screen bg-[#0A0B10] text-[#F5F6FA]">
      <AdminNav locale={locale} active="factures" />

      <main className="mx-auto max-w-[1100px] px-6 py-8">
        <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
          <div>
            <div className="mb-2 font-mono text-[11px] uppercase tracking-[0.1em] text-[#8FD400]">
              EasyDigia — Admin
            </div>
            <h1 className="text-[28px] font-bold tracking-tight">Factures & Devis</h1>
            <p className="mt-1 text-[14px] text-[#9BA1B0]">
              Devis envoyés aux clients ({sent.length})
              {pending.length > 0 && ` · ${pending.length} en attente d'envoi`}
            </p>
          </div>
          <button
            onClick={() => exportCSV(sent)}
            disabled={sent.length === 0}
            className="rounded-[9px] border border-white/10 px-4 py-2 text-[13px] text-[#9BA1B0] transition hover:border-[#8FD400]/40 hover:text-[#C6FF00] disabled:opacity-40"
          >
            ↓ Export CSV
          </button>
        </div>

        <div className="mb-5 rounded-[12px] border border-amber-500/20 bg-amber-500/[0.06] px-4 py-3 text-[12.5px] text-amber-200/90">
          ℹ️ Les montants ne sont pas enregistrés en base : chaque devis est généré puis envoyé en PDF.
          Cette page suit les devis <strong>envoyés</strong> (date d&apos;envoi). Pour un vrai suivi de
          facturation (montant, payé/impayé), il faut créer un module factures dédié.
        </div>

        {/* Devis en attente */}
        {pending.length > 0 && (
          <div className="mb-6 overflow-hidden rounded-[18px] border border-white/10 bg-[#12141C]">
            <div className="border-b border-white/[0.07] px-5 py-4">
              <h2 className="text-[15px] font-semibold">Devis demandés — en attente d&apos;envoi</h2>
            </div>
            <table className="w-full border-collapse text-[13.5px]">
              <tbody>
                {pending.map((l) => (
                  <tr key={l.id} className="border-b border-white/[0.04] last:border-0">
                    <td className="px-5 py-3.5 font-medium">{l.name}</td>
                    <td className="px-4 py-3.5 text-[#9BA1B0] max-sm:hidden">{l.company ?? "—"}</td>
                    <td className="px-4 py-3.5">
                      <span className="rounded-full bg-amber-500/20 px-2.5 py-1 text-[11px] font-semibold text-amber-400">
                        À envoyer
                      </span>
                    </td>
                    <td className="px-4 py-3.5 text-right">
                      <a href={`/${locale}/admin/leads`} className="text-[12.5px] text-[#8FD400] hover:underline">
                        Traiter →
                      </a>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Devis envoyés */}
        <div className="overflow-hidden rounded-[18px] border border-white/10 bg-[#12141C]">
          {loading ? (
            <div className="p-8 text-center text-[14px] text-[#9BA1B0]">Chargement…</div>
          ) : sent.length === 0 ? (
            <div className="p-8 text-center text-[14px] text-[#9BA1B0]">
              Aucun devis envoyé pour l&apos;instant. Envoyez un devis depuis la page Leads.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full border-collapse text-[13.5px]">
                <thead>
                  <tr className="border-b border-white/[0.07] text-left text-[11px] uppercase tracking-[0.08em] text-[#9BA1B0]">
                    <th className="px-5 py-3.5">N° Devis</th>
                    <th className="px-4 py-3.5">Client</th>
                    <th className="px-4 py-3.5 max-md:hidden">Société</th>
                    <th className="px-4 py-3.5 max-sm:hidden">Date d&apos;envoi</th>
                    <th className="px-4 py-3.5">Statut</th>
                  </tr>
                </thead>
                <tbody>
                  {sent.map((l) => (
                    <tr key={l.id} className="border-b border-white/[0.04] last:border-0 transition hover:bg-white/[0.03]">
                      <td className="px-5 py-3.5 font-mono text-[12.5px] text-[#C6FF00]">{devisNumber(l)}</td>
                      <td className="px-4 py-3.5">
                        <div className="font-medium text-[#F5F6FA]">{l.name}</div>
                        <a href={`mailto:${l.email}`} className="text-[12px] text-[#8FD400] hover:underline">
                          {l.email}
                        </a>
                      </td>
                      <td className="px-4 py-3.5 text-[#9BA1B0] max-md:hidden">{l.company ?? "—"}</td>
                      <td className="px-4 py-3.5 text-[#9BA1B0]/80 max-sm:hidden">
                        {new Date(l.quote_sent_at!).toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" })}
                      </td>
                      <td className="px-4 py-3.5">
                        <span className="rounded-full bg-[#8FD400]/20 px-2.5 py-1 text-[11px] font-semibold text-[#C6FF00]">
                          Envoyé
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
