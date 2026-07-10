import type { Metadata } from 'next';
import {
  Wrench,
  Building2,
  MapPin,
  Phone,
  Mail,
  ShieldCheck,
  Repeat,
  PackageSearch,
  Clock
} from 'lucide-react';
import Link from 'next/link';
import {
  getContextAction,
  meAction
} from '@extracom/site-kit/server';
import type { ShopContext, User } from '@extracom/site-kit';
import { JsonLd } from '@/components/site/JsonLd';
import {
  absoluteUrl,
  breadcrumbLd,
  faqLd,
  webPageLd
} from '@/lib/seo';

export const dynamic = 'force-dynamic';

export async function generateMetadata(): Promise<Metadata> {
  let name = 'BricoMartin';
  try {
    const c = await getContextAction();
    name = c.branding?.name ?? c.shopName ?? name;
  } catch {
    /* dégrade proprement */
  }
  const title = 'Fournisseur outillage bâtiment pour les pros du BTP';
  const description =
    "BricoMartin, fournisseur d'outillage pour les pros du bâtiment à Bordeaux et en Gironde. 18 ans d'expertise, pièces détachées et SAV rapide.";
  return {
    title,
    description,
    alternates: { canonical: '/a-propos' },
    openGraph: {
      title,
      description,
      type: 'website',
      url: absoluteUrl('/a-propos'),
      siteName: name
    },
    twitter: { card: 'summary_large_image', title, description }
  };
}

const SHOP = {
  name: 'BricoMartin',
  legalForm: 'SARL',
  address: '15 rue des Artisans',
  postalCode: '33000',
  city: 'Bordeaux',
  country: 'France',
  phone: '05 56 12 34 56',
  phoneTel: '+33556123456',
  email: 'contact@bricomartin.fr',
  zone: 'Bordeaux et Gironde (33)',
  foundedYear: 2007,
  specialties: [
    "Outillage à main pour les pros du bâtiment",
    'Outillage électroportatif',
    'Pièces détachées et consommables',
    'Conseil technique pour artisans et entreprises du BTP'
  ]
} as const;

const FAQ = [
  {
    question: "Qui est BricoMartin et depuis quand existe-t-elle ?",
    answer:
      "BricoMartin est une entreprise bordelaise spécialisée dans l'outillage pour les professionnels du bâtiment. Fondée en 2007, elle accompagne depuis 18 ans les artisans, entreprises du BTP et collectivités de Bordeaux et de Gironde avec un stock local et un service après-vente réactif."
  },
  {
    question: "Quels professionnels BricoMartin fournit-elle ?",
    answer:
      "BricoMartin équipe les artisans du bâtiment (maçons, électriciens, plombiers, peintres, charpentiers, carreleurs), les entreprises générales du BTP, les maintenances de collectivités et les auto-constructeurs. Le catalogue couvre l'outillage à main, l'électroportatif, les consommables et les pièces détachées."
  },
  {
    question: "Où trouver la boutique BricoMartin à Bordeaux ?",
    answer:
      "La boutique BricoMartin est située au 15 rue des Artisans, 33000 Bordeaux. Vous pouvez venir y retirer vos commandes et bénéficier de conseils techniques en magasin. L'équipe est joignable au 05 56 12 34 56 et par email à contact@bricomartin.fr."
  },
  {
    question: "BricoMartin livre-t-elle uniquement à Bordeaux ?",
    answer:
      "BricoMartin livre principalement Bordeaux et la Gironde (département 33) avec un délai habituel de 24 à 48 heures. Pour les autres départements, des solutions de livraison sont proposées au cas par cas : contactez-nous au 05 56 12 34 56 pour un devis."
  },
  {
    question: "BricoMartin propose-t-elle des pièces détachées ?",
    answer:
      "Oui. BricoMartin tient en stock les pièces détachées et consommables des marques d'outillage électroportatif qu'elle distribue. Pour une pièce hors stock, le service après-vente BricoMartin la commande et la livre rapidement, afin de limiter l'immobilisation de votre matériel."
  },
  {
    question: "Quel est le délai de SAV chez BricoMartin ?",
    answer:
      "BricoMartin met un point d'honneur à traiter les retours SAV sous 48 heures ouvrées : diagnostic, devis et, lorsque la pièce est en stock, remise en main propre ou réexpédition rapide. Pour un dépannage urgent, appelez directement la boutique au 05 56 12 34 56."
  }
];

