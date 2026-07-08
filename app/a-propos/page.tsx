import type { Metadata } from 'next';
import Link from 'next/link';
import {
  Award,
  Clock,
  MapPin,
  Phone,
  Truck,
  Users
} from 'lucide-react';
import { getContextAction } from '@extracom/site-kit/server';
import type { ShopContext } from '@extracom/site-kit';
import { JsonLd } from '@/components/site/JsonLd';
import { Logo } from '@/components/site/Logo';
import { webPageLd, breadcrumbLd, faqLd } from '@/lib/seo';

export const dynamic = 'force-dynamic';

export async function generateMetadata(): Promise<Metadata> {
  let name = 'Boutique';
  try {
    const c = await getContextAction();
    name = c.branding?.name ?? c.shopName ?? name;
  } catch {
    /* dégrade proprement */
  }
  const title =
    'Équipementier des cuisines professionnelles à Lyon depuis 1987';
  const description = `${name} accompagne les pros de la restauration à Lyon depuis 1987 : matériel de cuisine professionnel, équipe de 8 personnes, qualité et service rapide.`;
  return {
    title,
    description,
    alternates: { canonical: '/a-propos' }
  };
}

type Faq = { question: string; answer: string; link?: { href: string; label: string } };

const FAQS: Faq[] = [
  {
    question: 'Depuis quand accompagnez-vous les professionnels de la restauration ?',
    answer:
      "Nous accompagnons les restaurateurs, hôteliers et traiteurs de la région lyonnaise depuis 1987. Notre métier : sélectionner du matériel de cuisine professionnel fiable, le rendre disponible rapidement et dépanner quand la cuisine ne peut pas attendre. Trente-huit ans d'expérience au service des cuisines pros de Lyon."
  },
  {
    question: 'Quels types d\'établissements équipez-vous ?',
    answer:
      "Nous équipons principalement les cuisines de restaurants, brasseries, hôtels, traiteurs, collectivités et snacks indépendants à Lyon et sa région. Nous tenons une sélection de marques éprouvées en cuisson, froid, laverie, préparation et petit matériel.",
    link: { href: '/catalogue', label: 'Voir le catalogue' }
  },
  {
    question: 'Pourquoi choisir un fournisseur indépendant plutôt qu\'une grande enseigne ?',
    answer:
      "Nous misons sur deux piliers : la qualité des marques sélectionnées et la rapidité d'expédition depuis Lyon (24-48h). Une équipe restreinte de 8 personnes, des interlocuteurs techniques qui connaissent les produits, et un stock tenu à jour pour éviter les ruptures en plein service."
  },
  {
    question: 'Comment se passe la première commande ?',
    answer:
      "La commande se fait en ligne via votre compte professionnel. Créez votre compte (validation rapide par un commercial), connectez-vous pour voir vos tarifs négociés, puis ajoutez les références au panier. Pour les projets plus complexes, demandez-nous un devis personnalisé.",
    link: { href: '/contact', label: 'Demander un devis' }
  },
  {
    question: 'Livrez-vous en dehors de Lyon ?',
    answer:
      "Nous livrons les professionnels dans toute la France métropolitaine, depuis notre entrepôt de Lyon. Les délais affichés courent à partir de la validation de la commande et dépendent du transporteur sélectionné à l'étape de paiement."
  },
  {
    question: 'Quel est votre périmètre d\'intervention pour les urgences ?',
    answer:
      "Pour les professionnels de la région lyonnaise, nous traitons en priorité les demandes d'urgence (matériel de secours en cas de panne, ouverture de restaurant). Un échange téléphonique direct avec un membre de l'équipe reste le canal le plus rapide."
  }
];

