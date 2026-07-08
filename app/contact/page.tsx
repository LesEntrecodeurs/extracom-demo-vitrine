import type { Metadata } from 'next';
import Link from 'next/link';
import { Mail, Phone, MapPin, Clock } from 'lucide-react';
import { ContactForm } from '@/components/site/ContactForm';
import { JsonLd } from '@/components/site/JsonLd';
import { shopInfo } from '@/data/shop';
import { webPageLd, breadcrumbLd } from '@/lib/seo';

export const metadata: Metadata = {
  title: 'Contact',
  description:
    "Contactez l'équipe de la boutique : adresse, téléphone, email et horaires. Réponse rapide aux professionnels et particuliers.",
  alternates: { canonical: '/contact' }
};

export default function ContactPage() {
  return (
    <div className="mx-auto max-w-2xl">
      <JsonLd
        data={webPageLd(
          'Contact',
          '/contact',
          'Coordonnées et formulaire de contact de la boutique'
        )}
      />
      <JsonLd
        data={breadcrumbLd([
          { name: 'Accueil', path: '/' },
          { name: 'Contact', path: '/contact' }
        ])}
      />

      <h1 className="text-2xl font-bold">Nous contacter</h1>
      <p className="mt-2 text-neutral-600">
        Une question sur le catalogue, une commande ou votre compte ? Notre
        équipe vous répond.
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

      <div className="mt-6 flex items-start gap-3 rounded-lg border border-neutral-200 bg-white p-4 text-sm text-neutral-600">
        <Clock className="mt-0.5 size-5 shrink-0 text-[var(--brand)]" />
        <div>
          <p className="font-medium text-neutral-800">Nos horaires</p>
          <p>Du lundi au samedi, de 8h à 18h. Boutique physique au même adresse.</p>
          <p className="mt-1 text-neutral-500">
            Livraison en {shopInfo.serviceArea} {shopInfo.deliveryPromise.toLowerCase()}.
          </p>
        </div>
      </div>

      <p className="mt-6 text-sm">
        Besoin de l'historique de vos commandes ? Connectez-vous à votre{' '}
        <Link href="/compte" className="text-[var(--brand-dark)] hover:underline">
          espace client
        </Link>
        .
      </p>

      <ContactForm />
    </div>
  );
}

const coordonnees = [
  {
    label: 'Email',
    value: shopInfo.email,
    href: `mailto:${shopInfo.email}`,
    icon: <Mail className="size-6" />
  },
  {
    label: 'Téléphone',
    value: shopInfo.phone,
    href: `tel:${shopInfo.phoneTel}`,
    icon: <Phone className="size-6" />
  },
  {
    label: 'Adresse',
    value: `${shopInfo.address.street}, ${shopInfo.address.postalCode} ${shopInfo.address.city}`,
    href: undefined,
    icon: <MapPin className="size-6" />
  }
];
