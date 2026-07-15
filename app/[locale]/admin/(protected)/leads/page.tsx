"use client";

import { useEffect, useState } from "react";

type Lead = {
  id: string;
  name: string;
  email: string;
  company?: string;
  service?: string;
  message: string;
  locale: string;
  status?: string;
  created_at: string;
};

const STATUSES = [
  { value: "new",       label: "Nouveau",   color: "bg-blue-500/20 text-blue-400" },
  { value: "contacted", label: "Contacté",  color: "bg-amber-500/20 text-amber-400" },
  { value: "converted", label: "Client",    color: "bg-[#8FD400]/20 text-[#C6FF00]" },
  { value: "archived",  label: "Archivé",   color: "bg-white/10 text-[#9BA1B0]" },
];

function statusStyle(s?: string) {
  return STATUSES.find((x) => x.value === s)?.color ?? STATUSES[0].color;
}
function statusLabel(s?: string) {
  return STATUSES.find((x) => x.value === s)?.label ?? "Nouveau";
}

function exportCSV(leads: Lead[]) {
  const cols = ["Date", "Nom", "Email", "Société", "Service", "Statut", "Message"];
  const rows = leads.map((l) => [
    new Date(l.created_at).toLocaleDateString("fr-FR"),
    l.name,
    l.email,
    l.company ?? "",
    l.service ?? "",
    statusLabel(l.status),
    `"${(l.message ?? "").replace(/"/g, '""')}"`,
  ]);
  const csv = [cols, ...rows].map((r) => r.join(";")).join("\n");
  const blob = new Blob(["﻿" + csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `leads-easydigia-${new Date().toISOString().slice(0, 10)}.csv`;
  a.click();
  URL.revokeObjectURL(url);
}

export default function AdminLeads() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<Lead | null>(null);
  const [filter, setFilter] = useState("all");
  const [replyOpen, setReplyOpen] = useState(false);
  const [replySubject, setReplySubject] = useState("");
  const [replyMessage, setReplyMessage] = useState("");
  const [replySending, setReplySending] = useState(false);
  const [replyStatus, setReplyStatus] = useState<"idle" | "ok" | "error">("idle");

  async function load() {
    setLoading(true);
    const res = await fetch("/api/admin/leads");
    const json = await res.json();
    if (json.ok) setLeads(json.leads ?? []);
    setLoading(false);
  }

  useEffect(() => { load(); }, []);

  function openReply(lead: Lead) {
    setSelected(lead);
    setReplySubject(`EasyDigia — Suite de votre demande`);
    setReplyMessage(`Bonjour ${lead.name.split(" ")[0]},\n\nMerci pour votre intérêt pour EasyDigia.\n\n`);
    setReplyOpen(true);
    setReplyStatus("idle");
  }

  async function sendReply() {
    if (!selected || !replyMessage.trim()) return;
    setReplySending(true);
    setReplyStatus("idle");
    const res = await fetch("/api/admin/leads/reply", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        to: selected.email,
        name: selected.name.split(" ")[0],
        subject: replySubject,
        message: replyMessage,
      }),
    });
    const json = await res.json();
    setReplySending(false);
    if (json.ok) {
      setReplyStatus("ok");
      updateStatus(selected.id, "contacted");
      setTimeout(() => { setReplyOpen(false); setReplyStatus("idle"); }, 2000);
    } else {
      setReplyStatus("error");
    }
  }

  async function updateStatus(id: string, status: string) {
    await fetch("/api/admin/leads", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, status }),
    });
    setLeads((prev) => prev.map((l) => l.id === id ? { ...l, status } : l));
    if (selected?.id === id) setSelected((prev) => prev ? { ...prev, status } : null);
  }

  const filtered = filter === "all" ? leads : leads.filter((l) => (l.status ?? "new") === filter);

  const counts: Record<string, number> = { all: leads.length };
  for (const s of STATUSES) counts[s.value] = leads.filter((l) => (l.status ?? "new") === s.value).length;

  return (
    <div className="min-h-screen bg-[#0A0B10] p-6 text-[#F5F6FA]">
      <div className="mx-auto max-w-[1100px]">

        {/* Header */}
        <div className="mb-8 flex flex-wrap items-start justify-between gap-4">
          <div>
            <div className="mb-2 font-mono text-[11px] uppercase tracking-[0.1em] text-[#8FD400]">
              EasyDigia — Admin
            </div>
            <h1 className="text-[28px] font-bold tracking-tight">Leads & Contacts</h1>
            <p className="mt-1 text-[14px] text-[#9BA1B0]">
              Visiteurs ayant rempli le formulaire d'audit
            </p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => exportCSV(filtered)}
              className="rounded-[9px] border border-white/10 px-4 py-2 text-[13px] text-[#9BA1B0] transition hover:border-[#8FD400]/40 hover:text-[#C6FF00]"
            >
              ↓ Export CSV
            </button>
            <a
              href="/fr/admin/blog"
              className="rounded-[9px] border border-white/10 px-4 py-2 text-[13px] text-[#9BA1B0] transition hover:border-white/20 hover:text-[#F5F6FA]"
            >
              ← Blog
            </a>
          </div>
        </div>

        {/* Filtres */}
        <div className="mb-5 flex flex-wrap gap-2">
          {[{ value: "all", label: "Tous" }, ...STATUSES].map((s) => (
            <button
              key={s.value}
              onClick={() => setFilter(s.value)}
              className={`rounded-full px-4 py-1.5 text-[13px] font-medium transition ${
                filter === s.value
                  ? "bg-[#8FD400]/15 text-[#C6FF00] ring-1 ring-[#8FD400]/40"
                  : "border border-white/10 text-[#9BA1B0] hover:border-white/20"
              }`}
            >
              {s.value === "all" ? "Tous" : s.label} ({counts[s.value] ?? 0})
            </button>
          ))}
        </div>

        <div className="flex gap-5 max-lg:flex-col">

          {/* Table */}
          <div className="flex-1 overflow-hidden rounded-[18px] border border-white/10 bg-[#12141C]">
            {loading ? (
              <div className="p-8 text-center text-[14px] text-[#9BA1B0]">Chargement…</div>
            ) : filtered.length === 0 ? (
              <div className="p-8 text-center text-[14px] text-[#9BA1B0]">Aucun lead pour ce filtre.</div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full border-collapse text-[13.5px]">
                  <thead>
                    <tr className="border-b border-white/[0.07] text-left text-[11px] uppercase tracking-[0.08em] text-[#9BA1B0]">
                      <th className="px-5 py-3.5">Nom</th>
                      <th className="px-4 py-3.5">Email</th>
                      <th className="px-4 py-3.5 max-md:hidden">Société</th>
                      <th className="px-4 py-3.5 max-sm:hidden">Date</th>
                      <th className="px-4 py-3.5">Statut</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filtered.map((lead) => (
                      <tr
                        key={lead.id}
                        onClick={() => setSelected(lead)}
                        className={`cursor-pointer border-b border-white/[0.04] transition hover:bg-white/[0.03] ${
                          selected?.id === lead.id ? "bg-[#8FD400]/[0.04]" : ""
                        }`}
                      >
                        <td className="px-5 py-3.5 font-medium text-[#F5F6FA]">{lead.name}</td>
                        <td className="px-4 py-3.5 text-[#9BA1B0]">{lead.email}</td>
                        <td className="px-4 py-3.5 text-[#9BA1B0] max-md:hidden">{lead.company ?? "—"}</td>
                        <td className="px-4 py-3.5 text-[#9BA1B0]/70 max-sm:hidden">
                          {new Date(lead.created_at).toLocaleDateString("fr-FR")}
                        </td>
                        <td className="px-4 py-3.5">
                          <span className={`rounded-full px-2.5 py-1 text-[11px] font-semibold ${statusStyle(lead.status)}`}>
                            {statusLabel(lead.status)}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* Détail */}
          {selected && (
            <div className="w-full lg:w-[340px] shrink-0 rounded-[18px] border border-white/10 bg-[#12141C] p-6">
              <div className="mb-4 flex items-start justify-between">
                <div className="flex h-11 w-11 items-center justify-center rounded-full bg-[#8FD400]/15 text-[18px] font-bold text-[#8FD400]">
                  {selected.name[0].toUpperCase()}
                </div>
                <button
                  onClick={() => setSelected(null)}
                  className="text-[#9BA1B0] transition hover:text-[#F5F6FA]"
                >
                  ✕
                </button>
              </div>

              <h3 className="text-[17px] font-semibold">{selected.name}</h3>
              <a href={`mailto:${selected.email}`} className="mt-0.5 block text-[13px] text-[#8FD400] hover:underline">
                {selected.email}
              </a>

              <dl className="mt-4 space-y-2.5 text-[13px]">
                {selected.company && (
                  <div className="flex justify-between">
                    <dt className="text-[#9BA1B0]">Société</dt>
                    <dd className="font-medium">{selected.company}</dd>
                  </div>
                )}
                {selected.service && (
                  <div className="flex justify-between">
                    <dt className="text-[#9BA1B0]">Service</dt>
                    <dd className="font-medium">{selected.service}</dd>
                  </div>
                )}
                <div className="flex justify-between">
                  <dt className="text-[#9BA1B0]">Date</dt>
                  <dd>{new Date(selected.created_at).toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" })}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-[#9BA1B0]">Langue</dt>
                  <dd className="uppercase">{selected.locale}</dd>
                </div>
              </dl>

              <div className="mt-4 rounded-[10px] bg-[#0A0B10] p-3.5 text-[13px] leading-relaxed text-[#9BA1B0]">
                {selected.message}
              </div>

              {/* Changer le statut */}
              <div className="mt-5">
                <p className="mb-2 text-[11px] uppercase tracking-[0.08em] text-[#9BA1B0]">Statut</p>
                <div className="flex flex-wrap gap-2">
                  {STATUSES.map((s) => (
                    <button
                      key={s.value}
                      onClick={() => updateStatus(selected.id, s.value)}
                      className={`rounded-full px-3 py-1.5 text-[12px] font-semibold transition ${
                        (selected.status ?? "new") === s.value
                          ? s.color + " ring-1 ring-white/20"
                          : "border border-white/10 text-[#9BA1B0] hover:border-white/20"
                      }`}
                    >
                      {s.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Formulaire de réponse */}
              {replyOpen && selected ? (
                <div className="mt-5 rounded-[12px] border border-[#8FD400]/20 bg-[#0A0B10] p-4">
                  <p className="mb-3 text-[11px] uppercase tracking-[0.08em] text-[#9BA1B0]">
                    Répondre à {selected.email}
                  </p>
                  <input
                    value={replySubject}
                    onChange={(e) => setReplySubject(e.target.value)}
                    placeholder="Objet"
                    className="mb-2 w-full rounded-[8px] border border-white/10 bg-[#12141C] px-3 py-2 text-[13px] text-[#F5F6FA] placeholder-[#9BA1B0]/40 outline-none focus:border-[#8FD400]/40"
                  />
                  <textarea
                    value={replyMessage}
                    onChange={(e) => setReplyMessage(e.target.value)}
                    rows={6}
                    placeholder="Votre message…"
                    className="w-full rounded-[8px] border border-white/10 bg-[#12141C] px-3 py-2 text-[13px] leading-relaxed text-[#F5F6FA] placeholder-[#9BA1B0]/40 outline-none focus:border-[#8FD400]/40"
                  />
                  {replyStatus === "ok" && (
                    <p className="mt-2 text-[12px] text-[#8FD400]">✅ Email envoyé avec succès !</p>
                  )}
                  {replyStatus === "error" && (
                    <p className="mt-2 text-[12px] text-red-400">❌ Erreur d'envoi. Réessayez.</p>
                  )}
                  <div className="mt-3 flex gap-2">
                    <button
                      onClick={sendReply}
                      disabled={replySending || !replyMessage.trim()}
                      className="flex-1 rounded-[8px] bg-gradient-to-br from-[#8FD400] to-[#C6FF00] py-2 text-[13px] font-bold text-[#0A0B10] transition hover:opacity-90 disabled:opacity-50"
                    >
                      {replySending ? "Envoi…" : "✉ Envoyer"}
                    </button>
                    <button
                      onClick={() => setReplyOpen(false)}
                      className="rounded-[8px] border border-white/10 px-4 py-2 text-[12px] text-[#9BA1B0] transition hover:text-[#F5F6FA]"
                    >
                      Annuler
                    </button>
                  </div>
                </div>
              ) : (
                <button
                  onClick={() => openReply(selected)}
                  className="mt-5 flex w-full items-center justify-center gap-2 rounded-[10px] bg-gradient-to-br from-[#8FD400] to-[#C6FF00] py-2.5 text-[13.5px] font-bold text-[#0A0B10] shadow-[0_4px_16px_rgba(143,212,0,0.3)] transition hover:opacity-90"
                >
                  ✉ Répondre par email
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
