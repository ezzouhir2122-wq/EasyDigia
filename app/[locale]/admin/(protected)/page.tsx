"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { AdminNav } from "@/components/admin/AdminNav";

type Lead = {
  id: string;
  name: string;
  email: string;
  company?: string;
  service?: string;
  locale: string;
  status?: string;
  created_at: string;
  quote_sent_at?: string | null;
  quote_requested?: boolean;
};

const STATUS_META: Record<string, { label: string; color: string }> = {
  new: { label: "Nouveau", color: "bg-blue-500/20 text-blue-400" },
  contacted: { label: "Contacté", color: "bg-amber-500/20 text-amber-400" },
  converted: { label: "Client", color: "bg-[#8FD400]/20 text-[#C6FF00]" },
  archived: { label: "Archivé", color: "bg-white/10 text-[#9BA1B0]" },
};

function statusLabel(s?: string) {
  return STATUS_META[s ?? "new"]?.label ?? "Nouveau";
}
function statusStyle(s?: string) {
  return STATUS_META[s ?? "new"]?.color ?? STATUS_META.new.color;
}

export default function AdminDashboard() {
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

  const stats = useMemo(() => {
    const total = leads.length;
    const clients = leads.filter((l) => l.status === "converted").length;
    const factures = leads.filter((l) => !!l.quote_sent_at).length;
    const devisEnAttente = leads.filter((l) => l.quote_requested && !l.quote_sent_at).length;
    const nouveaux = leads.filter((l) => (l.status ?? "new") === "new").length;
    const taux = total > 0 ? Math.round((clients / total) * 100) : 0;
    const now = new Date();
    const ceMois = leads.filter((l) => {
      const d = new Date(l.created_at);
      return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
    }).length;
    return { total, clients, factures, devisEnAttente, nouveaux, taux, ceMois };
  }, [leads]);

  const recent = useMemo(
    () =>
      [...leads]
        .sort((a, b) => +new Date(b.created_at) - +new Date(a.created_at))
        .slice(0, 6),
    [leads]
  );

  const cards = [
    { label: "Leads au total", value: stats.total, href: `/${locale}/admin/leads`, icon: "👥", hint: `${stats.ceMois} ce mois-ci` },
    { label: "Clients convertis", value: stats.clients, href: `/${locale}/admin/clients`, icon: "✅", hint: `${stats.taux}% de conversion` },
    { label: "Factures (devis envoyés)", value: stats.factures, href: `/${locale}/admin/factures`, icon: "🧾", hint: `${stats.devisEnAttente} devis en attente` },
    { label: "Nouveaux leads", value: stats.nouveaux, href: `/${locale}/admin/leads`, icon: "✨", hint: "à traiter" },
  ];

  return (
    <div className="min-h-screen bg-[#0A0B10] text-[#F5F6FA]">
      <AdminNav locale={locale} active="dashboard" />

      <main className="mx-auto max-w-[1100px] px-6 py-8">
        <div className="mb-8">
          <div className="mb-2 font-mono text-[11px] uppercase tracking-[0.1em] text-[#8FD400]">
            EasyDigia — Admin
          </div>
          <h1 className="text-[28px] font-bold tracking-tight">Tableau de bord</h1>
          <p className="mt-1 text-[14px] text-[#9BA1B0]">
            Vue d&apos;ensemble des leads, clients et facturation.
          </p>
        </div>

        {/* Stat cards */}
        <div className="mb-8 grid grid-cols-2 gap-4 lg:grid-cols-4">
          {cards.map((c) => (
            <Link
              key={c.label}
              href={c.href}
              className="group rounded-[18px] border border-white/10 bg-[#12141C] p-5 transition hover:border-[#8FD400]/40"
            >
              <div className="mb-3 flex items-center justify-between">
                <span className="text-[20px]">{c.icon}</span>
                <span className="text-[#9BA1B0] opacity-0 transition group-hover:opacity-100">→</span>
              </div>
              <div className="text-[30px] font-bold leading-none tracking-tight">
                {loading ? "…" : c.value}
              </div>
              <div className="mt-1.5 text-[13px] font-medium text-[#F5F6FA]">{c.label}</div>
              <div className="mt-0.5 text-[12px] text-[#9BA1B0]">{c.hint}</div>
            </Link>
          ))}
        </div>

        <div className="grid gap-5 lg:grid-cols-[1fr_320px]">
          {/* Recent leads */}
          <div className="overflow-hidden rounded-[18px] border border-white/10 bg-[#12141C]">
            <div className="flex items-center justify-between border-b border-white/[0.07] px-5 py-4">
              <h2 className="text-[15px] font-semibold">Derniers leads</h2>
              <Link href={`/${locale}/admin/leads`} className="text-[12.5px] text-[#8FD400] hover:underline">
                Voir tout →
              </Link>
            </div>
            {loading ? (
              <div className="p-8 text-center text-[14px] text-[#9BA1B0]">Chargement…</div>
            ) : recent.length === 0 ? (
              <div className="p-8 text-center text-[14px] text-[#9BA1B0]">Aucun lead pour l&apos;instant.</div>
            ) : (
              <table className="w-full border-collapse text-[13.5px]">
                <tbody>
                  {recent.map((l) => (
                    <tr key={l.id} className="border-b border-white/[0.04] last:border-0">
                      <td className="px-5 py-3.5 font-medium">{l.name}</td>
                      <td className="px-4 py-3.5 text-[#9BA1B0] max-sm:hidden">{l.email}</td>
                      <td className="px-4 py-3.5 text-[#9BA1B0]/70 max-md:hidden">
                        {new Date(l.created_at).toLocaleDateString("fr-FR")}
                      </td>
                      <td className="px-4 py-3.5">
                        <span className={`rounded-full px-2.5 py-1 text-[11px] font-semibold ${statusStyle(l.status)}`}>
                          {statusLabel(l.status)}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>

          {/* Pipeline breakdown */}
          <div className="rounded-[18px] border border-white/10 bg-[#12141C] p-5">
            <h2 className="mb-4 text-[15px] font-semibold">Répartition</h2>
            {loading ? (
              <div className="text-[14px] text-[#9BA1B0]">Chargement…</div>
            ) : (
              <div className="space-y-3">
                {Object.entries(STATUS_META).map(([key, meta]) => {
                  const count = leads.filter((l) => (l.status ?? "new") === key).length;
                  const pct = stats.total > 0 ? Math.round((count / stats.total) * 100) : 0;
                  return (
                    <div key={key}>
                      <div className="mb-1 flex items-center justify-between text-[12.5px]">
                        <span className="text-[#9BA1B0]">{meta.label}</span>
                        <span className="font-medium">{count}</span>
                      </div>
                      <div className="h-1.5 overflow-hidden rounded-full bg-white/[0.06]">
                        <div
                          className="h-full rounded-full bg-gradient-to-r from-[#8FD400] to-[#C6FF00]"
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
