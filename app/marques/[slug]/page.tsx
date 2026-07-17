"use client";

import Link from "next/link";
import { notFound } from "next/navigation";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { ChevronRight } from "lucide-react";

const brandsData: Record<string, { name: string; desc: string; longDesc: string; color: string }> = {
  karcher: {
    name: "Kärcher",
    desc: "Leader mondial du nettoyage",
    longDesc: "Kärcher est le leader mondial des technologies de nettoyage. La marque allemande propose une gamme complète de matériel professionnel : autolaveuses, aspirateurs, nettoyeurs haute pression, balayeuses… Reconnue pour sa fiabilité et son innovation, Kärcher équipe les professionnels du monde entier.",
    color: "#F5D100",
  },
  nilfisk: {
    name: "Nilfisk",
    desc: "Expertise danoise en nettoyage",
    longDesc: "Nilfisk est un fabricant danois de matériel de nettoyage professionnel présent dans plus de 100 pays. La marque est réputée pour ses aspirateurs industriels, ses autolaveuses et ses monobrosses alliant performance, ergonomie et durabilité.",
    color: "#003D7A",
  },
  numatic: {
    name: "Numatic",
    desc: "Aspirateurs et monobrosses britanniques",
    longDesc: "Numatic est un fabricant britannique de renom spécialisé dans les aspirateurs industriels et les monobrosses. La marque est particulièrement connue pour sa gamme Henry®, une référence en matière de fiabilité et de robustesse.",
    color: "#E30613",
  },
  viper: {
    name: "Viper",
    desc: "Matériel de nettoyage professionnel",
    longDesc: "Viper propose une large gamme de machines de nettoyage professionnel : autolaveuses, aspirateurs, monobrosses et balayeuses. La marque se distingue par un excellent rapport qualité-prix et une grande facilité d'utilisation.",
    color: "#00A651",
  },
  tennant: {
    name: "Tennant",
    desc: "Solutions de nettoyage innovantes",
    longDesc: "Tennant est un leader américain des solutions de nettoyage innovantes, pionnier des technologies écologiques (nettoyage sans produit chimique). La marque propose des autolaveuses, balayeuses et machines industrielles de haute performance.",
    color: "#0072CE",
  },
  wetrok: {
    name: "Wetrok",
    desc: "Systèmes de nettoyage suisses",
    longDesc: "Wetrok est un fabricant suisse de systèmes de nettoyage professionnel, reconnu pour la qualité et la précision de ses équipements. La marque excelle dans les solutions pour le nettoyage manuel et mécanisé.",
    color: "#00529B",
  },
  fimap: {
    name: "Fimap",
    desc: "Autolaveuses italiennes",
    longDesc: "Fimap est un fabricant italien spécialisé dans les autolaveuses professionnelles. La marque se distingue par son design italien, son innovation technologique et ses solutions éco-responsables.",
    color: "#00923F",
  },
  pudu: {
    name: "Pudu",
    desc: "Robots de nettoyage autonomes",
    longDesc: "Pudu Robotics est un leader chinois de la robotique de service, spécialisé dans les robots de nettoyage autonomes. Leurs solutions innovantes permettent d'automatiser le nettoyage des grands espaces (centres commerciaux, aéroports, hôpitaux…).",
    color: "#FF6B00",
  },
};

export default function MarquePage({ params }: { params: { slug: string } }) {
  const slug = params.slug;
  const brand = brandsData[slug];

  if (!brand) {
    notFound();
  }

  return (
    <Container className="py-12">
      <nav className="flex items-center gap-2 text-sm text-text-secondary mb-8">
        <Link href="/" className="hover:text-primary">Accueil</Link>
        <ChevronRight className="h-3 w-3" />
        <Link href="/marques" className="hover:text-primary">Marques</Link>
        <ChevronRight className="h-3 w-3" />
        <span className="text-text font-medium">{brand.name}</span>
      </nav>

      {/* Brand header */}
      <div className="rounded-xl border border-border overflow-hidden mb-12">
        <div className="h-32 md:h-48" style={{ backgroundColor: brand.color }} />
        <div className="p-6 md:p-8 -mt-12 md:-mt-16 relative">
          <div
            className="h-16 w-16 md:h-20 md:w-20 rounded-2xl flex items-center justify-center text-3xl font-bold text-white shadow-lg"
            style={{ backgroundColor: brand.color }}
          >
            {brand.name.charAt(0)}
          </div>
          <div className="mt-4 max-w-2xl">
            <h1 className="text-3xl md:text-4xl font-bold font-heading">{brand.name}</h1>
            <p className="mt-2 text-lg text-secondary">{brand.desc}</p>
            <p className="mt-4 text-text-secondary leading-relaxed">{brand.longDesc}</p>
          </div>
        </div>
      </div>

      {/* Products link */}
      <div className="text-center py-12 border border-dashed border-border rounded-lg">
        <p className="text-text-secondary mb-4">
          Retrouvez tous les produits {brand.name} disponibles dans notre catalogue.
        </p>
        <Link href={`/catalogue?q=${encodeURIComponent(brand.name)}`}>
          <Button size="lg">Voir les produits {brand.name}</Button>
        </Link>
      </div>
    </Container>
  );
}