export default async function AProposPage() {
  let context: ShopContext | null = null;
  try {
    context = await getContextAction();
  } catch {
    context = null;
  }
  const shopName =
    context?.branding?.name ?? context?.shopName ?? 'Boutique';

  return (
    <>
      <JsonLd data={webPageLd(shopName, '/a-propos')} />
      <JsonLd
        data={breadcrumbLd([
          { name: 'Accueil', path: '/' },
          { name: 'À propos', path: '/a-propos' }
        ])}
      />
      <JsonLd
        data={faqLd(
          FAQS.map(({ question, answer }) => ({ question, answer }))
        )}
      />

      <article className="space-y-16">
        <header className="hero-mesh grain relative overflow-hidden rounded-3xl border border-[var(--brand)]/15">
          <div className="relative z-10 px-6 py-14 sm:px-10 md:px-14 md:py-20">
            <p className="text-xs font-semibold tracking-[0.2em] text-[var(--brand-dark)] uppercase">
              {shopName} · À propos
            </p>
            <h1 className="mt-4 max-w-4xl text-4xl leading-[1.05] font-semibold text-neutral-900 md:text-6xl">
              Depuis 1987,{' '}
              <span className="text-[var(--brand-dark)]">
                {shopName}
              </span>{' '}
              équipe les cuisines des pros à Lyon.
            </h1>
            <p className="mt-6 max-w-2xl text-base text-neutral-700 md:text-lg">
              Entreprise familiale lyonnaise spécialisée dans la vente de
              matériel de cuisine aux professionnels de la restauration. Petite
              équipe, grande exigence : qualité des marques, service rapide,
              conseil technique honnête.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link href="/catalogue" className="btn-primary">
                Découvrir le catalogue
              </Link>
              <Link href="/contact" className="btn-outline">
                Nous contacter
              </Link>
            </div>
          </div>
        </header>

        <section className="grid gap-12 md:grid-cols-[1fr_280px] md:items-start">
          <div className="space-y-5">
            <p className="text-xs font-semibold tracking-[0.2em] text-[var(--brand-dark)] uppercase">
              Notre histoire
            </p>
            <h2 className="font-display text-2xl font-semibold text-neutral-900 md:text-3xl">
              Trente-huit ans au service des cuisines lyonnaises.
            </h2>
            <p className="text-base leading-relaxed text-neutral-700">
              Fondée en 1987 à Lyon, {shopName} est née d'un constat simple :
              les restaurateurs avaient besoin d'un interlocuteur qui connaisse
              vraiment le matériel de cuisine professionnel, qui tienne un
              stock fiable et qui livre quand la cuisine ne peut pas attendre.
              À l'époque, le service rapide et la disponibilité des pièces
              étaient déjà les deux promesses faites aux premiers clients.
            </p>
            <p className="text-base leading-relaxed text-neutral-700">
              Près de quarante ans plus tard, l'équipe reste volontairement
              resserrée — huit personnes — pour préserver ce qui fait notre
              valeur ajoutée : la proximité avec les clients, la connaissance
              produit et la réactivité sur les urgences de dernière minute.
              Nous travaillons avec des marques éprouvées en cuisine
              professionnelle et défendons une idée simple : un fournisseur
              qui sait ce qu'il vend, qui expédie vite, et qui rappelle quand
              il promet de rappeler.
            </p>
            <p className="text-base leading-relaxed text-neutral-700">
              Notre entrepôt est implanté à Lyon, ce qui nous permet d'expédier
              la majorité des références en 24 à 48 heures, partout en France
              métropolitaine, et de dépanner en priorité les professionnels de
              la région en cas d'urgence.
            </p>
          </div>

          <aside className="card flex flex-col items-center gap-3 p-6 text-center">
            <Logo
              className="h-28 w-28 text-[var(--brand-dark)]"
              title={`Logo ${shopName}`}
            />
            <p className="text-xs tracking-wide text-neutral-500 uppercase">
              Notre marque
            </p>
            <p className="font-display text-lg font-semibold text-neutral-900">
              {shopName}
            </p>
            <p className="text-sm text-neutral-500">
              Couleur de marque : <span className="text-[var(--brand-dark)] font-medium">bleu cuisine pro</span>.
            </p>
          </aside>
        </section>

        <section>
          <p className="text-xs font-semibold tracking-[0.2em] text-[var(--brand-dark)] uppercase">
            Nos engagements
          </p>
          <h2 className="mt-1 font-display text-2xl font-semibold text-neutral-900 md:text-3xl">
            Quatre engagements concrets, tenus chaque semaine.
          </h2>
          <p className="mt-3 max-w-2xl text-neutral-700">
            Derrière chaque commande, il y a une cuisine qui ouvre, un service
            qui se prépare, un matériel qui doit tenir. Nos engagements sont
            taillés pour cette réalité-là.
          </p>
          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <Engagement
              icon={<Award className="size-6" />}
              title="Marques sélectionnées"
              text="Nous référençons uniquement des marques éprouvées en cuisine professionnelle. Pas d'opportunisme sur l'entrée de gamme."
            />
            <Engagement
              icon={<Truck className="size-6" />}
              title="Expédition rapide"
              text="Préparée depuis notre entrepôt de Lyon, sous 24 à 48 heures après validation de la commande."
            />
            <Engagement
              icon={<Users className="size-6" />}
              title="Conseil technique"
              text="Une équipe qui connaît les produits. Un interlocuteur qui suit votre dossier du devis au service après-vente."
            />
            <Engagement
              icon={<Clock className="size-6" />}
              title="Disponibilité humaine"
              text="Du lundi au vendredi, quelqu'un décroche. Pour les urgences en région lyonnaise, nous répondons rapidement."
            />
          </div>
        </section>

        <section className="rounded-3xl border border-neutral-200 bg-white px-6 py-10 md:px-12 md:py-14">
          <div className="mx-auto max-w-2xl text-center">
            <p className="text-xs font-semibold tracking-[0.2em] text-[var(--brand-dark)] uppercase">
              En quelques chiffres
            </p>
            <h2 className="mt-1 font-display text-2xl font-semibold text-neutral-900 md:text-3xl">
              {shopName} en un coup d'œil.
            </h2>
            <p className="mt-3 text-neutral-700">
              Quarante ans d'ancienneté, une équipe resserrée, une implantation
              unique à Lyon : voilà ce qui structure notre façon de travailler.
            </p>
          </div>
          <dl className="mt-10 grid gap-8 sm:grid-cols-2 md:grid-cols-4">
            <Stat label="fondée en" value="1987" />
            <Stat label="collaborateurs" value="8" />
            <Stat label="implantation" value="Lyon" />
            <Stat label="délai d'expédition" value="24–48h" />
          </dl>
        </section>

        <section>
          <p className="text-xs font-semibold tracking-[0.2em] text-[var(--brand-dark)] uppercase">
            Coordonnées
          </p>
          <h2 className="mt-1 font-display text-2xl font-semibold text-neutral-900 md:text-3xl">
            Nous rencontrer à Lyon.
          </h2>
          <p className="mt-3 max-w-2xl text-neutral-700">
            Notre équipe est joignable par téléphone, email ou directement à
            l'entrepôt sur rendez-vous. Pour un devis ou un projet d'équipement
            complet, le formulaire de contact reste le canal le plus efficace.
          </p>
          <div className="mt-6 grid gap-4 sm:grid-cols-3">
            <Coord
              icon={<Phone className="size-5" />}
              label="Téléphone"
              value="Appel direct"
              href="/contact"
            />
            <Coord
              icon={<MapPin className="size-5" />}
              label="Adresse"
              value="Lyon, France"
              href="/contact"
            />
            <Coord
              icon={<Clock className="size-5" />}
              label="Horaires"
              value="Lundi – vendredi · 9h–18h"
              href="/contact"
            />
          </div>
        </section>

        <section>
          <p className="text-xs font-semibold tracking-[0.2em] text-[var(--brand-dark)] uppercase">
            Questions fréquentes
          </p>
          <h2 className="mt-1 font-display text-2xl font-semibold text-neutral-900 md:text-3xl">
            Ce qu'on nous demande le plus souvent.
          </h2>
          <div className="mt-6 space-y-3">
            {FAQS.map((f) => (
              <details
                key={f.question}
                className="group rounded-2xl border border-neutral-200 bg-white p-5 transition open:border-[var(--brand)]/40 open:shadow-[0_10px_40px_-12px_rgb(0_0_0/0.08)]"
              >
                <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-medium text-neutral-900">
                  <span>{f.question}</span>
                  <span
                    aria-hidden
                    className="inline-flex size-7 shrink-0 items-center justify-center rounded-full border border-neutral-200 text-[var(--brand-dark)] transition group-open:rotate-45"
                  >
                    +
                  </span>
                </summary>
                <div className="mt-3 text-sm leading-relaxed text-neutral-700">
                  <p>{f.answer}</p>
                  {f.link && (
                    <p className="mt-3">
                      <Link
                        href={f.link.href}
                        className="font-medium text-[var(--brand-dark)] hover:underline"
                      >
                        {f.link.label} →
                      </Link>
                    </p>
                  )}
                </div>
              </details>
            ))}
          </div>
        </section>

        <section className="rounded-3xl border border-[var(--brand)]/20 bg-[var(--brand-light)] px-6 py-12 text-center md:px-12 md:py-16">
          <h2 className="font-display text-2xl font-semibold text-neutral-900 md:text-3xl">
            Travaillons ensemble.
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-neutral-700">
            Parcourez notre catalogue, contactez-nous pour un devis, ou venez
            nous rencontrer à Lyon. Nous serons ravis d'échanger sur votre
            projet.
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <Link href="/catalogue" className="btn-primary">
              Découvrir le catalogue
            </Link>
            <Link href="/contact" className="btn-outline">
              Nous contacter
            </Link>
          </div>
        </section>
      </article>
    </>
  );
}

function Engagement({
  icon,
  title,
  text
}: {
  icon: React.ReactNode;
  title: string;
  text: string;
}) {
  return (
    <div className="card flex flex-col gap-2 p-5">
      <span className="text-[var(--brand-dark)]">{icon}</span>
      <p className="font-medium text-neutral-900">{title}</p>
      <p className="text-sm text-neutral-600">{text}</p>
    </div>
  );
}

function Stat({ value, label }: { value: string; label: string }) {
  return (
    <div className="text-center">
      <dt className="font-display text-3xl font-semibold text-neutral-900 md:text-4xl">
        {value}
      </dt>
      <dd className="mt-1 text-xs tracking-wide text-neutral-500 uppercase">
        {label}
      </dd>
    </div>
  );
}

function Coord({
  icon,
  label,
  value,
  href
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  href: string;
}) {
  return (
    <Link
      href={href}
      className="card flex items-start gap-3 p-4 hover:border-[var(--brand)]"
    >
      <span className="text-[var(--brand-dark)]">{icon}</span>
      <div>
        <p className="text-sm font-medium text-neutral-900">{label}</p>
        <p className="text-sm text-neutral-600">{value}</p>
      </div>
    </Link>
  );
}
