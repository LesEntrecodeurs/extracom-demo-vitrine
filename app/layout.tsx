import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/site/Header";
import { Footer } from "@/components/site/Footer";
import { PreviewBridge } from "@/components/site/PreviewBridge";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: {
    default: "Wédis — Matériel et produits de nettoyage professionnel | Grand Est",
    template: "%s | Wédis",
  },
  description:
    "Depuis 1998, Wédis est votre distributeur de matériel de nettoyage professionnel dans le Grand Est : autolaveuses, aspirateurs, produits d'entretien, SAV, location, formation.",
  keywords: [
    "matériel nettoyage professionnel",
    "autolaveuse",
    "aspirateur industriel",
    "Kärcher Nancy",
    "Nilfisk",
    "produits entretien professionnel",
    "SAV nettoyage",
    "location matériel nettoyage",
    "Neuves-Maisons",
    "Grand Est",
  ],
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "https://wedis.fr"),
  openGraph: {
    title: "Wédis — Matériel et produits de nettoyage professionnel",
    description:
      "Depuis 1998, votre distributeur de matériel de nettoyage professionnel dans le Grand Est.",
    url: "/",
    siteName: "Wédis",
    locale: "fr_FR",
    type: "website",
  },
};

// Force rebuild

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr" className="scroll-smooth">
      <head>
        <link
          href="https://api.fontshare.com/v2/css?f[]=satoshi@300,400,500,700,900&display=swap"
          rel="stylesheet"
        />
        <link rel="icon" type="image/x-icon" href="https://wedis.fr/img/favicon.ico?1781253198" />
      </head>
      <body className={`${inter.variable} min-h-screen flex flex-col`}>
        <PreviewBridge />
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
