import type { Metadata } from 'next';
import Link from 'next/link';
import {
  Award,
  Handshake,
  ShieldCheck,
  Truck
} from 'lucide-react';
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbPage,
  BreadcrumbSeparator
} from '@/components/ui/breadcrumb';
import { JsonLd } from '@/components/site/JsonLd';
import { getContextAction } from '@extracom/site-kit/server';
import { breadcrumbLd, faqLd, webPageLd } from '@/lib/seo';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'À propos',
  description:
    'Découvrez notre entreprise : histoire, engagements et expertise au service des professionnels.',
  alternates: { canonical: '/a-propos' }
};

const engagements = [
  {
    icon: Handshake,
    title: 'Proximité',
    text: 'Un interlocuteur dédié qui connaît votre métier et vos contraintes terrain.'
  },
  {
    icon: Award,
    title: 'Expertise',
    text: '[X] années d’expérience dans [secteur] et une sélection rigoureuse de marques partenaires.'
  },
  {
    icon: Truck,
    title: 'Réactivité',
    text: 'Livraison rapide et stock tenu à jour pour ne pas bloquer vos chantiers.'
  },
  {
    icon: ShieldCheck,
    title: 'Confiance',
    text: 'Tarifs négociés, engagements de service et accompagnement sur la durée.'
  }
];

const chiffres = [
  { value: '[X]', label: 'professionnels accompagnés' },
  { value: '[X] ans', label: "d'expertise" },
  { value: '[X]', label: 'références en catalogue' },
  { value: '[X]', label: 'marques partenaires' }
];

type Faq = {
  question: string;
  answer: string;
  link?: { label: string; href: string };
};

const faqs: Faq[] = [
  {
    question: 'Depuis quand notre entreprise existe-t-elle ?',
    answer:
      'Notre entreprise a été fondée en [année] à [ville]. Depuis, nous avons accompagné plus de [X] professionnels dans leurs approvisionnements, en élargissant progressivement notre catalogue et notre territoire de livraison.'
  },
  {
    question: 'Quels professionnels accompagnons-nous ?',
    answer:
      'Nous accompagnons principalement les [secteurs] : artisans, TPE/PME, établissements publics et grands comptes. Notre offre s’adapte aux usages de chaque profil, du devis ponctuel à la commande récurrente.',
    link: { label: 'Voir le catalogue', href: '/catalogue' }
  },
  {
    question: 'Livrons-nous dans quelle zone géographique ?',
    answer:
      'Nous livrons sur l’ensemble de [territoire] sous 24 à 48h. Pour les destinations plus éloignées, nos délais sont confirmés à la commande et suivis par notre équipe logistique.'
  },
  {
    question: 'Comment devenir client ?',
    answer:
      'La création de compte se fait directement en ligne en quelques minutes. Votre inscription est ensuite validée par notre équipe, qui vous communique vos conditions tarifaires personnalisées.',
    link: { label: 'Créer un compte', href: '/inscription' }
  }
];

