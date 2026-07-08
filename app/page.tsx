import Link from 'next/link';
import {
  Truck,
  ShieldCheck,
  MessageCircle,
  UserPlus,
  BadgeEuro,
  ClipboardCheck,
  Search,
  ArrowRight,
  ShoppingCart,
  Receipt,
  Package,
  User
} from 'lucide-react';
import {
  getArticlesAction,
  getCartAction,
  getContextAction,
  getDocumentsAction,
  meAction
} from '@extracom/site-kit/server';
import type {
  Article,
  Cart,
  DocumentSummary,
  ShopContext,
  User as UserType
} from '@extracom/site-kit';
import { formatDate, formatPrice } from '@extracom/site-kit';
import { ArticleCard } from '@/components/site/ArticleCard';
import { FeaturedCarousel } from '@/components/site/FeaturedCarousel';

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
  // Accueil contextuel : un client connecté voit son panier, ses dernières
  // commandes et des raccourcis compte à la place de l'onboarding visiteur.
  let user: UserType | null = null;
  let cart: Cart | null = null;
  let recentDocs: DocumentSummary[] = [];
  try {
    user = await meAction();
  } catch {
    user = null;
  }
  if (user) {
    try {
      cart = await getCartAction();
    } catch {
      cart = null;
    }
    try {
      const docsResp = await getDocumentsAction({ limit: 4 });
      recentDocs = docsResp?.data ?? [];
    } catch {
      recentDocs = [];
    }
  }
  const isAnonymous = !user;
  const categories = context?.catalogTree?.slice(0, 6) ?? [];
  const firstName = user?.name?.split(' ')[0];
  const shopName = context?.branding?.name ?? context?.shopName ?? 'Boutique';
  // Inscription ouverte = capability vitrine dérivée (création de compte + liens
  // légaux). Quand fermée, on masque les entrées « Créer un compte ».
  const registrationOpen = context?.capabilities?.registrationOpen ?? false;
  const cartLines = cart?.lines ?? [];
  const cartItemCount = cart?.totals?.itemCount ?? 0;
  const cartTotal = cart?.totals?.totalInclVat ?? null;

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

      {/* ── Zone 2a — Onboarding visiteur (anonyme uniquement). */}
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

      {/* ── Zone 2b — Tableau de bord client (connecté uniquement). */}
      {!isAnonymous && (
        <section>
          <h2 className="mb-1 text-xl font-semibold">
            Bonjour {firstName}, voici votre espace
          </h2>
          <p className="mb-6 text-sm text-neutral-500">
            Votre panier en cours, vos derniers documents et vos raccourcis
            compte.
          </p>

          <div className="grid gap-4 sm:grid-cols-3">
            {/* Carte panier */}
            <div className="card p-5">
              <span className="text-[var(--brand)]">
                <ShoppingCart className="size-6" />
              </span>
              <p className="mt-3 text-sm text-neutral-500">Votre panier</p>
              {cartLines.length > 0 ? (
                <>
                  <p className="mt-1 font-display text-2xl font-semibold">
                    {cartItemCount} article{cartItemCount > 1 ? 's' : ''}
                  </p>
                  <p className="text-sm text-neutral-500">
                    {cart?.totals?.lineCount ?? cartLines.length} référence
                    {(cart?.totals?.lineCount ?? cartLines.length) > 1
                      ? 's'
                      : ''}{' '}
                    · {formatPrice(cartTotal)} TTC
                  </p>
                  <Link
                    href="/panier"
                    className="mt-3 inline-flex text-sm font-medium text-[var(--brand-dark)] hover:underline"
                  >
                    Voir mon panier →
                  </Link>
                </>
              ) : (
                <>
                  <p className="mt-1 font-display text-2xl font-semibold">
                    Vide
                  </p>
                  <p className="text-sm text-neutral-500">
                    Vous n'avez pas encore ajouté d'article.
                  </p>
                  <Link
                    href="/catalogue"
                    className="mt-3 inline-flex text-sm font-medium text-[var(--brand-dark)] hover:underline"
                  >
                    Parcourir le catalogue →
                  </Link>
                </>
              )}
            </div>

            {/* Carte derniers documents */}
            <div className="card p-5">
              <span className="text-[var(--brand)]">
                <Receipt className="size-6" />
              </span>
              <p className="mt-3 text-sm text-neutral-500">
                Vos derniers documents
              </p>
              {recentDocs.length > 0 ? (
                <>
                  <p className="mt-1 font-display text-2xl font-semibold">
                    {recentDocs[0].reference}
                  </p>
                  <p className="text-sm text-neutral-500">
                    {recentDocs[0].type} ·{' '}
                    {formatDate(recentDocs[0].date)} ·{' '}
                    {formatPrice(recentDocs[0].totalInclVat ?? null)}
                  </p>
                  <Link
                    href="/compte/commandes"
                    className="mt-3 inline-flex text-sm font-medium text-[var(--brand-dark)] hover:underline"
                  >
                    Voir l'historique →
                  </Link>
                </>
              ) : (
                <>
                  <p className="mt-1 font-display text-2xl font-semibold">—</p>
                  <p className="text-sm text-neutral-500">
                    Aucun document pour le moment.
                  </p>
                  <Link
                    href="/catalogue"
                    className="mt-3 inline-flex text-sm font-medium text-[var(--brand-dark)] hover:underline"
                  >
                    Démarrer une commande →
                  </Link>
                </>
              )}
            </div>

            {/* Carte raccourcis compte */}
            <div className="card p-5">
              <span className="text-[var(--brand)]">
                <User className="size-6" />
              </span>
              <p className="mt-3 text-sm text-neutral-500">Mon compte</p>
              <ul className="mt-3 space-y-2 text-sm">
                <li>
                  <Link
                    href="/compte/profil"
                    className="flex items-center justify-between rounded-lg px-2 py-1.5 hover:bg-neutral-50"
                  >
                    <span>Mon profil</span>
                    <ArrowRight className="size-3.5 text-neutral-400" />
                  </Link>
                </li>
                <li>
                  <Link
                    href="/compte/adresses"
                    className="flex items-center justify-between rounded-lg px-2 py-1.5 hover:bg-neutral-50"
                  >
                    <span>Mes adresses</span>
                    <ArrowRight className="size-3.5 text-neutral-400" />
                  </Link>
                </li>
                <li>
                  <Link
                    href="/compte/commandes"
                    className="flex items-center justify-between rounded-lg px-2 py-1.5 hover:bg-neutral-50"
                  >
                    <span>Tous mes documents</span>
                    <ArrowRight className="size-3.5 text-neutral-400" />
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          {/* Liste compacte des derniers documents (si plus d'un). */}
          {recentDocs.length > 1 && (
            <div className="card mt-4 divide-y divide-neutral-100">
              {recentDocs.slice(1).map((d) => (
                <Link
                  key={d.id}
                  href={`/compte/commandes/${encodeURIComponent(d.id)}${
                    d.typeCode != null ? `?type=${d.typeCode}` : ''
                  }`}
                  className="flex items-center justify-between gap-4 p-4 transition hover:bg-neutral-50"
                >
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-medium">{d.reference}</span>
                      <span className="rounded-full bg-neutral-100 px-2 py-0.5 text-xs font-medium text-neutral-600">
                        {d.type}
                      </span>
                    </div>
                    <p className="mt-0.5 text-sm text-neutral-500">
                      {formatDate(d.date)}
                    </p>
                  </div>
                  <div className="flex shrink-0 items-center gap-3">
                    <span className="text-sm font-medium">
                      {formatPrice(d.totalInclVat ?? null)}
                    </span>
                    <ArrowRight className="size-4 text-neutral-400" />
                  </div>
                </Link>
              ))}
            </div>
          )}
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

      {/* ── Zone finale : CTA inscription (anonyme) / accès compte (connecté). */}
      {isAnonymous ? (
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
      ) : (
        <section className="rounded-2xl border border-[var(--brand)]/20 bg-[var(--brand-light)] p-8">
          <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
            <div>
              <h2 className="text-xl font-semibold">
                Tout est à portée de clic depuis votre espace
              </h2>
              <p className="mt-1 text-sm text-neutral-700">
                Profil, adresses de livraison, historique complet et paiements
                en attente.
              </p>
            </div>
            <div className="flex gap-3">
              <Link href="/compte" className="btn-primary">
                Mon espace
              </Link>
              <Link href="/catalogue" className="btn-outline">
                Parcourir le catalogue
              </Link>
            </div>
          </div>
        </section>
      )}
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

n import inutilisé si Lucide ne sert pas dans une branche.
void Package;
