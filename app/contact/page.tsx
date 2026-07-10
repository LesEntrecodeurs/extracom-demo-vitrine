import type { Metadata } from 'next';
import { Mail, Phone, MapPin, Clock, Building2 } from 'lucide-react';
import { ContactForm } from '@/components/site/ContactForm';
import { JsonLd } from '@/components/site/JsonLd';
import { absoluteUrl, breadcrumbLd, faqLd, webPageLd } from '@/lib/seo';

export const dynamic = 'force-dynamic';

const SHOP = {
  name: 'BricoMartin',
  email: 'contact@bricomartin.fr',
  phone: '05 56 12 34 56',
  phoneTel: '+33556123456',
  addressLine1: '15 rue des Artisans',
  postalCode: '33000',
  city: 'Bordeaux',
  country: 'France',
  hours: 'Lundi au vendredi · 9h–18h'
} as const;

export async function generateMetadata(): Promise<Metadata> {
  const title = "Contacter BricoMartin à Bordeaux";
  const description =
    "Téléphone, email et adresse de la boutique BricoMartin à Bordeaux : outillage pour les pros du bâtiment en Gironde.";
  return {
    title,
    description,
    alternates: { canonical: '/contact' },
    openGraph: {
      title,
      description,
      type: 'website',
      url: absoluteUrl('/contact'),
      siteName: SHOP.name
    },
    twitter: { card: 'summary_large_image', title, description }
  };
}

const FAQ = [
  {
    question: 'Comment contacter BricoMartin ?',
    answer:
      "BricoMartin est joignable par téléphone au 05 56 12 34 56 (du lundi au vendredi, 9h–18h), par email à contact@bricomartin.fr, ou directement à la boutique au 15 rue des Artisans, 33000 Bordeaux. Les clients connectés peuvent aussi ouvrir un ticket support depuis leur espace."
  },
  {
    question: 'Quel est le délai de réponse de BricoMartin ?',
    answer:
      "BricoMartin s'engage à répondre sous 24 heures ouvrées aux demandes reçues par email ou via le formulaire de contact. Pour une question urgente (SAV, pièce détachée), privilégiez l'appel téléphonique au 05 56 12 34 56."
  },
  {
    question:
      "Peut-on se rendre directement à la boutique BricoMartin ?",
    answer:
      "Oui. La boutique BricoMartin est ouverte du lundi au vendredi de 9h à 18h au 15 rue des Artisans à Bordeaux. Vous pouvez y retirer vos commandes, obtenir des conseils techniques et commander vos pièces détachées."
  },
  {
    question:
      "BricoMartin répond-elle aux demandes hors Gironde ?",
    answer:
      "Oui, BricoMartin traite les demandes de toute la France pour les pièces détachées et les commandes importantes. Le délai de livraison est à confirmer selon votre département : contactez-nous pour un devis personnalisé."
  }
];