export default async function AboutPage() {
  let shopName = 'Boutique';
  try {
    const ctx = await getContextAction();
    shopName = ctx.branding?.name ?? ctx.shopName ?? shopName;
  } catch {
    /* dégrade proprement */
  }

  // questions/réponses avec le nom de marque ancré (GEO) — n’impacte pas l’UI,
  // qui continue d’utiliser `faqs` tel quel pour rester lisible en attendant la
  // personnalisation.
  const faqsWithBrand = faqs.map((f) => ({
    question: f.question.replace('notre entreprise', shopName),
    answer: f.answer
  }));

  const pageLd = webPageLd(
    `À propos · ${shopName}`,
    '/a-propos',
    'Découvrez notre entreprise : histoire, engagements et expertise au service des professionnels.'
  );
  const crumbLd = breadcrumbLd([
    { name: 'Accueil', path: '/' },
    { name: 'À propos', path: '/a-propos' }
  ]);
  const faqSchema = faqLd(faqsWithBrand);

  return (
    <>
      <JsonLd data={pageLd} />
      <JsonLd data={crumbLd} />
      <JsonLd data={faqSchema} />

      <div className="mx-auto max-w-3xl">
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="/">Accueil</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>À propos</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        <header className="mt-6">
          <p className="text-xs font-semibold tracking-[0.2em] text-[var(--brand-dark)] uppercase">
            Notre entreprise
          </p>
          <h1 className="mt-3 font-display text-4xl font-semibold leading-tight md:text-5xl">
            {shopName}, votre partenaire professionnel
          </h1>
          <p className="mt-5 text-lg text-neutral-600">
            {shopName} accompagne les professionnels dans leurs
            approvisionnements depuis [année]. [Phrase d’accroche à
            personnaliser — expliquez en une phrase ce qui vous distingue,
            par exemple « Spécialisés dans [secteur], nous mettons notre
            expertise au service de vos chantiers, ateliers et projets. »]
          </p>
        </header>

        <section className="mt-12 space-y-4">
          <h2 className="text-2xl font-semibold">Notre histoire</h2>
          <p>
            Fondée en [année] à [ville/région], {shopName} est née de la
            rencontre entre [fondateur ou initiative] et le constat que les
            professionnels de [secteur] méritaient un partenaire capable de
            [apport spécifique : proximité, expertise, réactivité].
          </p>
          <p>
            [Racontez le parcours en quelques phrases — étapes clés, pivots,
            croissance, 3 à 5 phrases. Par exemple : « Dès les premières
            années, l’activité s’est structurée autour de [pilier]. En
            [année], [jalon : ouverture, nouveau marché, certification].
            Depuis, nous continuons à grandir en restant fidèles à notre
            exigence de départ. »]
          </p>
          <p>
            Aujourd’hui, {shopName} rassemble [X] collaborateurs et
            accompagne [X] professionnels sur [territoire]. Notre catalogue
            compte plus de [X] références issues de [X] marques
            sélectionnées pour leur fiabilité et leur pertinence sur le
            terrain.
          </p>
        </section>

        <section className="mt-12">
          <h2 className="text-2xl font-semibold">Nos engagements</h2>
          <p className="mt-3 text-neutral-600">
            Quatre principes guident nos relations avec nos clients au
            quotidien.
          </p>
          <ul className="mt-6 grid gap-4 sm:grid-cols-2">
            {engagements.map((e) => {
              const Icon = e.icon;
              return (
                <li key={e.title} className="card p-5">
                  <Icon
                    className="size-6 text-[var(--brand)]"
                    aria-hidden="true"
                  />
                  <p className="mt-3 font-medium">{e.title}</p>
                  <p className="mt-1 text-sm text-neutral-600">{e.text}</p>
                </li>
              );
            })}
          </ul>
        </section>

        <section className="mt-12 rounded-2xl border border-neutral-200 bg-white p-8">
          <h2 className="text-2xl font-semibold">{shopName} en chiffres</h2>
          <dl className="mt-6 grid grid-cols-2 gap-x-6 gap-y-6 sm:grid-cols-4">
            {chiffres.map((c) => (
              <div key={c.label}>
                <dt className="font-display text-2xl font-semibold text-neutral-900">
                  {c.value}
                </dt>
                <dd className="mt-1 text-xs tracking-wide text-neutral-500 uppercase">
                  {c.label}
                </dd>
              </div>
            ))}
          </dl>
          <p className="mt-6 text-xs text-neutral-500">
            Chiffres indicatifs — à ajuster avec vos données réelles.
          </p>
        </section>

        <section className="mt-12 space-y-4">
          <h2 className="text-2xl font-semibold">Notre métier au quotidien</h2>
          <p>
            [Décrivez le quotidien de l’équipe en 2 à 3 phrases : conseil,
            logistique, service après-vente, accompagnement. Par exemple :
            « Notre équipe conseille chaque client sur ses choix
            techniques, prépare les commandes avec soin et suit les
            livraisons jusqu’à la réception. En cas de besoin, un
            interlocuteur dédié reste joignable par téléphone et par
            email. »]
          </p>
          <p>
            Nous travaillons en direct avec [X] marques partenaires pour
            garantir la traçabilité des produits et la stabilité de nos
            conditions tarifaires. Cette relation de confiance avec nos
            fournisseurs se répercute directement sur la qualité de
            service que nous apportons à nos clients.
          </p>
        </section>

        <section className="mt-14 rounded-2xl border border-[var(--brand)]/15 bg-[var(--brand-light)] p-8 text-center">
          <h2 className="text-2xl font-semibold">
            Découvrez notre offre professionnelle
          </h2>
          <p className="mx-auto mt-2 max-w-xl text-neutral-700">
            Parcourez notre catalogue, créez votre compte et accédez à vos
            tarifs négociés en quelques clics.
          </p>
          <div className="mt-5 flex flex-wrap justify-center gap-3">
            <Link href="/catalogue" className="btn-primary">
              Découvrir le catalogue
            </Link>
            <Link href="/contact" className="btn-outline">
              Nous contacter
            </Link>
          </div>
        </section>

        <section className="mt-14">
          <h2 className="text-2xl font-semibold">Questions fréquentes</h2>
          <dl className="mt-6 space-y-6">
            {faqs.map((f) => (
              <div
                key={f.question}
                className="border-b border-neutral-200 pb-6 last:border-b-0"
              >
                <dt className="font-medium">{f.question}</dt>
                <dd className="mt-2 text-sm leading-relaxed text-neutral-600">
                  {f.answer}
                </dd>
                {f.link && (
                  <Link
                    href={f.link.href}
                    className="mt-2 inline-block text-sm font-medium text-[var(--brand-dark)] hover:underline"
                  >
                    {f.link.label} →
                  </Link>
                )}
              </div>
            ))}
          </dl>
        </section>
      </div>
    </>
  );
}