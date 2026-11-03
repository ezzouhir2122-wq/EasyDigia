import React from "react";
import { Document, Font, Page, StyleSheet, Text, View, renderToBuffer } from "@react-pdf/renderer";

Font.register({
  family: "EasyDigiaSans",
  fonts: [
    { src: "public/fonts/Arial-Regular.ttf", fontWeight: 400 },
    { src: "public/fonts/Arial-Bold.ttf", fontWeight: 700 },
  ],
});

export type QuoteItem = { title: string; description: string; amount: number };
export type QuoteData = {
  number: string;
  date: string;
  validDays: number;
  clientName: string;
  clientEmail: string;
  company: string;
  subject: string;
  items: QuoteItem[];
  paymentTerms: string;
  notes: string;
};

const C = { dark: "#0A0B10", surface: "#12141C", green: "#C6FF00", muted: "#9BA1B0", ink: "#F5F6FA", line: "#2A2F3A" };
const s = StyleSheet.create({
  page: { backgroundColor: C.dark, color: C.ink, fontFamily: "EasyDigiaSans", padding: 42, paddingBottom: 54 },
  top: { flexDirection: "row", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 22 },
  brand: { fontSize: 24, fontWeight: 700, color: C.ink },
  brandAccent: { color: C.green },
  tagline: { fontSize: 8, color: C.muted, marginTop: 5 },
  title: { fontSize: 28, fontWeight: 700, color: C.ink, textAlign: "right" },
  meta: { fontSize: 9, color: C.muted, textAlign: "right", lineHeight: 1.5 },
  box: { backgroundColor: C.surface, borderWidth: 1, borderColor: C.line, padding: 10, marginBottom: 14 },
  boxTitle: { fontSize: 9, fontWeight: 700, color: C.green, marginBottom: 6, textTransform: "uppercase", letterSpacing: 1 },
  body: { fontSize: 9.5, color: C.muted, lineHeight: 1.45 },
  tableHeader: { flexDirection: "row", backgroundColor: C.green, padding: 7 },
  row: { flexDirection: "row", borderLeftWidth: 1, borderRightWidth: 1, borderBottomWidth: 1, borderColor: C.line, backgroundColor: C.surface, padding: 8 },
  colTitle: { width: "23%", paddingRight: 6 }, colDesc: { width: "57%", paddingRight: 6 }, colQty: { width: "7%", textAlign: "center" }, colAmount: { width: "13%", textAlign: "right" },
  headText: { fontSize: 8, fontWeight: 700, color: C.dark },
  rowTitle: { fontSize: 9, fontWeight: 700, color: C.ink, lineHeight: 1.3 }, rowText: { fontSize: 8.5, color: C.muted, lineHeight: 1.35 }, amount: { fontSize: 9, fontWeight: 700, color: C.ink, textAlign: "right" },
  total: { flexDirection: "row", justifyContent: "flex-end", backgroundColor: C.green, padding: 9, marginTop: 8 }, totalLabel: { width: "80%", fontSize: 10, fontWeight: 700, color: C.dark, textAlign: "right", paddingRight: 12 }, totalValue: { width: "20%", fontSize: 10, fontWeight: 700, color: C.dark, textAlign: "right" },
  footer: { position: "absolute", bottom: 22, left: 42, right: 42, borderTopWidth: 1, borderTopColor: C.line, paddingTop: 7, flexDirection: "row", justifyContent: "space-between" }, footerText: { fontSize: 7.5, color: C.muted },
});

function money(amount: number) { return `${new Intl.NumberFormat("fr-FR").format(amount)} MAD`; }

function QuoteDocument({ quote }: { quote: QuoteData }) {
  const total = quote.items.reduce((sum, item) => sum + (Number(item.amount) || 0), 0);
  return <Document title={`Devis ${quote.number}`} author="EasyDigia">
    <Page size="A4" style={s.page}>
      <View style={s.top}>
        <View><Text style={s.brand}>EasyDig<Text style={s.brandAccent}>iA</Text></Text><Text style={s.tagline}>Automatisez. Accélérez. Grandissez.</Text></View>
        <View><Text style={s.title}>DEVIS</Text><Text style={s.meta}>N° {quote.number}{"\n"}Date : {quote.date}{"\n"}Validité : {quote.validDays} jours</Text></View>
      </View>
      <View style={{ flexDirection: "row", gap: 10 }}>
        <View style={[s.box, { width: "50%" }]}><Text style={s.boxTitle}>Émetteur</Text><Text style={s.body}>EasyDigia{"\n"}Marrakech, Maroc{"\n"}contact@easydigia.com{"\n"}+212 781 995 665</Text></View>
        <View style={[s.box, { width: "50%" }]}><Text style={s.boxTitle}>Client</Text><Text style={s.body}>{quote.clientName}{"\n"}{quote.company}{"\n"}{quote.clientEmail}</Text></View>
      </View>
      <View style={s.box}><Text style={s.boxTitle}>Objet du devis</Text><Text style={s.body}>{quote.subject}</Text></View>
      <View style={s.tableHeader}><Text style={[s.colTitle, s.headText]}>Prestation</Text><Text style={[s.colDesc, s.headText]}>Description</Text><Text style={[s.colQty, s.headText]}>Qté</Text><Text style={[s.colAmount, s.headText]}>Montant</Text></View>
      {quote.items.map((item, index) => <View style={s.row} key={`${item.title}-${index}`}><Text style={[s.colTitle, s.rowTitle]}>{item.title}</Text><Text style={[s.colDesc, s.rowText]}>{item.description}</Text><Text style={[s.colQty, s.rowText]}>1</Text><Text style={[s.colAmount, s.amount]}>{money(Number(item.amount) || 0)}</Text></View>)}
      <View style={s.total}><Text style={s.totalLabel}>TOTAL PROPOSÉ</Text><Text style={s.totalValue}>{money(total)}</Text></View>
      <View style={[s.box, { marginTop: 14 }]}><Text style={s.boxTitle}>Conditions et périmètre</Text><Text style={s.body}>{quote.paymentTerms}{"\n\n"}{quote.notes}</Text></View>
      <View style={s.footer}><Text style={s.footerText}>EasyDigia - Automatisation, IA & solutions digitales</Text><Text style={s.footerText}>www.easydigia.com</Text></View>
    </Page>
  </Document>;
}

export async function createQuotePdf(quote: QuoteData) {
  return renderToBuffer(<QuoteDocument quote={quote} />);
}
