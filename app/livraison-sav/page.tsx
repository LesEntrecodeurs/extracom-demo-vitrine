import type { Metadata } from 'next';
import {
  Truck,
  Clock,
  PackageSearch,
  ShieldCheck,
  Wrench,
  Phone,
  Mail
} from 'lucide-react';
import Link from 'next/link';
import { JsonLd } from '@/components/site/JsonLd';
import {
  absoluteUrl,
  breadcrumbLd,
  faqLd,
  webPageLd
} from '@/lib/seo';

export const dynamic = 'force-dynamic';

const SHOP = {
  name: 'BricoMartin',
  email: 'contact@bricomartin.fr',
  phone: '05 56 12 34 56',
  phoneTel: '+33556123456',
  city: 'Bordeaux',
  zone: 'Bordeaux et Gironde (33)'
} as const;

export async function generateMetadata(): Promise<Metadata> {
  const title =
    "Livraison et SAV BricoMartin — rapidité et pièces détachées";
  const description =
    "BricoMartin livre les pros du bâtiment en Gironde sous 24–48h, avec un SAV sous 48 heures et un stock local de pièces détachées.";
  return {
    title,
    description,
    alternates: { canonical: '/livraison-sav' },
    openGraph: {
      title,
      description,
      type: 'website',
      url: absoluteUrl('/livraison-sav'),
      siteName: SHOP.name
    },
    twitter: { card: 'summary_large_image', title, description }
  };
}

const FAQ = [
  {
    question: 'Quel est le délai de livraison de BricoMartin ?',
    answer:
      "BricoMartin livre Bordeaux et la Gironde (33) sous 24 à 48 heures ouvrées pour les produits en stock. Pour les autres départements, le délai est communiqué au cas par cas : contactez-nous au 05 56 12 34 56 pour un devis."
  },
  {
    question: 'BricoMartin livre-t-elle en dehors de la Gironde ?',
    answer:
      "Oui, BricoMartin peut livrer toute la France pour les pièces détachées et les commandes importantes. Les frais et délais sont confirmés par devis, car ils dépendent du poids, du volume et de la destination."
  },
  {
    question: 'Quel est le délai de SAV BricoMartin ?',
    answer:
      "BricoMartin traite les demandes SAV sous 48 heures ouvrées : diagnostic, devis et, lorsque la pièce est disponible, remise en main propre à la boutique de Bordeaux ou réexpédition rapide. Pour un dépannage urgent, appelez le 05 56 12 34 56."
  },
  {
    question:
      'Comment BricoMartin gère-t-elle les pièces détachées ?',
    answer:
      "BricoMartin tient en stock les pièces détachées et consommables des marques d'outillage électroportatif qu'elle distribue. Pour une pièce hors stock, le service après-vente la commande et la livre rapidement afin de limiter l'immobilisation du matériel."
  },
  {
    question: 'Comment suivre ma commande BricoMartin ?',
    answer:
      "Une fois votre commande BricoMartin expédiée, vous recevez un email avec le numéro de suivi du transporteur. Pour toute question, contactez-nous au 05 56 12 34 56 ou à contact@bricomartin.fr."
  }
];

