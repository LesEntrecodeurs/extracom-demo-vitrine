"use client";

import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { ChevronRight } from "lucide-react";

const brands = [
  { name: "Kärcher", slug: "karcher", desc: "Leader mondial du nettoyage", color: "#F5D100" },
  { name: "Nilfisk", slug: "nilfisk", desc: "Expertise danoise en nettoyage", color: "#003D7A" },
  { name: "Numatic", slug: "numatic", desc: "Aspirateurs et monobrosses britanniques", color: "#E30613" },
  { name: "Viper", slug: "viper", desc: "Matériel de nettoyage professionnel", color: "#00A651" },
  { name: "Tennant", slug: "tennant", desc: "Solutions de nettoyage innovantes", color: "#0072CE" },
  { name: "Wetrok", slug: "wetrok", desc: "Systèmes de nettoyage suisses", color: "#00529B" },
  { name: "Fimap", slug: "fimap", desc: "Autolaveuses italiennes", color: "#00923F" },
  { name: "Pudu", slug: "pudu", desc: "Robots de nettoyage autonomes", color: "#FF6B00" },
];

export default function MarquesPage() {
  return (
    <Container className="py-12">
      <nav className="flex items-center gap-2 text-sm text-text-secondary mb-8">
        <Link href="/" className="hover:text-primary">Accueil</Link>
        <span>/</span>
        <span className="text-text font-medium">Marques</span>
      </nav>

      <div className="max-w-2xl mb-12">
        <h1 className="text-4xl font-bold font-heading">Les marques que nous distribuons</h1>
        <p className="mt-4 text-lg text-text-secondary">
          Wédis est distributeur agréé des plus grandes marques de matériel et
          produits de nettoyage professionnel. Découvrez notre sélection.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {brands.map((brand) => (
          <Link
            key={brand.slug}
            href={`/marques/${brand.slug}`}
            className="group rounded-lg border border-border bg-white p-6 transition-all hover:shadow-card-hover"
          >
            <div
              className="h-16 w-16 rounded-xl flex items-center justify-center mb-4 text-2xl font-bold text-white"
              style={{ backgroundColor: brand.color }}
            >
              {brand.name.charAt(0)}
            </div>
            <h3 className="font-semibold font-heading text-lg group-hover:text-primary transition-colors">
              {brand.name}
            </h3>
            <p className="mt-1 text-sm text-text-secondary">{brand.desc}</p>
            <div className="mt-4 flex items-center gap-1 text-sm font-medium text-primary opacity-0 group-hover:opacity-100 transition-opacity">
              Voir les produits <ChevronRight className="h-3 w-3" />
            </div>
          </Link>
        ))}
      </div>
    </Container>
  );
}
