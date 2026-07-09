import type { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { Wheat, MapPin, Users, Clock } from 'lucide-react';
import { JsonLd } from '@/components/site/JsonLd';
import { webPageLd, breadcrumbLd, faqLd } from '@/lib/seo';

export const metadata: Metadata = {
  title: 'À propos',
  description:
    'Boulangerie Martin, à Annecy : boulangerie artisanale fondée en 1985. Levain maison, produits locaux, livraison dans un rayon de 30 km.',
  alternates: { canonical: '/a-propos' }
};

/**
 * Page "À propos" — présente la boulangerie (histoire, savoir-faire, équipe,
 * zone de livraison). Page éditoriale indexable.
 *
 * Photo de la boutique : remplacer `public/images/boutique.jpg` par votre
 * photo (format paysage recommandé, ~1600×900 px pour un rendu net).
 */
export default function AProposPage() {
  const ldWebPage = webPageLd(
    'Boulangerie Martin — Notre histoire',
    '/a-propos',
    'Boulangerie artisanale à Annecy, fondée en 1985. Levain maison et produits locaux.'
  );
  const ldBreadcrumb = breadcrumbLd([
    { name: 'Accueil', path: '/' },
    { name: 'À propos', path: '/a-propos' }
  ]);
  const ldFaq = faqLd(faq);

  return (
    <article className="space-y-14">
      <JsonLd data={ldWebPage} />
      <JsonLd data={ldBreadcrumb} />
      <JsonLd data={ldFaq} />

      {/* ── Hero : photo de la boutique ─────────────────────────────────── */}
      <header className="relative overflow-hidden rounded-3xl border border-neutral-200">
        <div className="relative aspect-[16/9] w-full sm:aspect-[21/9]">
          <Image
            src="/images/boutique.jpg"
            alt="La devanture de la Boulangerie Martin à Annecy"
            fill
            priority
            sizes="(max-width: 768px) 100vw, 1200px"
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-black/15 to-transparent" />
          <div className="absolute inset-x-0 bottom-0 p-6 text-white sm:p-10">
            <p className="text-xs font-semibold tracking-[0.2em] uppercase opacity-90">
              Boulangerie Martin · Annecy
            </p>
            <h1 className="mt-3 max-w-2xl text-3xl leading-tight font-semibold sm:text-4xl md:text-5xl">
              Notre histoire, notre levain, notre ville.
            </h1>
          </div>
        </div>
      </header>

      {/* ── Introduction ───────────────────────────────────────────────── */}
      <section className="mx-auto max-w-3xl">
        <p className="text-lg leading-relaxed text-neutral-700">
          La <strong>Boulangerie Martin</strong> est une boulangerie artisanale
          installée au cœur d&apos;Annecy. Depuis 1985, nous pétrissons chaque
          jour au levain naturel et travaillons des produits locaux, pour
          proposer un pain qui a du goût — et une histoire.
        </p>
      </section>

      {/* ── Notre histoire ─────────────────────────────────────────────── */}
      <section className="mx-auto max-w-3xl">
        <h2 className="text-2xl font-semibold">Notre histoire</h2>
        <p className="mt-4 leading-relaxed text-neutral-700">
          Tout commence en 1985, lorsque mes parents ouvrent la boutique avec
          une idée simple : faire du pain comme à la maison, avec de bons
          ingrédients et du temps. Quarante ans plus tard, je tiens toujours la
          boulangerie — désormais épaulé par mes deux fils — et nous n&apos;avons
          rien changé à la recette : du levain maison, de la farine choisie, et
          la patience des levées longues.
        </p>
        <p className="mt-4 leading-relaxed text-neutral-700">
          Ce qui a changé, en revanche, c&apos;est la place de la boutique dans
          le quotidien des Annéciens. Beaucoup de nos clients habitués viennent
          depuis l&apos;ouverture ; d&apos;autres nous découvrent au coin de la
          rue et reviennent le lendemain. C&apos;est cette fidélité qui donne
          du sens à ce que nous faisons.
        </p>
      </section>

      {/* ── Notre savoir-faire : 3 engagements ────────────────────────── */}
      <section className="mx-auto max-w-5xl">
        <h2 className="text-2xl font-semibold">Notre savoir-faire</h2>
        <p className="mt-3 max-w-2xl text-neutral-600">
          Trois piliers, simples et non négociables, guident notre travail
          chaque matin.
        </p>
        <div className="mt-6 grid gap-4 sm:grid-cols-3">
          {savoirFaire.map((s) => (
            <div key={s.title} className="card p-5">
              <span className="text-[var(--brand)]">{s.icon}</span>
              <h3 className="mt-3 text-base font-semibold">{s.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-neutral-600">
                {s.text}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Notre équipe ───────────────────────────────────────────────── */}
      <section className="mx-auto max-w-3xl">
        <h2 className="text-2xl font-semibold">Notre équipe</h2>
        <p className="mt-4 leading-relaxed text-neutral-700">
          Nous sommes aujourd&apos;hui une équipe de <strong>4 salariés</strong>
          {', '}auxquels s&apos;ajoute la famille — mes deux fils et moi. Nous
          nous relayons tôt le matin pour que les pains, viennoiseries et
          spécialités soient prêts avant la première tournée des Annéciens.
        </p>
        <p className="mt-4 leading-relaxed text-neutral-700">
          Boulanger est un métier de main et de patience : chaque fournée est
          différente, et c&apos;est précisément ce qui nous plaît.
        </p>
      </section>

      {/* ── Où nous trouver / livraison ───────────────────────────────── */}
      <section className="rounded-2xl border border-neutral-200 bg-white p-8">
        <div className="grid gap-8 sm:grid-cols-2">
          <div>
            <h2 className="text-2xl font-semibold">Où nous trouver</h2>
            <p className="mt-3 leading-relaxed text-neutral-700">
              La boulangerie est située à <strong>Annecy</strong>. Venez
              pousser la porte : vous repartirez avec un pain chaud et
              peut-être une viennoiserie pour la route.
            </p>
            <p className="mt-3 text-sm text-neutral-500">
              Adresse précise et horaires : voir notre{' '}
              <Link
                href="/contact"
                className="text-[var(--brand-dark)] hover:underline"
              >
                page contact
              </Link>
              .
            </p>
          </div>
          <div>
            <h2 className="text-2xl font-semibold">Livraison à domicile</h2>
            <p className="mt-3 leading-relaxed text-neutral-700">
              Nous livrons à domicile dans un rayon de{' '}
              <strong>30 km autour d&apos;Annecy</strong>. Pour organiser une
              livraison, contactez-nous directement — nous vous proposerons un
              créneau selon nos tournées.
            </p>
          </div>
        </div>
      </section>

      {/* ── FAQ ────────────────────────────────────────────────────────── */}
      <section className="mx-auto max-w-3xl">
        <h2 className="text-2xl font-semibold">Questions fréquentes</h2>
        <div className="mt-6 space-y-5">
          {faq.map((qa, i) => (
            <div
              key={i}
              className="border-b border-neutral-200 pb-5 last:border-0"
            >
              <h3 className="text-base font-semibold">{qa.question}</h3>
              <p className="mt-2 text-sm leading-relaxed text-neutral-600">
                {qa.answer}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* ── CTA ────────────────────────────────────────────────────────── */}
      <section className="rounded-2xl border border-neutral-200 bg-[var(--brand-light)] p-8 text-center">
        <h2 className="text-2xl font-semibold">Venez nous rencontrer</h2>
        <p className="mx-auto mt-2 max-w-lg text-neutral-700">
          Une question, une commande spéciale, ou simplement l&apos;envie de
          découvrir nos pains ? Nous serons ravis de vous accueillir ou de
          vous lire.
        </p>
        <div className="mt-5 flex justify-center gap-3">
          <Link href="/contact" className="btn-primary">
            Nous contacter
          </Link>
          <Link href="/catalogue" className="btn-outline">
            Voir nos pains
          </Link>
        </div>
      </section>
    </article>
  );
}

const savoirFaire = [
  {
    title: 'Levain maison',
    text: 'Notre levain naturel est vivant, nourri chaque jour à la farine. Il donne à nos pains une digestion plus douce et des saveurs plus profondes.',
    icon: <Wheat className="size-6" />
  },
  {
    title: 'Produits locaux',
    text: 'Farines, fruits, fromages : nous nous approvisionnons auprès de producteurs de la région Auvergne-Rhône-Alpes, dans un rayon court.',
    icon: <MapPin className="size-6" />
  },
  {
    title: 'Savoir-faire familial',
    text: 'Pétrissage, façonnage et cuisson sont faits main, sur place, par une équipe qui connaît le métier et qui aime le pain bien fait.',
    icon: <Users className="size-6" />
  }
];

const faq = [
  {
    question:
      'Depuis quand existe la Boulangerie Martin à Annecy ?',
    answer:
      'La Boulangerie Martin a été fondée en 1985 par mes parents. Aujourd’hui, je tiens toujours la boutique, épaulé par mes deux fils, avec une équipe de 4 salariés — quarante ans de pain au levain à Annecy.'
  },
  {
    question:
      'La Boulangerie Martin livre-t-elle à domicile ?',
    answer:
      'Oui. Nous livrons à domicile dans un rayon de 30 km autour d’Annecy. Contactez-nous par téléphone ou via la page contact pour convenir d’un créneau selon nos tournées.'
  },
  {
    question:
      'Quels produits locaux utilise la Boulangerie Martin ?',
    answer:
      'Nous travaillons en priorité des producteurs de la région Auvergne-Rhône-Alpes : farines de meuniers locaux, fruits de saison, et produits laitiers du coin. La sélection évolue selon les saisons et les arrivages.'
  }
];

// Ré-export pour réutiliser l'horaire (placeholder informatif — sera
// personnalisé depuis la page Contact).
export const _unused = Clock;
