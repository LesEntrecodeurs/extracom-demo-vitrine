import type { Metadata } from 'next';
import { Mail, Phone, MapPin, Clock } from 'lucide-react';
import { ContactForm } from '@/components/site/ContactForm';

export const metadata: Metadata = {
  title: 'Contact',
  description: 'Contactez notre équipe : email, téléphone et adresse.',
  alternates: { canonical: '/contact' }
};

/**
 * Page contact — coordonnées statiques (server-rendered, éditables par l'agent :
 * remplace-les par celles du shop) + un formulaire de ticket support pour les
 * utilisateurs connectés (`<ContactForm/>`, via `useSupport` du kit). Ne pas
 * remplacer l'appel kit par un `fetch` direct.
 */
export default function ContactPage() {
  return (
    <div className="mx-auto max-w-2xl">
      <h1 className="text-2xl font-bold">Nous contacter</h1>
      <p className="mt-2 text-neutral-600">
        Une question sur le catalogue, une commande ou votre compte ? Notre
        équipe vous répond.
      </p>

      {/* Bloc coordonnées : mis en avant tout en haut, accessible aux visiteurs
          non connectés (email cliquable, téléphone cliquable). */}
      <section className="mt-8 rounded-2xl border border-neutral-200 bg-[var(--brand-light)] p-6">
        <h2 className="text-lg font-semibold text-neutral-900">
          Nous joindre directement
        </h2>
        <p className="mt-1 text-sm text-neutral-700">
          Aucun compte n'est requis : utilisez l'un de ces moyens pour nous
          écrire ou nous appeler.
        </p>

        <ul className="mt-5 space-y-4">
          {coordonnees.map((c) => (
            <li key={c.label} className="flex items-start gap-4">
              <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-white text-[var(--brand)] ring-1 ring-[var(--brand)]/20">
                {c.icon}
              </span>
              <div className="min-w-0">
                <p className="text-sm font-medium text-neutral-700">
                  {c.label}
                </p>
                {c.href ? (
                  <a
                    href={c.href}
                    className="mt-0.5 block break-words text-base font-semibold text-neutral-900 hover:text-[var(--brand-dark)]"
                  >
                    {c.value}
                  </a>
                ) : (
                  <p className="mt-0.5 text-base font-semibold text-neutral-900">
                    {c.value}
                  </p>
                )}
              </div>
            </li>
          ))}
          <li className="flex items-start gap-4">
            <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-white text-[var(--brand)] ring-1 ring-[var(--brand)]/20">
              <Clock className="size-5" />
            </span>
            <div className="min-w-0">
              <p className="text-sm font-medium text-neutral-700">Horaires</p>
              <p className="mt-0.5 text-base font-semibold text-neutral-900">
                Du lundi au vendredi, 9h–18h.
              </p>
            </div>
          </li>
        </ul>
      </section>

      <p className="mt-8 text-sm text-neutral-500">
        Clients connectés : vous pouvez aussi nous écrire depuis votre espace
        pour un suivi plus rapide.
      </p>

      <ContactForm />
    </div>
  );
}

// ⤵ Coordonnées à personnaliser pour le shop.
const coordonnees = [
  {
    label: 'Email',
    value: 'contact@exemple.fr',
    href: 'mailto:contact@exemple.fr',
    icon: <Mail className="size-5" />
  },
  {
    label: 'Téléphone',
    value: '01 23 45 67 89',
    href: 'tel:+33123456789',
    icon: <Phone className="size-5" />
  },
  {
    label: 'Adresse',
    value: '1 rue de l’Exemple, 75000 Paris',
    href: undefined,
    icon: <MapPin className="size-5" />
  }
];