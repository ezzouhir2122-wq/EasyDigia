type AirtableLead = {
  name: string;
  email: string;
  company?: string;
  service?: string;
  message?: string;
  locale?: string;
};

type AirtablePdfLead = {
  name: string;
  email: string;
  company: string;
  phone: string;
};

const AIRTABLE_PDF_TABLE_ID = "tblPrAxPqxsRjyZfw";

// Insert a lead into the "LEADS ESAYDIGIA" Airtable table.
// Best-effort: throws are the caller's responsibility (routes wrap in try/catch).
export async function saveLeadToAirtable(lead: AirtableLead) {
  const apiKey = process.env.AIRTABLE_API_KEY;
  const baseId = process.env.AIRTABLE_BASE_ID;
  const tableId = process.env.AIRTABLE_TABLE_ID;
  if (!apiKey || !baseId || !tableId) {
    console.warn("AIRTABLE_API_KEY / AIRTABLE_BASE_ID / AIRTABLE_TABLE_ID manquants");
    return;
  }

  const res = await fetch(`https://api.airtable.com/v0/${baseId}/${tableId}`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      records: [
        {
          fields: {
            Nom: lead.name,
            Email: lead.email,
            Entreprise: lead.company ?? "",
            Service: lead.service ?? "",
            Message: lead.message ?? "",
            Locale: lead.locale ?? "fr",
            Date: new Date().toISOString(),
          },
        },
      ],
    }),
  });

  if (!res.ok) {
    const text = await res.text();
    console.error("airtable insert failed", res.status, text);
  }
}

// Insert a PDF download lead into the "PDF" Airtable table.
// Best-effort: throws are the caller's responsibility (routes wrap in try/catch).
export async function savePdfLeadToAirtable(lead: AirtablePdfLead) {
  const apiKey = process.env.AIRTABLE_API_KEY;
  const baseId = process.env.AIRTABLE_BASE_ID;
  if (!apiKey || !baseId) {
    console.warn("AIRTABLE_API_KEY / AIRTABLE_BASE_ID manquants");
    return;
  }

  const res = await fetch(`https://api.airtable.com/v0/${baseId}/${AIRTABLE_PDF_TABLE_ID}`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      records: [
        {
          fields: {
            Nom: lead.name,
            Email: lead.email,
            Entreprise: lead.company,
            "Téléphone": lead.phone,
            Date: new Date().toISOString(),
          },
        },
      ],
    }),
  });

  if (!res.ok) {
    const text = await res.text();
    console.error("airtable pdf insert failed", res.status, text);
  }
}
