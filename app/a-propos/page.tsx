"use client";

import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { Shield, MapPin, Award, Users } from "lucide-react";

export default function AProposPage() {
  const stats = [
    { value: "1998", label: "Année de création" },
    { value: "26+", label: "Années d'expérience" },
    { value: "Grand Est", label: "Zone d'intervention" },
    { value: "500+", label: "Produits référencés" },
  ];

  const values = [
    {
      icon: <MapPin className="h-6 w-6" />,
      title: "Proximité",
      desc: "Basés à Neuves-Maisons (54), nous intervenons dans tout le Grand Est : Nancy, Metz, Épinal, Reims, Troyes…",
    },
    {
      icon: <Shield className="h-6 w-6" />,
      title: "Expertise",
      desc: "Plus de 25 ans de métier au service des professionnels du nettoyage. Nous connaissons chaque produit et chaque besoin.",
    },
    {
      icon: <Award className="h-6 w-6" />,
      title: "Qualité",
      desc: "Distributeur agréé des plus grandes marques (Kärcher, Nilfisk, Numatic, Viper…), nous sélectionnons le meilleur du marché.",
    },
    {
      icon: <Users className="h-6 w-6" />,
      title: "Accompagnement",
      desc: "Du conseil à la mise en service, en passant par la formation et le SAV, nous sommes à vos côtés à chaque étape.",
    },
  ];

  return (
    <>
      <Section>
        <Container>
          <nav className="flex items-center gap-2 text-sm text-text-secondary mb-8">
            <Link href="/" className="hover:text-primary">Accueil</Link>
            <span>/</span>
            <span className="text-text font-medium">À propos</span>
          </nav>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h1 className="text-4xl md:text-5xl font-bold font-heading">
                Wédis, votre partenaire nettoyage depuis 1998
              </h1>
              <p className="mt-6 text-lg text-text-secondary leading-relaxed">
                Basée à Neuves-Maisons (54), Wédis est une entreprise familiale
                spécialisée dans la fourniture de matériel et produits de nettoyage
                professionnel. Nous accompagnons chaque jour les entreprises du
                Grand Est dans l&apos;entretien de leurs locaux.
              </p>
              <p className="mt-4 text-text-secondary leading-relaxed">
                Autolaveuses, aspirateurs, monobrosses, chariots de nettoyage,
                produits d&apos;entretien, balayeuses… nous référençons plus de
                500 produits des plus grandes marques pour répondre à tous vos
                besoins en hygiène et propreté.
              </p>
              <div className="mt-8 flex gap-4">
                <Link href="/catalogue">
                  <Button size="lg">Notre catalogue</Button>
                </Link>
                <Link href="/contact">
                  <Button size="lg" variant="secondary">Nous contacter</Button>
                </Link>
              </div>
            </div>

            <div className="aspect-[4/3] bg-surface-secondary rounded-lg flex items-center justify-center">
              <span className="text-6xl font-bold font-heading text-primary/20">1998</span>
            </div>
          </div>
        </Container>
      </Section>

      {/* Stats */}
      <Section alt>
        <Container>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat) => (
              <div key={stat.label} className="text-center">
                <p className="text-4xl md:text-5xl font-bold font-heading text-primary">{stat.value}</p>
                <p className="mt-2 text-sm text-text-secondary">{stat.label}</p>
              </div>
            ))}
          </div>
        </Container>
      </Section>

      {/* Valeurs */}
      <Section>
        <Container>
          <h2 className="text-3xl font-bold font-heading text-center mb-12">
            Nos valeurs
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((v) => (
              <div key={v.title} className="rounded-lg border border-border p-6">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  {v.icon}
                </div>
                <h3 className="mt-4 font-semibold">{v.title}</h3>
                <p className="mt-2 text-sm text-text-secondary">{v.desc}</p>
              </div>
            ))}
          </div>
        </Container>
      </Section>

      {/* CTA */}
      <Section alt>
        <Container>
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold font-heading">Vous avez un projet ?</h2>
            <p className="mt-4 text-lg text-text-secondary">
              Contactez-nous pour un devis personnalisé ou une visite technique.
            </p>
            <div className="mt-8">
              <Link href="/contact">
                <Button size="lg">Demander un devis</Button>
              </Link>
            </div>
          </div>
        </Container>
      </Section>
    </>
  );
}