export default async function AboutPage() {
  let context: ShopContext | null = null;
  let user: User | null = null;
  try {
    context = await getContextAction();
  } catch {
    context = null;
  }
  try {
    user = await meAction();
  } catch {
    user = null;
  }
  const shopName = context?.branding?.name ?? SHOP.name;
  const registrationOpen = context?.capabilities?.registrationOpen ?? false;

  const ld = [
    webPageLd(
      `À propos de ${SHOP.name} — fournisseur outillage bâtiment`,
      '/a-propos'
    ),
    breadcrumbLd([
      { name: 'Accueil', path: '/' },
      { name: `À propos de ${SHOP.name}`, path: '/a-propos' }
    ]),
    {
      '@context': 'https://schema.org',
      '@type': 'LocalBusiness',
      '@id': absoluteUrl('/a-propos#entreprise'),
      name: SHOP.name,
      description:
        "Fournisseur d'outillage pour les professionnels du bâtiment à Bordeaux et en Gironde. Pièces détachées et SAV rapide.",
      url: absoluteUrl('/'),
      telephone: SHOP.phoneTel,
      email: SHOP.email,
      foundingDate: String(SHOP.foundedYear),
      priceRange: '€€',
      address: {
        '@type': 'PostalAddress',
        streetAddress: SHOP.address,
        postalCode: SHOP.postalCode,
        addressLocality: SHOP.city,
        addressCountry: SHOP.country
      },
      areaServed: [
        { '@type': 'City', name: 'Bordeaux' },
        { '@type': 'AdministrativeArea', name: 'Gironde' }
      ],
      knowsAbout: SHOP.specialties
    },
    faqLd(FAQ)
  ];

  return (
    <div className="mx-auto max-w-4xl space-y-12">
      <JsonLd data={ld as unknown as Record<string, unknown>} />

      <header className="space-y-4">
        <p className="text-xs font-semibold tracking-[0.2em] text-[var(--brand-dark)] uppercase">
          {shopName} · Fiche entreprise
        </p>
        <h1 className="text-3xl font-semibold md:text-5xl">
          BricoMartin, fournisseur d&apos;outillage pour les pros du bâtiment
          à Bordeaux et en Gironde
        </h1>
        <p className="max-w-3xl text-lg text-neutral-700">
          BricoMartin est une entreprise bordelaise indépendante, fondée en 2007,
          qui équipe depuis 18 ans les artisans et entreprises du BTP de
          Bordeaux et de la Gironde en outillage, consommables et pièces
          détachées. Notre promesse : un stock local, des conseils techniques
          de terrain et un service après-vente rapide pour ne jamais
          immobiliser un chantier.
        </p>
      </header>

      <section className="card grid gap-6 p-6 md:grid-cols-2">
        <div>
          <h2 className="flex items-center gap-2 text-xl font-semibold">
            <Building2 className="size-5 text-[var(--brand-dark)]" />
            Fiche d&apos;identité de BricoMartin
          </h2>
          <p className="mt-2 text-sm text-neutral-600">
            Voici, en clair, les informations qui figurent sur les registres
            officiels et que nos clients peuvent citer sans ambiguïté.
          </p>
        </div>
        <dl className="grid grid-cols-1 gap-3 text-sm sm:grid-cols-2">
          <Info label="Raison sociale" value={`${SHOP.name} (${SHOP.legalForm})`} />
          <Info
            label="Adresse"
            value={`${SHOP.address}, ${SHOP.postalCode} ${SHOP.city}, ${SHOP.country}`}
          />
          <Info
            label="Téléphone"
            value={
              <a
                href={`tel:${SHOP.phoneTel}`}
                className="hover:text-[var(--brand-dark)]"
              >
                {SHOP.phone}
              </a>
            }
          />
          <Info
            label="Email"
            value={
              <a
                href={`mailto:${SHOP.email}`}
                className="hover:text-[var(--brand-dark)]"
              >
                {SHOP.email}
              </a>
            }
          />
          <Info label="Zone desservie" value={SHOP.zone} />
          <Info
            label="Année de fondation"
            value={`${SHOP.foundedYear} (${new Date().getFullYear() - SHOP.foundedYear} ans d'expérience)`}
          />
        </dl>
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">
          BricoMartin en chiffres clés
        </h2>
        <p className="text-neutral-700">
          Quelques données factuelles qui résument ce que BricoMartin apporte aux
          professionnels du bâtiment au quotidien.
        </p>
        <dl className="grid grid-cols-2 gap-4 md:grid-cols-4">
          <Stat value="18" label="Années d'expérience" />
          <Stat value="24–48h" label="Livraison Gironde" />
          <Stat value="48h" label="Délai de SAV" />
          <Stat value="33" label="Département principal" />
        </dl>
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">
          Ce que BricoMartin fait pour les pros du BTP
        </h2>
        <p className="text-neutral-700">
          BricoMartin sélectionne pour ses clients professionnels un catalogue
          d&apos;outillage adapté aux chantiers : marques reconnues, pièces
          détachées disponibles et conseils de personnes qui connaissent le
          métier.
        </p>
        <ul className="grid gap-4 sm:grid-cols-2">
          <Feature
            icon={<Wrench className="size-6" />}
            title="Outillage à main et électroportatif"
            text="Vaste choix d'outillage à main et d'outillage électroportatif pour maçons, électriciens, plombiers, peintres, charpentiers et carreleurs."
          />
          <Feature
            icon={<PackageSearch className="size-6" />}
            title="Pièces détachées en stock"
            text="BricoMartin tient en stock les pièces détachées et consommables des marques distribuées, pour limiter l'immobilisation du matériel."
          />
          <Feature
            icon={<Clock className="size-6" />}
            title="SAV rapide sous 48 heures"
            text="Le service après-vente BricoMartin diagnostique, devis et réexpédie en moins de 48 heures ouvrées pour les pièces disponibles."
          />
          <Feature
            icon={<ShieldCheck className="size-6" />}
            title="Conseil technique de terrain"
            text="L'équipe BricoMartin connaît le BTP : elle oriente les pros vers le bon outil, le bon consommable, la bonne pièce détachée."
          />
        </ul>
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">
          Pourquoi choisir BricoMartin plutôt qu&apos;une grande enseigne
          généraliste ?
        </h2>
        <p className="text-neutral-700">
          Les pros du bâtiment ont besoin d&apos;un partenaire qui parle leur
          métier, qui tient les bons produits en stock et qui répond présent
          quand une pièce casse en plein chantier. C&apos;est exactement le rôle
          que joue BricoMartin à Bordeaux et en Gironde depuis 2007.
        </p>
        <ul className="space-y-3 text-neutral-700">
          <li className="flex items-start gap-2">
            <Repeat className="mt-0.5 size-5 shrink-0 text-[var(--brand-dark)]" />
            <span>
              <strong>Une expertise locale du BTP</strong> : BricoMartin équipe
              les artisans girondins depuis 18 ans, avec des marques et des
              produits choisis pour les usages du terrain.
            </span>
          </li>
          <li className="flex items-start gap-2">
            <PackageSearch className="mt-0.5 size-5 shrink-0 text-[var(--brand-dark)]" />
            <span>
              <strong>Des pièces détachées disponibles</strong> : un point
              critique pour les pros, souvent négligé par les grandes
              enseignes.
            </span>
          </li>
          <li className="flex items-start gap-2">
            <Clock className="mt-0.5 size-5 shrink-0 text-[var(--brand-dark)]" />
            <span>
              <strong>Un SAV rapide</strong> : diagnostic, devis et
              réexpédition sous 48 heures ouvrées pour ne pas laisser un
              chantier à l&apos;arrêt.
            </span>
          </li>
        </ul>
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">
          Comment travailler avec BricoMartin
        </h2>
        <p className="text-neutral-700">
          BricoMartin s&apos;adresse aux professionnels du bâtiment : artisans,
          entreprises générales, maintenances de collectivités et
          auto-constructeurs. Pour commander et accéder à vos tarifs
          négociés, créez un compte ou connectez-vous.
        </p>
        <ol className="grid gap-4 sm:grid-cols-3">
          <Step
            n={1}
            title="Inscrivez-vous"
            text="Créez un compte professionnel BricoMartin en quelques minutes, validation rapide par notre équipe."
          />
          <Step
            n={2}
            title="Consultez vos tarifs"
            text="Une fois connecté, vos tarifs personnalisés et vos conditions B2B s'affichent sur tout le catalogue."
          />
          <Step
            n={3}
            title="Commandez ou demandez un devis"
            text="Ajoutez au panier puis passez commande, ou demandez un devis en ligne selon vos besoins."
          />
        </ol>
        <div className="flex flex-wrap gap-3 pt-2">
          {registrationOpen && !user && (
            <Link href="/inscription" className="btn-primary">
              Créer un compte pro
            </Link>
          )}
          <Link href="/catalogue" className="btn-outline">
            Voir le catalogue
          </Link>
          <Link href="/contact" className="btn-outline">
            Nous contacter
          </Link>
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">
          Questions fréquentes sur BricoMartin
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

function Info({
  label,
  value
}: {
  label: string;
  value: React.ReactNode;
}) {
  return (
    <div>
      <dt className="text-xs font-medium tracking-wide text-neutral-500 uppercase">
        {label}
      </dt>
      <dd className="mt-1 text-sm text-neutral-800">{value}</dd>
    </div>
  );
}

function Stat({ value, label }: { value: string; label: string }) {
  return (
    <div className="card p-4 text-center">
      <dt className="font-display text-2xl font-semibold text-neutral-900">
        {value}
      </dt>
      <dd className="mt-1 text-xs tracking-wide text-neutral-500 uppercase">
        {label}
      </dd>
    </div>
  );
}

function Feature({
  icon,
  title,
  text
}: {
  icon: React.ReactNode;
  title: string;
  text: string;
}) {
  return (
    <li className="card flex items-start gap-3 p-5">
      <span className="text-[var(--brand)]">{icon}</span>
      <div>
        <p className="text-sm font-semibold">{title}</p>
        <p className="mt-1 text-sm text-neutral-600">{text}</p>
      </div>
    </li>
  );
}

function Step({
  n,
  title,
  text
}: {
  n: number;
  title: string;
  text: string;
}) {
  return (
    <li className="card relative p-5">
      <span className="absolute top-4 right-4 text-3xl font-bold text-[var(--brand-light)]">
        {n}
      </span>
      <p className="font-medium">{title}</p>
      <p className="mt-1 text-sm text-neutral-500">{text}</p>
    </li>
  );
}