export default function ContactPage() {
  const ld = [
    webPageLd('Contacter BricoMartin à Bordeaux', '/contact'),
    breadcrumbLd([
      { name: 'Accueil', path: '/' },
      { name: 'Contact BricoMartin', path: '/contact' }
    ]),
    {
      '@context': 'https://schema.org',
      '@type': 'ContactPage',
      name: `Contact ${SHOP.name}`,
      url: absoluteUrl('/contact'),
      mainEntity: {
        '@type': 'LocalBusiness',
        name: SHOP.name,
        telephone: SHOP.phoneTel,
        email: SHOP.email,
        address: {
          '@type': 'PostalAddress',
          streetAddress: SHOP.addressLine1,
          postalCode: SHOP.postalCode,
          addressLocality: SHOP.city,
          addressCountry: SHOP.country
        },
        openingHours: 'Mo-Fr 09:00-18:00',
        url: absoluteUrl('/')
      }
    },
    faqLd(FAQ)
  ];

  return (
    <div className="mx-auto max-w-3xl space-y-10">
      <JsonLd data={ld as unknown as Record<string, unknown>} />

      <header className="space-y-3">
        <p className="text-xs font-semibold tracking-[0.2em] text-[var(--brand-dark)] uppercase">
          {SHOP.name} · Contact
        </p>
        <h1 className="text-3xl font-semibold md:text-4xl">
          Contacter BricoMartin à Bordeaux
        </h1>
        <p className="text-neutral-700">
          Une question sur le catalogue, une commande, une pièce détachée ou un
          SAV ? Voici tous les moyens de joindre l&apos;équipe BricoMartin à
          Bordeaux.
        </p>
      </header>

      <section
        aria-label="Coordonnées BricoMartin"
        className="card p-6"
      >
        <h2 className="flex items-center gap-2 text-lg font-semibold">
          <Building2 className="size-5 text-[var(--brand-dark)]" />
          Coordonnées de BricoMartin
        </h2>

        <address className="mt-4 not-italic">
          <p className="text-base font-semibold text-neutral-900">
            {SHOP.name} — outillage professionnel pour le BTP
          </p>
          <p className="mt-2 text-sm text-neutral-700">
            {SHOP.addressLine1}
            <br />
            {SHOP.postalCode} {SHOP.city}, {SHOP.country}
          </p>
          <p className="mt-3 grid gap-2 text-sm text-neutral-700 sm:grid-cols-2">
            <span className="flex items-center gap-2">
              <Phone className="size-4 text-[var(--brand-dark)]" />
              <a
                href={`tel:${SHOP.phoneTel}`}
                className="hover:text-[var(--brand-dark)]"
              >
                {SHOP.phone}
              </a>
            </span>
            <span className="flex items-center gap-2">
              <Mail className="size-4 text-[var(--brand-dark)]" />
              <a
                href={`mailto:${SHOP.email}`}
                className="hover:text-[var(--brand-dark)]"
              >
                {SHOP.email}
              </a>
            </span>
          </p>
          <p className="mt-3 flex items-center gap-2 text-sm text-neutral-600">
            <Clock className="size-4 text-[var(--brand-dark)]" />
            {SHOP.hours}
          </p>
        </address>

        <div className="mt-6 grid gap-3 sm:grid-cols-3">
          <a
            href={`tel:${SHOP.phoneTel}`}
            className="card flex flex-col items-start gap-1 p-4 hover:border-[var(--brand)]/40"
          >
            <span className="text-[var(--brand-dark)]">
              <Phone className="size-5" />
            </span>
            <span className="text-xs font-medium text-neutral-500 uppercase">
              Téléphone
            </span>
            <span className="text-sm font-medium text-neutral-900">
              {SHOP.phone}
            </span>
          </a>
          <a
            href={`mailto:${SHOP.email}`}
            className="card flex flex-col items-start gap-1 p-4 hover:border-[var(--brand)]/40"
          >
            <span className="text-[var(--brand-dark)]">
              <Mail className="size-5" />
            </span>
            <span className="text-xs font-medium text-neutral-500 uppercase">
              Email
            </span>
            <span className="text-sm font-medium break-all text-neutral-900">
              {SHOP.email}
            </span>
          </a>
          <a
            href="https://www.google.com/maps/search/?api=1&query=15+rue+des+Artisans+33000+Bordeaux"
            target="_blank"
            rel="noopener noreferrer"
            className="card flex flex-col items-start gap-1 p-4 hover:border-[var(--brand)]/40"
          >
            <span className="text-[var(--brand-dark)]">
              <MapPin className="size-5" />
            </span>
            <span className="text-xs font-medium text-neutral-500 uppercase">
              Adresse
            </span>
            <span className="text-sm font-medium text-neutral-900">
              {SHOP.addressLine1}, {SHOP.city}
            </span>
          </a>
        </div>
      </section>

      <section className="space-y-3">
        <h2 className="text-xl font-semibold">Nous écrire depuis votre compte</h2>
        <p className="text-sm text-neutral-600">
          Les clients BricoMartin peuvent ouvrir un ticket support depuis
          leur espace : leur demande est rattachée à leur compte pour un
          suivi plus rapide.
        </p>
        <ContactForm />
      </section>

      <section className="space-y-4">
        <h2 className="text-xl font-semibold">
          Questions fréquentes sur le contact BricoMartin
        </h2>
        <div className="space-y-3">
          {FAQ.map((qa) => (
            <details
              key={qa.question}
              className="group rounded-2xl border border-neutral-200 bg-white p-5 open:shadow-sm"
            >
              <summary className="cursor-pointer list-none text-base font-medium">
                {qa.question}
              </summary>
              <p className="mt-3 text-sm text-neutral-700">{qa.answer}</p>
            </details>
          ))}
        </div>
      </section>
    </div>
  );
}