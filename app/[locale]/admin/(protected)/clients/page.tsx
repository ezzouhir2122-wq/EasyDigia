"use client";

import { useEffect, useMemo, useState } from "react";
import { useParams } from "next/navigation";
import { AdminNav } from "@/components/admin/AdminNav";

type Lead = {
  id: string;
  name: string;
  email: string;
  company?: string;
  service?: string;
  message?: string;
  locale: string;
  status?: string;
  created_at: string;
  quote_sent_at?: string | null;
};

function exportCSV(rows: Lead[]) {
  const cols = ["Nom", "Email", "Société", "Service", "Devis envoyé", "Depuis"];
  const data = rows.map((l) => [
    l.name,
    l.email,
    l.company ?? "",
    l.service ?? "",
    l.quote_sent_at ? "Oui" : "Non",
    new Date(l.created_at).toLocaleDateString("fr-FR"),
  ]);
  const csv = [cols, ...data].map((r) => r.join(";")).join("\n");
  const blob = new Blob(["﻿" + csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `clients-easydigia-${new Date().toISOString().slice(0, 10)}.csv`;
  a.click();
  URL.revokeObjectURL(url);
}

export default function AdminClients() {
  const params = useParams();
  const locale = (params?.locale as string) ?? "fr";
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [q, setQ] = useState("");

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

  const clients = useMemo(() => {
    const base = leads.filter((l) => l.status === "converted");
    const term = q.trim().toLowerCase();
    const filtered = term
      ? base.filter((l) =>
          [l.name, l.email, l.company].some((v) => (v ?? "").toLowerCase().includes(term))
        )
      : base;
    return filtered.sort((a, b) => +new Date(b.created_at) - +new Date(a.created_at));
  }, [leads, q]);

  return (
    <div className="min-h-screen bg-[#0A0B10] text-[#F5F6FA]">
      <AdminNav locale={locale} active="clients" />

      <main className="mx-auto max-w-[1100px] px-6 py-8">
        <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
          <div>
            <div className="mb-2 font-mono text-[11px] uppercase tracking-[0.1em] text-[#8FD400]">
              EasyDigia — Admin
            </div>
            <h1 className="text-[28px] font-bold tracking-tight">Clients</h1>
            <p className="mt-1 text-[14px] text-[#9BA1B0]">
              Leads convertis en clients ({clients.length})
            </p>
          </div>
          <button
            onClick={() => exportCSV(clients)}
            disabled={clients.length === 0}
            className="rounded-[9px] border border-white/10 px-4 py-2 text-[13px] text-[#9BA1B0] transition hover:border-[#8FD400]/40 hover:text-[#C6FF00] disabled:opacity-40"
          >
            ↓ Export CSV
          </button>
        </div>

        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Rechercher un client (nom, email, société)…"
          className="mb-5 w-full max-w-[380px] rounded-[10px] border border-white/10 bg-[#12141C] px-4 py-2.5 text-[14px] text-[#F5F6FA] placeholder-[#9BA1B0]/40 outline-none transition focus:border-[#8FD400]/40"
        />

        <div className="overflow-hidden rounded-[18px] border border-white/10 bg-[#12141C]">
          {loading ? (
            <div className="p-8 text-center text-[14px] text-[#9BA1B0]">Chargement…</div>
          ) : clients.length === 0 ? (
            <div className="p-8 text-center text-[14px] text-[#9BA1B0]">
              Aucun client pour l&apos;instant. Passez un lead au statut « Client » depuis la page Leads.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full border-collapse text-[13.5px]">
                <thead>
                  <tr className="border-b border-white/[0.07] text-left text-[11px] uppercase tracking-[0.08em] text-[#9BA1B0]">
                    <th className="px-5 py-3.5">Client</th>
                    <th className="px-4 py-3.5 max-md:hidden">Société</th>
                    <th className="px-4 py-3.5 max-sm:hidden">Service</th>
                    <th className="px-4 py-3.5">Devis</th>
                    <th className="px-4 py-3.5 max-sm:hidden">Client depuis</th>
                  </tr>
                </thead>
                <tbody>
                  {clients.map((l) => (
                    <tr key={l.id} className="border-b border-white/[0.04] last:border-0 transition hover:bg-white/[0.03]">
                      <td className="px-5 py-3.5">
                        <div className="font-medium text-[#F5F6FA]">{l.name}</div>
                        <a href={`mailto:${l.email}`} className="text-[12.5px] text-[#8FD400] hover:underline">
                          {l.email}
                        </a>
                      </td>
                      <td className="px-4 py-3.5 text-[#9BA1B0] max-md:hidden">{l.company ?? "—"}</td>
                      <td className="px-4 py-3.5 text-[#9BA1B0] max-sm:hidden">{l.service ?? "—"}</td>
                      <td className="px-4 py-3.5">
                        {l.quote_sent_at ? (
                          <span className="rounded-full bg-[#8FD400]/20 px-2.5 py-1 text-[11px] font-semibold text-[#C6FF00]">
                            Envoyé
                          </span>
                        ) : (
                          <span className="text-[#9BA1B0]/60">—</span>
                        )}
                      </td>
                      <td className="px-4 py-3.5 text-[#9BA1B0]/70 max-sm:hidden">
                        {new Date(l.created_at).toLocaleDateString("fr-FR")}
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