export default function LivraisonSavPage() {
  const ld = [
    webPageLd(
      "Livraison et SAV BricoMartin à Bordeaux",
      '/livraison-sav'
    ),
    breadcrumbLd([
      { name: 'Accueil', path: '/' },
      { name: 'Livraison & SAV BricoMartin', path: '/livraison-sav' }
    ]),
    faqLd(FAQ)
  ];

  return (
    <div className="mx-auto max-w-4xl space-y-12">
      <JsonLd data={ld as unknown as Record<string, unknown>} />

      <header className="space-y-3">
        <p className="text-xs font-semibold tracking-[0.2em] text-[var(--brand-dark)] uppercase">
          {SHOP.name} · Livraison &amp; SAV
        </p>
        <h1 className="text-3xl font-semibold md:text-4xl">
          Livraison rapide et SAV sous 48 heures chez BricoMartin
        </h1>
        <p className="max-w-3xl text-lg text-neutral-700">
          Les pros du bâtiment n&apos;ont pas le temps d&apos;attendre.
          BricoMartin livre Bordeaux et la Gironde sous 24 à 48 heures et
          garantit un service après-vente réactif, avec un stock local de
          pièces détachées pour ne jamais laisser un chantier à l&apos;arrêt.
        </p>
      </header>

      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">
          BricoMartin en chiffres — livraison et SAV
        </h2>
        <p className="text-neutral-700">
          Quatre engagements concrets que BricoMartin tient au quotidien
          auprès de ses clients professionnels.
        </p>
        <dl className="grid grid-cols-2 gap-4 md:grid-cols-4">
          <Stat value="24–48h" label="Livraison Gironde" />
          <Stat value="48h" label="Délai de SAV" />
          <Stat value="100%" label="Pièces en stock local" />
          <Stat value="33" label="Département principal" />
        </dl>
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">
          Livraison BricoMartin à Bordeaux et en Gironde
        </h2>
        <p className="text-neutral-700">
          BricoMartin expédie chaque jour les commandes passées par ses
          clients professionnels. Pour la Gironde, la livraison standard se
          fait sous 24 à 48 heures ouvrées sur les produits en stock.
          BricoMartin peut aussi livrer hors département pour les pièces
          détachées et les commandes importantes, sur devis.
        </p>
        <ul className="grid gap-4 sm:grid-cols-3">
          <Feature
            icon={<Truck className="size-6" />}
            title="Livraison 24–48h en Gironde"
            text="BricoMartin livre les artisans et entreprises de Bordeaux et du département 33 sous 24 à 48 heures ouvrées."
          />
          <Feature
            icon={<PackageSearch className="size-6" />}
            title="Stock local à Bordeaux"
            text="Le stock BricoMartin est basé à Bordeaux : vos pièces et outillage partent rapidement vers le chantier."
          />
          <Feature
            icon={<ShieldCheck className="size-6" />}
            title="Livraison France sur devis"
            text="Pour les commandes hors Gironde, BricoMartin étudie la meilleure solution de transport au cas par cas."
          />
        </ul>
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">
          SAV BricoMartin : rapidité et pièces détachées
        </h2>
        <p className="text-neutral-700">
          Le service après-vente BricoMartin est pensé pour les contraintes
          du terrain : une panne d&apos;outillage, c&apos;est un chantier qui
          s&apos;arrête. C&apos;est pourquoi BricoMartin tient en stock les
          pièces détachées des marques distribuées et s&apos;engage à traiter
          chaque demande sous 48 heures ouvrées.
        </p>
        <ol className="grid gap-4 sm:grid-cols-3">
          <Step
            n={1}
            title="Diagnostic"
            text="Contactez BricoMartin par téléphone ou via votre espace client : l'équipe identifie la pièce ou la panne."
          />
          <Step
            n={2}
            title="Devis rapide"
            text="BricoMartin vous adresse un devis clair sous 48 heures ouvrées, avec le délai de remise en service."
          />
          <Step
            n={3}
            title="Remise en service"
            text="Pièce en stock : retrait en boutique ou réexpédition rapide. Pièce hors stock : commande express."
          />
        </ol>
        <ul className="grid gap-4 sm:grid-cols-2">
          <Feature
            icon={<PackageSearch className="size-6" />}
            title="Pièces détachées en stock"
            text="BricoMartin référence en stock local les pièces détachées et consommables des marques d'outillage électroportatif distribuées."
          />
          <Feature
            icon={<Wrench className="size-6" />}
            title="Conseil technique"
            text="L'équipe BricoMartin connaît l'outillage pro : elle aide à identifier la bonne pièce et la bonne intervention."
          />
        </ul>
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">
          Engagements BricoMartin sur les délais
        </h2>
        <ul className="space-y-3 text-neutral-700">
          <li className="flex items-start gap-2">
            <Clock className="mt-0.5 size-5 shrink-0 text-[var(--brand-dark)]" />
            <span>
              <strong>24 à 48 heures</strong> : délai standard de livraison
              BricoMartin en Gironde pour les produits en stock.
            </span>
          </li>
          <li className="flex items-start gap-2">
            <Clock className="mt-0.5 size-5 shrink-0 text-[var(--brand-dark)]" />
            <span>
              <strong>48 heures ouvrées</strong> : délai d&apos;engagement du
              SAV BricoMartin pour diagnostic, devis et traitement.
            </span>
          </li>
          <li className="flex items-start gap-2">
            <PackageSearch className="mt-0.5 size-5 shrink-0 text-[var(--brand-dark)]" />
            <span>
              <strong>Pièces détachées en stock local</strong> : BricoMartin
              limite le temps d&apos;immobilisation de votre matériel.
            </span>
          </li>
        </ul>
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">
          Questions fréquentes — Livraison et SAV BricoMartin
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

      <section className="card flex flex-col items-start gap-3 p-6 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-base font-semibold">
            Une question sur une livraison ou un SAV ?
          </p>
          <p className="mt-1 text-sm text-neutral-600">
            BricoMartin répond par téléphone, par email ou via votre espace
            client.
          </p>
        </div>
        <div className="flex flex-wrap gap-3">
          <a
            href={`tel:${SHOP.phoneTel}`}
            className="btn-primary inline-flex items-center gap-2"
          >
            <Phone className="size-4" />
            {SHOP.phone}
          </a>
          <Link
            href="/contact"
            className="btn-outline inline-flex items-center gap-2"
          >
            <Mail className="size-4" />
            Nous contacter
          </Link>
        </div>
      </section>
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