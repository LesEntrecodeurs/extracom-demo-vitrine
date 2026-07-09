import Link from 'next/link';
import {
  Truck,
  ShieldCheck,
  MessageCircle,
  UserPlus,
  BadgeEuro,
  ClipboardCheck,
  Search,
  ArrowRight
} from 'lucide-react';
import {
  getArticlesAction,
  getContextAction,
  meAction
} from '@extracom/site-kit/server';
import type { Article, ShopContext, User } from '@extracom/site-kit';
import { ArticleCard } from '@/components/site/ArticleCard';
import { FaqBlock, type FaqItem } from '@/components/site/FaqBlock';
import { FeaturedCarousel } from '@/components/site/FeaturedCarousel';
import { JsonLd } from '@/components/site/JsonLd';
import { faqLd } from '@/lib/seo';

export const dynamic = 'force-dynamic';

export default async function HomePage() {
  let featured: Article[] = [];
  let context: ShopContext | null = null;
  try {
    featured = (await getArticlesAction({ limit: 8 })).data;
  } catch {
    featured = [];
  }
  try {
    context = await getContextAction();
  } catch {
    context = null;
  }
  // État connecté → on adapte l'onboarding (un client connecté n'a pas besoin
  // du « comment ça marche » ni du CTA inscription).
  let user: User | null = null;
  try {
    user = await meAction();
  } catch {
    user = null;
  }
  const isAnonymous = !user;
  const categories = context?.catalogTree?.slice(0, 6) ?? [];
  const firstName = user?.name?.split(' ')[0];
  const shopName = context?.branding?.name ?? context?.shopName ?? 'Boutique';
  // Inscription ouverte = capability vitrine dérivée (création de compte + liens
  // légaux). Quand fermée, on masque les entrées « Créer un compte ».
  const registrationOpen = context?.capabilities?.registrationOpen ?? false;

  // Bloc FAQ de l'accueil — questions en 3e personne + marque (GEO), réponses
  // answer-first (40-60 mots) avec liens internes vers les pages clés. Chaque
  // entrée porte un `answerText` (texte brut) réutilisé dans le JSON-LD
  // FAQPage pour que les assistants IA puissent citer les réponses.
  const faqItems: FaqItem[] = [
    {
      question: `Comment accéder aux tarifs de ${shopName} ?`,
      answer: (
        <>
          {shopName} affiche automatiquement vos tarifs négociés dès que vous
          êtes connecté à votre compte professionnel. Pour en profiter,
          identifiez-vous sur la page{' '}
          <Link href="/connexion" className="font-medium text-[var(--brand-dark)] hover:underline">
            Connexion
          </Link>{' '}
          si vous êtes déjà client, ou créez un compte via la page{' '}
          <Link href="/inscription" className="font-medium text-[var(--brand-dark)] hover:underline">
            Inscription
          </Link>
          . L'inscription est ensuite validée par un commercial avant
          l'activation de vos conditions tarifaires personnalisées.
        </>
      ),
      answerText: `${shopName} affiche automatiquement les tarifs négociés dès la connexion à un compte professionnel. Pour en profiter, identifiez-vous sur la page Connexion (/connexion) si vous êtes déjà client, ou créez un compte via la page Inscription (/inscription). L'inscription est ensuite validée par un commercial avant l'activation des conditions tarifaires personnalisées.`
    },
    {
      question: `Qui peut commander sur ${shopName} ?`,
      answer: (
        <>
          {shopName} est une boutique B2B réservée aux professionnels :
          entreprises, artisans, revendeurs et collectivités. L'accès au
          catalogue complet et aux tarifs négociés se fait après inscription,
          validée par notre équipe commerciale afin de garantir des conditions
          adaptées à chaque activité.
        </>
      ),
      answerText: `${shopName} est une boutique B2B réservée aux professionnels : entreprises, artisans, revendeurs et collectivités. L'accès au catalogue complet et aux tarifs négociés se fait après inscription, validée par l'équipe commerciale afin de garantir des conditions adaptées à chaque activité professionnelle.`
    },
    {
      question: `Comment se passe une commande chez ${shopName} ?`,
      answer: (
        <>
          Le parcours se fait en trois étapes simples : parcourez le{' '}
          <Link href="/catalogue" className="font-medium text-[var(--brand-dark)] hover:underline">
            catalogue
          </Link>
          , ajoutez vos références au panier, puis validez votre commande ou
          demandez un devis selon vos droits. Le suivi est ensuite accessible à
          tout moment depuis votre{' '}
          <Link href="/compte" className="font-medium text-[var(--brand-dark)] hover:underline">
            espace compte
          </Link>
          .
        </>
      ),
      answerText: `Le parcours de commande chez ${shopName} se fait en trois étapes simples : parcourez le catalogue (/catalogue), ajoutez vos références au panier, puis validez votre commande ou demandez un devis selon vos droits. Le suivi est ensuite accessible à tout moment depuis votre espace compte (/compte).`
    },
    {
      question: `Comment demander un devis à ${shopName} ?`,
      answer: (
        <>
          {shopName} permet à ses clients professionnels de demander un devis
          plutôt que de commander directement en ligne. Si votre compte dispose
          de cette option, « Demander un devis » apparaît au moment de valider
          votre panier : vous décrivez votre besoin et notre équipe commerciale
          vous répond avec une offre personnalisée.
        </>
      ),
      answerText: `${shopName} permet à ses clients professionnels de demander un devis plutôt que de commander directement en ligne. Si votre compte dispose de cette option, « Demander un devis » apparaît au moment de valider le panier : le client décrit son besoin et l'équipe commerciale répond avec une offre personnalisée.`
    },
    {
      question: `Comment contacter le support ${shopName} ?`,
      answer: (
        <>
          Le support {shopName} est joignable via la{' '}
          <Link href="/contact" className="font-medium text-[var(--brand-dark)] hover:underline">
            page Contact
          </Link>{' '}
          pour toute question commerciale, technique ou de suivi de commande,
          par e-mail, téléphone ou via le formulaire de la page. Les clients
          connectés disposent en plus d'un espace d'échange direct depuis leur{' '}
          <Link href="/compte" className="font-medium text-[var(--brand-dark)] hover:underline">
            espace compte
          </Link>
          .
        </>
      ),
      answerText: `Le support ${shopName} est joignable via la page Contact (/contact) pour toute question commerciale, technique ou de suivi de commande, par e-mail, téléphone ou via le formulaire de la page. Les clients connectés disposent en plus d'un espace d'échange direct depuis leur espace compte (/compte).`
    }
  ];

  return (
    <div className="space-y-16">
      <section className="hero-mesh grain relative overflow-hidden rounded-3xl border border-[var(--brand)]/15">
        <div className="relative z-10 px-6 py-14 sm:px-10 md:px-14 md:py-20">
          <p className="reveal reveal-1 text-xs font-semibold tracking-[0.2em] text-[var(--brand-dark)] uppercase">
            {shopName} · Espace professionnel
          </p>
          <h1 className="reveal reveal-2 mt-4 max-w-3xl text-4xl leading-[1.05] font-semibold text-neutral-900 md:text-6xl">
            {firstName ? (
              <>Bonjour {firstName}, vos tarifs vous attendent.</>
            ) : (
              <>
                Votre catalogue professionnel,{' '}
                <span className="text-[var(--brand-dark)] italic">
                  au juste prix.
                </span>
              </>
            )}
          </h1>
          <p className="reveal reveal-3 mt-5 max-w-xl text-base text-neutral-700 md:text-lg">
            {isAnonymous
              ? 'Parcourez le catalogue, connectez-vous pour vos tarifs négociés, et commandez ou demandez un devis en quelques clics.'
              : 'Retrouvez vos tarifs négociés, votre historique et passez vos commandes en quelques clics.'}
          </p>

          {/* Recherche intégrée à la hero — entrée directe dans le catalogue. */}
          <form
            action="/catalogue"
            className="reveal reveal-3 mt-7 flex max-w-lg items-center gap-2 rounded-full border border-neutral-200 bg-white/80 p-1.5 shadow-sm backdrop-blur"
          >
            <Search className="ml-3 size-5 shrink-0 text-neutral-400" />
            <input
              name="q"
              placeholder="Rechercher une référence, un produit…"
              aria-label="Rechercher dans le catalogue"
              className="min-w-0 flex-1 bg-transparent px-1 text-sm outline-none"
            />
            <button type="submit" className="btn-primary shrink-0">
              Rechercher
            </button>
          </form>

          {isAnonymous && (
            <Link
              href="/connexion"
              className="reveal reveal-4 mt-4 inline-block text-sm font-medium text-[var(--brand-dark)] hover:underline"
            >
              Déjà client ? Connectez-vous →
            </Link>
          )}

          {/* Signaux de confiance. */}
          <dl className="reveal reveal-4 mt-10 flex flex-wrap gap-x-10 gap-y-4 border-t border-[var(--brand)]/15 pt-6">
            {trust.map((t) => (
              <div key={t.label}>
                <dt className="font-display text-2xl font-semibold text-neutral-900">
                  {t.value}
                </dt>
                <dd className="text-xs tracking-wide text-neutral-500 uppercase">
                  {t.label}
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      {/* Onboarding visiteur B2B — comment fonctionne la commande pro. */}
      {isAnonymous && (
        <section>
          <h2 className="mb-1 text-xl font-semibold">Comment ça marche</h2>
          <p className="mb-6 text-sm text-neutral-500">
            La commande professionnelle en 3 étapes.
          </p>
          <ol className="grid gap-4 sm:grid-cols-3">
            {steps.map((s, i) => (
              <li key={s.title} className="card relative p-5">
                <span className="absolute top-4 right-4 text-3xl font-bold text-[var(--brand-light)]">
                  {i + 1}
                </span>
                <span className="text-[var(--brand)]">{s.icon}</span>
                <p className="mt-3 font-medium">{s.title}</p>
                <p className="mt-1 text-sm text-neutral-500">{s.text}</p>
              </li>
            ))}
          </ol>
        </section>
      )}

      <section className="grid gap-4 sm:grid-cols-3">
        {valueProps.map((v) => (
          <div key={v.title} className="card flex items-start gap-3 p-4">
            <span className="text-[var(--brand)]">{v.icon}</span>
            <div>
              <p className="text-sm font-medium">{v.title}</p>
              <p className="text-sm text-neutral-500">{v.text}</p>
            </div>
          </div>
        ))}
      </section>

      {featured.length > 0 && (
        <section>
          <div className="mb-4 flex items-end justify-between">
            <h2 className="text-xl font-semibold">Notre sélection</h2>
            <Link
              href="/catalogue"
              className="text-sm text-[var(--brand-dark)] hover:underline"
            >
              Tout voir →
            </Link>
          </div>
          <FeaturedCarousel
            items={featured.map((a) => (
              <ArticleCard key={a.reference} article={a} />
            ))}
          />
        </section>
      )}

      {categories.length > 0 && (
        <section>
          <h2 className="mb-4 text-2xl font-semibold">
            Explorez les catégories
          </h2>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
            {categories.map((c) => (
              <Link
                key={c.id}
                href={`/catalogue?catalog=${c.id}`}
                className="group card relative flex min-h-28 items-end overflow-hidden p-5"
              >
                <span
                  aria-hidden
                  className="pointer-events-none absolute inset-0 bg-gradient-to-br from-transparent to-[var(--brand-light)] opacity-0 transition-opacity duration-300 group-hover:opacity-100"
                />
                <span className="relative flex w-full items-center justify-between gap-2 font-medium">
                  {c.label}
                  <ArrowRight className="size-4 shrink-0 text-neutral-400 transition-transform duration-300 group-hover:translate-x-1 group-hover:text-[var(--brand-dark)]" />
                </span>
              </Link>
            ))}
          </div>
        </section>
      )}

      <FaqBlock
        heading={`Questions fréquentes sur ${shopName}`}
        description="Les réponses que les assistants et nos clients nous posent le plus souvent."
        items={faqItems}
      />

      {isAnonymous && (
        <section className="rounded-2xl border border-neutral-200 bg-white p-8 text-center">
          <h2 className="text-xl font-semibold">Un compte professionnel ?</h2>
          <p className="mx-auto mt-2 max-w-lg text-neutral-600">
            {registrationOpen
              ? 'Connectez-vous pour vos tarifs personnalisés, ou créez un compte en quelques minutes. Votre inscription est validée par un commercial.'
              : 'Connectez-vous pour retrouver vos tarifs personnalisés.'}
          </p>
          <div className="mt-5 flex justify-center gap-3">
            {registrationOpen && (
              <Link href="/inscription" className="btn-primary">
                Créer un compte
              </Link>
            )}
            <Link
              href="/connexion"
              className={registrationOpen ? 'btn-outline' : 'btn-primary'}
            >
              Connexion
            </Link>
          </div>
        </section>
      )}

      <JsonLd
        data={faqLd(
          faqItems.map(({ question, answerText }) => ({
            question,
            answer: answerText
          }))
        )}
      />
    </div>
  );
}

// Signaux de confiance affichés dans la hero (personnalisables).
const trust = [
  { value: '24–48h', label: 'Livraison' },
  { value: '100%', label: 'Tarifs négociés' },
  { value: 'Devis', label: 'En 1 clic' }
];

// Étapes d'onboarding du parcours B2B (accueil, visiteur anonyme).
const steps = [
  {
    title: 'Créez votre compte',
    text: 'Inscription professionnelle en quelques minutes, validée par un commercial.',
    icon: <UserPlus className="size-6" />
  },
  {
    title: 'Vos tarifs s’affichent',
    text: 'Une fois connecté : prix négociés, remises et centrale d’achat appliqués.',
    icon: <BadgeEuro className="size-6" />
  },
  {
    title: 'Commandez ou devisez',
    text: 'Ajoutez au panier puis passez commande, ou demandez un devis selon vos droits.',
    icon: <ClipboardCheck className="size-6" />
  }
];

const valueProps = [
  {
    title: 'Livraison rapide',
    text: 'Expédition sous 24–48h',
    icon: <Truck className="size-6" />
  },
  {
    title: 'Paiement sécurisé',
    text: 'Transactions protégées',
    icon: <ShieldCheck className="size-6" />
  },
  {
    title: 'Support dédié',
    text: 'Une équipe à votre écoute',
    icon: <MessageCircle className="size-6" />
  }
];
