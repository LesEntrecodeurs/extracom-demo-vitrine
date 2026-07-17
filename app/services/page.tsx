"use client";

import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { Wrench, Clock, GraduationCap, HeartHandshake, ChevronRight } from "lucide-react";

const services = [
  {
    id: "sav",
    icon: <Wrench className="h-8 w-8" />,
    title: "SAV & Entretien",
    subtitle: "Réparation, maintenance et pièces détachées",
    desc: "Notre atelier SAV intervient sur toutes les marques : Kärcher, Nilfisk, Numatic, Viper… Diagnostics, réparations, révisions complètes et vente de pièces détachées. Nous assurons la maintenance préventive et curative de votre matériel.",
    features: [
      "Diagnostic gratuit",
      "Devis sous 48h",
      "Pièces d'origine",
      "Intervention sur site possible",
    ],
  },
  {
    id: "location",
    icon: <Clock className="h-8 w-8" />,
    title: "Location de matériel",
    subtitle: "Location courte et longue durée",
    desc: "Besoin d'un matériel pour un chantier, un pic d'activité ou en attendant une réparation ? Nous proposons la location de nos machines : autolaveuses, aspirateurs industriels, monobrosses, balayeuses…",
    features: [
      "Location à la journée, semaine ou mois",
      "Matériel récent et entretenu",
      "Livraison possible",
      "Option avec opérateur",
    ],
  },
  {
    id: "formation",
    icon: <GraduationCap className="h-8 w-8" />,
    title: "Formation",
    subtitle: "Formez vos équipes à l'utilisation du matériel",
    desc: "Nous formons vos collaborateurs à l'utilisation et à l'entretien du matériel de nettoyage. Une formation adaptée à vos besoins, sur site ou dans nos locaux.",
    features: [
      "Formation à la prise en main",
      "Bonnes pratiques d'utilisation",
      "Entretien courant",
      "Sécurité d'utilisation",
    ],
  },
  {
    id: "aides-carsat",
    icon: <HeartHandshake className="h-8 w-8" />,
    title: "Aides CARSAT",
    subtitle: "Accompagnement pour la prévention des TMS",
    desc: "Wédis vous accompagne dans vos démarches d'aides CARSAT pour la prévention des Troubles Musculo-Squelettiques (TMS). Bénéficiez de conseils et de matériel adapté pour améliorer les conditions de travail de vos équipes.",
    features: [
      "Diagnostic des postes de travail",
      "Conseil en équipement",
      "Aide au montage du dossier",
      "Matériel éligible CARSAT",
    ],
  },
];

export default function ServicesPage() {
  return (
    <>
      <Container className="py-12">
        <nav className="flex items-center gap-2 text-sm text-text-secondary mb-8">
          <Link href="/" className="hover:text-primary">Accueil</Link>
          <span>/</span>
          <span className="text-text font-medium">Services</span>
        </nav>

        <div className="max-w-2xl">
          <h1 className="text-4xl font-bold font-heading">Nos services</h1>
          <p className="mt-4 text-lg text-text-secondary">
            Au-delà de la fourniture de matériel, Wédis vous accompagne au quotidien
            avec des services complets : SAV, location, formation et aides CARSAT.
          </p>
        </div>
      </Container>

      {services.map((service, index) => (
        <Section key={service.id} id={service.id} alt={index % 2 === 1}>
          <Container>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div className={index % 2 === 1 ? "lg:order-2" : ""}>
                <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-primary/10 text-primary mb-6">
                  {service.icon}
                </div>
                <h2 className="text-3xl font-bold font-heading">{service.title}</h2>
                <p className="mt-2 text-lg text-secondary font-medium">{service.subtitle}</p>
                <p className="mt-4 text-text-secondary leading-relaxed">{service.desc}</p>
                <ul className="mt-6 space-y-2">
                  {service.features.map((f) => (
                    <li key={f} className="flex items-center gap-2 text-sm">
                      <ChevronRight className="h-4 w-4 text-primary shrink-0" />
                      {f}
                    </li>
                  ))}
                </ul>
                <div className="mt-8">
                  <Link href="/contact">
                    <Button>Demander un devis</Button>
                  </Link>
                </div>
              </div>
              <div className={`aspect-[4/3] bg-surface-secondary rounded-lg flex items-center justify-center ${index % 2 === 1 ? "lg:order-1" : ""}`}>
                <span className="text-4xl font-heading text-primary/20">{service.title}</span>
              </div>
            </div>
          </Container>
        </Section>
      ))}
    </>
  );
}
