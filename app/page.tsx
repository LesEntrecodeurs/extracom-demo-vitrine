"use client";

import Link from "next/link";
import { ArrowRight, Wrench, Calendar, Building2, HelpCircle, CheckCircle, Shield, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { blogPosts } from "@/data/blog";

/* ── Hero ── */
function HeroSection() {
  return (
    <section className="relative pt-24 pb-32 md:pt-32 md:pb-40 lg:pt-40 lg:pb-48 overflow-hidden">
      <Container>
        <div className="mx-auto max-w-4xl text-center">
          <div className="mb-8 inline-flex items-center gap-2 rounded-full border border-border/30 bg-white/80 px-4 py-1.5 text-xs font-medium text-text-secondary/60 shadow-xs">
            <span className="h-1.5 w-1.5 rounded-full bg-primary" />
            Distributeur depuis 1998 · Grand Est
          </div>
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-bold font-heading text-text leading-[0.95] tracking-[-0.05em]">
            Matériel et produits de nettoyage professionnel
          </h1>
          <p className="mt-6 text-base md:text-lg text-text-secondary/50 max-w-xl mx-auto leading-relaxed">
            Wédis vous accompagne dans le Grand Est avec une gamme complète de
            machines, produits et services pour les professionnels.
          </p>
          <div className="mt-10 flex flex-col sm:flex-row gap-3 justify-center">
            <Link href="/catalogue">
              <Button size="lg">
                Parcourir le catalogue
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
            <Link href="/contact">
              <Button size="lg" variant="secondary">
                Nous contacter
              </Button>
            </Link>
          </div>
        </div>
      </Container>
    </section>
  );
}

/* ── Chiffres ── */
function TrustSection() {
  const stats = [
    { value: "1998", label: "Année de création" },
    { value: "+5 000", label: "Clients accompagnés" },
    { value: "15+", label: "Marques distribuées" },
    { value: "Grand Est", label: "Zone d'intervention" },
  ];

  return (
    <section className="pb-24 md:pb-32">
      <Container>
        <div className="border-t border-border/40 pt-12">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-y-10">
            {stats.map((stat) => (
              <div key={stat.label} className="text-center">
                <p className="text-3xl md:text-4xl lg:text-5xl font-bold font-heading text-primary tracking-tight leading-none">
                  {stat.value}
                </p>
                <p className="mt-2 text-sm text-text-secondary/50">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </Container>
    </section>
  );
}

/* ── Marques ── */
function BrandsSection() {
  const brands = [
    { name: "Kärcher", slug: "karcher" },
    { name: "Nilfisk", slug: "nilfisk" },
    { name: "Numatic", slug: "numatic" },
    { name: "Viper", slug: "viper" },
    { name: "Wetrok", slug: "wetrok" },
    { name: "Fimap", slug: "fimap" },
  ];

  return (
    <SectionAlt>
      <Container>
        <div className="mx-auto max-w-lg text-center mb-12">
          <p className="text-xs font-medium text-text-secondary/40 tracking-[0.2em] uppercase mb-4">
            Nos marques
          </p>
          <h2 className="text-2xl md:text-3xl font-bold font-heading text-text tracking-tight">
            Les grandes marques que nous distribuons
          </h2>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-2">
          {brands.map((brand) => (
            <Link
              key={brand.slug}
              href={`/marques/${brand.slug}`}
              className="group flex flex-col items-center justify-center rounded-lg border border-border/30 bg-white px-4 py-8 text-center transition-all duration-200 hover:border-border/60 hover:shadow-xs"
            >
              <span className="text-sm font-semibold text-text group-hover:text-primary transition-colors">
                {brand.name}
              </span>
            </Link>
          ))}
        </div>
        <div className="mt-8 text-center">
          <Link
            href="/marques"
            className="inline-flex items-center gap-1 text-sm font-medium text-text-secondary/50 hover:text-text transition-colors"
          >
            Voir toutes nos marques
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>
      </Container>
    </SectionAlt>
  );
}

/* ── Services ── */
function ServicesSection() {
  const services = [
    {
      icon: Wrench,
      title: "SAV & réparations",
      desc: "Un atelier complet pour l'entretien et la réparation de vos machines, toutes marques.",
    },
    {
      icon: Calendar,
      title: "Location de matériel",
      desc: "Besoin d'une machine pour une courte durée ? Découvrez notre gamme locative.",
    },
    {
      icon: Building2,
      title: "Formation",
      desc: "Formez vos équipes à l'utilisation et à l'entretien des matériels de nettoyage.",
    },
    {
      icon: HelpCircle,
      title: "Aides CARSAT",
      desc: "Nous vous accompagnons dans vos démarches de financement et de prévention.",
    },
  ];

  return (
    <Section>
      <Container>
        <div className="mx-auto max-w-lg text-center mb-12">
          <p className="text-xs font-medium text-text-secondary/40 tracking-[0.2em] uppercase mb-4">
            Services
          </p>
          <h2 className="text-2xl md:text-3xl font-bold font-heading text-text tracking-tight">
            Un accompagnement complet
          </h2>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-3">
          {services.map((service) => (
            <div
              key={service.title}
              className="rounded-lg border border-border/30 bg-white p-6 transition-all duration-200 hover:border-border/60 hover:shadow-xs"
            >
              <div className="mb-3 flex h-8 w-8 items-center justify-center rounded-md bg-primary-50/40">
                <service.icon className="h-4 w-4 text-primary" />
              </div>
              <h3 className="text-sm font-semibold text-text mb-1.5">
                {service.title}
              </h3>
              <p className="text-sm text-text-secondary/60 leading-relaxed">
                {service.desc}
              </p>
            </div>
          ))}
        </div>
        <div className="mt-8 text-center">
          <Link
            href="/services"
            className="inline-flex items-center gap-1 text-sm font-medium text-text-secondary/50 hover:text-text transition-colors"
          >
            Découvrir tous nos services
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>
      </Container>
    </Section>
  );
}

/* ── Pourquoi ── */
function WhySection() {
  const reasons = [
    {
      icon: Shield,
      title: "Expertise depuis 1998",
      desc: "Plus de 25 ans d'expérience dans le nettoyage professionnel dans le Grand Est.",
    },
    {
      icon: CheckCircle,
      title: "Stock important",
      desc: "Un large stock de machines, pièces détachées et produits d'entretien disponible.",
    },
    {
      icon: Sparkles,
      title: "Marques leaders",
      desc: "Kärcher, Nilfisk, Numatic, Viper… les meilleures marques au meilleur prix.",
    },
  ];

  return (
    <Section>
      <Container>
        <div className="mx-auto max-w-lg text-center mb-12">
          <h2 className="text-2xl md:text-3xl font-bold font-heading text-text tracking-tight">
            Pourquoi choisir Wédis ?
          </h2>
        </div>
        <div className="grid md:grid-cols-3 gap-10 md:gap-12">
          {reasons.map((reason) => (
            <div key={reason.title} className="text-center">
              <div className="mx-auto mb-4 flex h-10 w-10 items-center justify-center rounded-lg bg-primary-50/40">
                <reason.icon className="h-4 w-4 text-primary" />
              </div>
              <h3 className="text-sm font-semibold text-text mb-1.5">
                {reason.title}
              </h3>
              <p className="text-sm text-text-secondary/60 leading-relaxed max-w-xs mx-auto">
                {reason.desc}
              </p>
            </div>
          ))}
        </div>
      </Container>
    </Section>
  );
}

/* ── Blog ── */
function BlogSection() {
  const latest = blogPosts.slice(0, 3);

  if (latest.length === 0) return null;

  return (
    <SectionAlt>
      <Container>
        <div className="mx-auto max-w-lg text-center mb-12">
          <p className="text-xs font-medium text-text-secondary/40 tracking-[0.2em] uppercase mb-4">
            Blog
          </p>
          <h2 className="text-2xl md:text-3xl font-bold font-heading text-text tracking-tight">
            Actualités et conseils
          </h2>
        </div>
        <div className="grid md:grid-cols-3 gap-4">
          {latest.map((article) => (
            <Link
              key={article.slug}
              href={`/blog/${article.slug}`}
              className="group rounded-lg border border-border/30 bg-white p-6 transition-all duration-200 hover:border-border/60 hover:shadow-xs"
            >
              <p className="text-xs text-text-secondary/40 mb-2">
                {new Date(article.date).toLocaleDateString("fr-FR", {
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                })}
              </p>
              <h3 className="text-sm font-semibold text-text group-hover:text-primary transition-colors mb-1.5 leading-relaxed">
                {article.title}
              </h3>
              <p className="text-sm text-text-secondary/60 leading-relaxed line-clamp-2">
                {article.excerpt}
              </p>
            </Link>
          ))}
        </div>
        <div className="mt-8 text-center">
          <Link href="/blog">
            <Button variant="ghost" size="sm">
              Voir tous les articles
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </div>
      </Container>
    </SectionAlt>
  );
}

/* ── CTA final ── */
function CTASection() {
  return (
    <Section>
      <Container>
        <div className="mx-auto max-w-2xl text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-border/30 bg-white/80 px-4 py-1.5 text-xs font-medium text-text-secondary/60 shadow-xs mb-6">
            <span className="h-1.5 w-1.5 rounded-full bg-primary" />
            Prêt à passer à l&apos;action ?
          </div>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold font-heading text-text tracking-tight mb-4">
            Prêt à équiper votre entreprise ?
          </h2>
          <p className="text-text-secondary/50 text-lg mb-8 max-w-lg mx-auto leading-relaxed">
            Contactez-nous pour un devis personnalisé ou une démonstration de
            nos machines.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link href="/catalogue">
              <Button size="lg">
                Voir le catalogue
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <Link href="/contact">
              <Button size="lg" variant="secondary">
                Demander un devis
              </Button>
            </Link>
          </div>
        </div>
      </Container>
    </Section>
  );
}

/* ── Wrapper Section ── */
function Section({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <section className={`py-16 md:py-20 lg:py-24 ${className}`}>
      {children}
    </section>
  );
}

function SectionAlt({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <section className={`py-16 md:py-20 lg:py-24 bg-surface-secondary/40 ${className}`}>
      {children}
    </section>
  );
}

/* ── Page d'accueil ── */
export default function HomePage() {
  return (
    <>
      <HeroSection />
      <TrustSection />
      <BrandsSection />
      <ServicesSection />
      <WhySection />
      <BlogSection />
      <CTASection />
    </>
  );
}
