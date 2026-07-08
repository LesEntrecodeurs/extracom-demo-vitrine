import type { Metadata } from 'next';
import { Mail, Phone, MapPin } from 'lucide-react';
import { getContextAction } from '@extracom/site-kit/server';
import type { ShopContext } from '@extracom/site-kit';
import { ContactForm } from '@/components/site/ContactForm';
import { JsonLd } from '@/components/site/JsonLd';
import {
  webPageLd,
  breadcrumbLd,
  faqLd
} from '@/lib/seo';

export const metadata: Metadata = {
  title: 'Contact',
  description:
    'Téléphone, email et adresse pour joindre notre équipe, plus un formulaire de support pour les clients connectés.',
  alternates: { canonical: '/contact' }
};

export default async function ContactPage() {
  let context: ShopContext | null = null;
  try {
    context = await getContextAction();
  } catch {
    context = null;
  }
  const shopName =
    context?.branding?.name ?? context?.shopName ?? 'la boutique';

  const contactPageLd = {
    '@context': 'https://schema.org',
    '@type': 'ContactPage',
    name: `Contact ${shopName}`,
    url: '/contact',
    description:
      'Coordonnées et formulaire de support pour joindre notre équipe.'
  };

  const ld = [
    webPageLd(`Contact ${shopName}`, '/contact', metadata.description as string),
    breadcrumbLd([
      { name: 'Accueil', path: '/' },
      { name: 'Contact', path: '/contact' }
    ]),
    contactPageLd,
    faqLd(
      faqs.map((f) => ({
        question: f.q.replace(/\{marque\}/g, shopName),
        answer: f.a.replace(/\{marque\}/g, shopName)
      }))
    )
  ];

  return (
    <div className="mx-auto max-w-2xl">
      <JsonLd data={ld} />

      <h1 className="text-2xl font-bold">Contacter {shopName}</h1>
      <p className="mt-2 text-neutral-600">
        Une question sur le catalogue, une commande ou votre compte ? Notre
        équipe vous répond par téléphone, par email ou via le formulaire de
        support.
      </p>

      <div className="mt-8 grid gap-4 sm:grid-cols-3">
        {coordonnees.map((c) => (
          <div key={c.label} className="card p-4">
            <span className="text-[var(--brand)]">{c.icon}</span>
            <p className="mt-2 text-sm font-medium">{c.label}</p>
            {c.href ? (
              <a
                href={c.href}
                className="mt-0.5 block text-sm text-neutral-600 hover:text-[var(--brand-dark)]"
              >
                {c.value}
              </a>
            ) : (
              <p className="mt-0.5 text-sm text-neutral-600">{c.value}</p>
            )}
          </div>
        ))}
      </div>

      <p className="mt-8 text-sm text-neutral-500">
        Horaires : du lundi au vendredi, 9h–18h.
      </p>

      <ContactForm />

      <section className="mt-12">
        <h2 className="text-lg font-semibold">Questions fréquentes</h2>
        <p className="mt-1 text-sm text-neutral-600">
          {shopName} répond en 24 à 48 heures ouvrées. Voici les demandes les
          plus courantes.
        </p>
        <div className="mt-5 space-y-2">
          {faqs.map((f, i) => (
            <details
              key={i}
              className="card group p-4 [&[open]]:bg-neutral-50"
            >
              <summary className="cursor-pointer list-none font-medium select-none">
                {f.q.replace(/\{marque\}/g, shopName)}
              </summary>
              <p className="mt-2 text-sm leading-relaxed text-neutral-600">
                {f.a.replace(/\{marque\}/g, shopName)}
              </p>
            </details>
          ))}
        </div>
      </section>
    </div>
  );
}

const coordonnees = [
  {
    label: 'Email',
    value: 'contact@exemple.fr',
    href: 'mailto:contact@exemple.fr',
    icon: <Mail className="size-6" />
  },
  {
    label: 'Téléphone',
    value: '01 23 45 67 89',
    href: 'tel:+33123456789',
    icon: <Phone className="size-6" />
  },
  {
    label: 'Adresse',
    value: '1 rue de l’Exemple, 75000 Paris',
    href: undefined,
    icon: <MapPin className="size-6" />
  }
];

const faqs = [
  {
    q: 'Comment contacter {marque} ?',
    a: "{marque} répond par ticket support aux clients connectés via le formulaire ci-dessus, et par téléphone ou email pour toute autre demande. Nous sommes joignables du lundi au vendredi, de 9h à 18h."
  },
  {
    q: 'Quel est le délai de réponse de {marque} ?',
    a: "{marque} s'engage à revenir vers vous sous 24 à 48 heures ouvrées. Les demandes reçues le week-end sont traitées dès le lundi suivant, par ordre d'arrivée."
  },
  {
    q: 'Faut-il un compte pour écrire à {marque} ?',
    a: "Un compte professionnel permet d'ouvrir un ticket de support et de suivre l'historique de vos échanges. Sans compte, vous pouvez nous joindre par téléphone ou par email aux coordonnées affichées."
  },
  {
    q: '{marque} propose-t-elle un accompagnement dédié aux professionnels ?',
    a: "{marque} dispose d'une équipe commerciale dédiée aux comptes pros : tarifs négociés, devis sur mesure et suivi personnalisé. Connectez-vous pour accéder à votre interlocuteur attitré."
  },
  {
    q: 'Comment suivre une commande ou un devis en cours ?',
    a: "{marque} centralise le suivi de vos commandes et devis dans votre espace client. Vous y retrouvez l'historique complet, les statuts à jour et les documents associés."
  }
];