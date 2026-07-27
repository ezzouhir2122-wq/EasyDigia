import type { Metadata } from "next";
import { IBM_Plex_Sans, IBM_Plex_Mono, Space_Grotesk } from "next/font/google";
import { GoogleAnalytics } from "@next/third-parties/google";
import { NextIntlClientProvider } from "next-intl";
import { getMessages, setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import { routing } from "@/i18n/routing";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { WhatsAppButton } from "@/components/WhatsAppButton";
import { ExitIntentModal } from "@/components/ExitIntentModal";
import { ScrollToTop } from "@/components/ScrollToTop";
import { CookieBanner } from "@/components/CookieBanner";
import { FloatingCTA } from "@/components/FloatingCTA";
import { FomoNotification } from "@/components/FomoNotification";
import "../globals.css";

const ibmPlexSans = IBM_Plex_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-ibm-plex-sans",
});
const ibmPlexMono = IBM_Plex_Mono({
  subsets: ["latin"],
  weight: ["500"],
  variable: "--font-ibm-plex-mono",
});
const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  weight: ["500", "600", "700"],
  variable: "--font-space-grotesk",
});

export const metadata: Metadata = {
  title: "EasyDigia — Automatisation & IA",
  description:
    "EasyDigia conçoit des automatisations et des agents IA sur mesure pour votre entreprise.",
  openGraph: {
    type: "website",
    siteName: "EasyDigia",
    title: "EasyDigia — Automatisation & IA",
    description:
      "EasyDigia conçoit des automatisations et des agents IA sur mesure pour votre entreprise.",
    images: [{ url: "https://easydigia.com/og-image.png", width: 1200, height: 630, alt: "EasyDigia" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "EasyDigia — Automatisation & IA",
    description: "EasyDigia conçoit des automatisations et des agents IA sur mesure pour votre entreprise.",
    images: ["https://easydigia.com/og-image.png"],
  },
};

const organizationSchema = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": ["Organization", "LocalBusiness"],
      "@id": "https://easydigia.com/#organization",
      name: "EasyDigia",
      url: "https://easydigia.com",
      logo: "https://easydigia.com/logo-easydigia-new.jpeg",
      foundingDate: "2022",
      description:
        "EasyDigia conçoit des automatisations et des agents IA sur mesure pour les PME marocaines. Plus de 50 projets livrés en 3 ans dans les secteurs de l'immobilier, du retail et de l'industrie.",
      areaServed: ["MA", "FR", "BE"],
      address: {
        "@type": "PostalAddress",
        addressLocality: "Marrakech",
        addressRegion: "Marrakech-Safi",
        addressCountry: "MA",
      },
      contactPoint: {
        "@type": "ContactPoint",
        contactType: "customer service",
        email: "contact@easydigia.com",
        availableLanguage: ["French", "Arabic", "English"],
      },
      knowsAbout: [
        "Automatisation de processus",
        "Agents IA",
        "Chatbots IA",
        "Intégration API",
        "Intelligence artificielle",
        "PME Maroc",
      ],
      sameAs: ["https://www.linkedin.com/company/easydigia"],
    },
    {
      "@type": "WebSite",
      "@id": "https://easydigia.com/#website",
      url: "https://easydigia.com",
      name: "EasyDigia",
      publisher: { "@id": "https://easydigia.com/#organization" },
      inLanguage: ["fr", "ar", "en"],
    },
  ],
};

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!routing.locales.includes(locale as never)) notFound();
  setRequestLocale(locale);
  const messages = await getMessages();
  const dir = locale === "ar" ? "rtl" : "ltr";
  return (
    <html
      lang={locale}
      dir={dir}
      className={`${ibmPlexSans.variable} ${ibmPlexMono.variable} ${spaceGrotesk.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-base text-ink font-body">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
        />
        <NextIntlClientProvider messages={messages}>
          <Header />
          <main className="flex-1">{children}</main>
          <Footer />
          <WhatsAppButton />
          <ScrollToTop />
          <FloatingCTA />
          <FomoNotification />
          <ExitIntentModal />
          <CookieBanner />
        </NextIntlClientProvider>
      </body>
      <GoogleAnalytics gaId="G-MVS5Q9S2DC" />
    </html>
  );
}
