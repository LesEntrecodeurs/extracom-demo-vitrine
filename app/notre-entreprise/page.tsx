import type { Metadata } from 'next';
import Link from 'next/link';
import { Building2, Sparkles, HandshakeIcon, Truck } from 'lucide-react';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator
} from '@/components/ui/breadcrumb';
import { JsonLd } from '@/components/site/JsonLd';
import { breadcrumbLd, faqLd, webPageLd } from '@/lib/seo';

const PAGE_PATH = '/notre-entreprise';

export const metadata: Metadata = {
  title: 'Notre entreprise — histoire, valeurs et engagements',
  description:
    'Découvrez qui nous sommes : notre histoire, notre métier et nos engagements au service des professionnels.',
  alternates: { canonical: PAGE_PATH }
};

export default function NotreEntreprisePage() {
  const pageLd = webPageLd(
    'Notre entreprise — histoire, valeurs et engagements',
    PAGE_PATH
  );
  const crumbsLd = breadcrumbLd([
    { name: 'Accueil', path: '/' },
    { name: 'Notre entreprise', path: PAGE_PATH }
  ]);
  const faqsLd = faqLd(faqs);

  return (
    <article className="mx-auto max-w-3xl space-y-12">
      <JsonLd data={[pageLd, crumbsLd, faqsLd]} />

      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/">Accueil</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>Notre entreprise</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <header className="space-y-3">
        <p className="text-sm font-medium uppercase tracking-wide text-[var(--brand)]">
          Notre entreprise
        </p>
        <h1 className="text-3xl font-bold md:text-4xl">
          [Accroche — phrase de mission de votre entreprise]
        </h1>
        <p className="text-lg text-neutral-600">
          [Sous-titre d’introduction : ce que vous faites, pour qui, et ce qui
          vous distingue en une ou deux phrases.]
        </p>
      </header>

      <section className="space-y-3">
        <h2 className="text-2xl font-semibold">Notre histoire</h2>
        <p className="leading-relaxed text-neutral-700">
          [Racontez les origines de l’entreprise en quelques lignes : année de
          fondation, contexte de création, étape-clé. 3 à 5 phrases
          suffisent pour poser le décor.]
        </p>
        <p className="leading-relaxed text-neutral-700">
          [Une deuxième étape marquante : un tournant, un agrandissement, une
          nouvelle offre, l’arrivée d’une nouvelle génération…]
        </p>
        <p className="leading-relaxed text-neutral-700">
          [Aujourd’hui : où en êtes-vous, quel est votre positionnement actuel ?]
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="text-2xl font-semibold">Notre métier</h2>
        <p className="leading-relaxed text-neutral-700">
          [Expliquez votre cœur de métier : ce que vous proposez, à quels
          professionnels vous vous adressez, et quel problème vous résolvez
          pour eux.]
        </p>
        <p className="leading-relaxed text-neutral-700">
          [Votre zone de chalandise : locale, régionale, nationale. Les
          éventuelles spécialisations ou secteurs desservis.]
        </p>
      </section>

      <section className="space-y-6">
        <h2 className="text-2xl font-semibold">Nos engagements</h2>
        <p className="leading-relaxed text-neutral-700">
          [Phrase d’introduction à vos engagements — ce qui guide vos
          décisions au quotidien.]
        </p>
        <ul className="grid gap-4 sm:grid-cols-2">
          {engagements.map((e) => (
            <li key={e.title} className="card p-5">
              <span className="text-[var(--brand)]">{e.icon}</span>
              <h3 className="mt-3 text-base font-semibold">{e.title}</h3>
              <p className="mt-1 text-sm text-neutral-600">{e.body}</p>
            </li>
          ))}
        </ul>
      </section>

      <section className="card bg-neutral-50 p-6">
        <h2 className="text-2xl font-semibold">[Nom de l'entreprise] en chiffres</h2>
        <p className="mt-2 text-sm text-neutral-600">
          [Quelques chiffres-clés pour appuyer votre crédibilité. Remplacez les
          valeurs ci-dessous par les vôtres.]
        </p>
        <dl className="mt-6 grid grid-cols-2 gap-6 text-center md:grid-cols-4">
          {chiffres.map((c) => (
            <div key={c.label}>
              <dt className="text-sm text-neutral-500">{c.label}</dt>
              <dd className="mt-1 text-3xl font-bold text-[var(--brand-dark)]">
                [—]
              </dd>
              <p className="mt-1 text-xs text-neutral-500">{c.hint}</p>
            </div>
          ))}
        </dl>
      </section>

      <section className="rounded-lg border border-neutral-200 bg-white p-6 text-center">
        <h2 className="text-xl font-semibold">
          [Phrase d’appel à l’action — envie de travailler avec nous ?]
        </h2>
        <p className="mt-2 text-sm text-neutral-600">
          Découvrez notre catalogue ou échangeons sur vos besoins.
        </p>
        <div className="mt-5 flex flex-wrap justify-center gap-3">
          <Link
            href="/catalogue"
            className="inline-flex items-center justify-center rounded-md bg-[var(--brand)] px-5 py-2.5 text-sm font-medium text-white hover:bg-[var(--brand-dark)]"
          >
            Découvrir le catalogue
          </Link>
          <Link
            href="/contact"
            className="inline-flex items-center justify-center rounded-md border border-neutral-300 px-5 py-2.5 text-sm font-medium hover:bg-neutral-50"
          >
            Nous contacter
          </Link>
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">Questions fréquentes</h2>
        <div className="space-y-4">
          {faqs.map((f, i) => (
            <details
              key={f.question}
              className="rounded-lg border border-neutral-200 bg-white p-4"
              open={i === 0}
            >
              <summary className="cursor-pointer text-base font-medium">
                {f.question}
              </summary>
              <p className="mt-2 text-sm leading-relaxed text-neutral-700">
                {f.answer}
              </p>
            </details>
          ))}
        </div>
      </section>
    </article>
  );
}

const engagements = [
  {
    title: 'Expertise métier',
    body: '[Conseil technique, sélection rigoureuse, accompagnement de proximité…]',
    icon: <Sparkles className="size-6" />
  },
  {
    title: 'Relation de confiance',
    body: '[Tarifs négociés, suivi personnalisé, interlocuteur dédié…]',
    icon: <HandshakeIcon className="size-6" />
  },
  {
    title: 'Logistique fiable',
    body: '[Stocks tenus, délais tenus, livraison adaptée aux pros…]',
    icon: <Truck className="size-6" />
  },
  {
    title: 'Ancrage local',
    body: '[Entreprise implantée, partenaires de proximité, connaissance du terrain…]',
    icon: <Building2 className="size-6" />
  }
];

const chiffres = [
  { label: 'Années d’existence', hint: 'ex. 25 ans' },
  { label: 'Clients pros suivis', hint: 'ex. 1 200' },
  { label: 'Références en catalogue', hint: 'ex. 8 000' },
  { label: 'Délai moyen de livraison', hint: 'ex. 48 h' }
];

const faqs = [
  {
    question: 'Depuis quand [Nom de l’entreprise] existe-t-elle ?',
    answer:
      '[Réponse : année de fondation, contexte, étape marquante. 2-3 phrases.]'
  },
  {
    question: 'À quels professionnels s’adresse votre boutique ?',
    answer:
      '[Réponse : secteurs desservis, typologie de clients (artisans, collectivités, entreprises…), zone géographique.]'
  },
  {
    question: 'Comment obtenir mes tarifs négociés ?',
    answer:
      'Les tarifs personnalisés sont visibles une fois connecté à votre compte pro. La création de compte se fait depuis la page d’inscription.'
  },
  {
    question: 'Où êtes-vous implantés ?',
    answer:
      '[Réponse : ville, région, éventuellement points de retrait ou de livraison couverte.]'
  },
  {
    question: 'Comment vous contacter pour un devis ou une question ?',
    answer:
      'Vous pouvez nous joindre par téléphone, par email ou via le formulaire de la page Contact. Les clients connectés peuvent aussi ouvrir un ticket de support.'
  }
];