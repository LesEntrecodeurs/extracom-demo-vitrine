import type { Metadata } from 'next';
import Link from 'next/link';
import { unstable_cache } from 'next/cache';
import Image from 'next/image';
import {
  getArticleAction,
  getAnonymousArticleAction,
  getAnonymousArticlesAction,
  getArticlesAction,
  isAuthenticatedAction
} from '@extracom/site-kit/server';
import { formatPrice, type Article } from '@extracom/site-kit';
import { BuyBox } from '@/components/site/BuyBox';
import { ArticleCard } from '@/components/site/ArticleCard';
import { JsonLd } from '@/components/site/JsonLd';

export const dynamic = 'force-dynamic';

// Détail produit ANONYME mis en cache (ISR) : prix de base/masqué, jamais le
// prix client. Sert le rendu anonyme + les métadonnées SEO (sans prix).
const cachedAnonArticle = unstable_cache(
  (reference: string) => getAnonymousArticleAction(decodeURIComponent(reference)),
  ['product-anon'],
  { revalidate: 300, tags: ['catalogue'] }
);

export async function generateMetadata({
  params
}: {
  params: Promise<{ reference: string }>;
}): Promise<Metadata> {
  const { reference } = await params;
  try {
    // Les métadonnées ne contiennent pas de prix → version anonyme cachée.
    const a = await cachedAnonArticle(reference);
    const description =
      a.description?.slice(0, 160) || `${a.title} — réf. ${a.reference}`;
    return {
      title: a.title,
      description,
      alternates: { canonical: `/produit/${encodeURIComponent(a.reference)}` },
      openGraph: {
        title: a.title,
        description,
        type: 'website',
        images: a.imageUrl ? [{ url: a.imageUrl }] : undefined
      }
    };
  } catch {
    return { title: 'Produit' };
  }
}

export default async function ProduitPage({
  params
}: {
  params: Promise<{ reference: string }>;
}) {
  const { reference } = await params;
  // Connecté → prix client (frais). Anonyme → détail anonyme caché (ISR).
  const authed = await isAuthenticatedAction();
  const article = authed
    ? await getArticleAction(decodeURIComponent(reference))
    : await cachedAnonArticle(reference);

  // JSON-LD Product (SEO + GEO). L'offre n'est incluse que si un prix est exposé.
  const productLd: Record<string, unknown> = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: article.title,
    sku: article.reference,
    ...(article.imageUrl ? { image: article.imageUrl } : {}),
    ...(article.description ? { description: article.description } : {}),
    ...(article.price != null
      ? {
          offers: {
            '@type': 'Offer',
            price: article.price,
            priceCurrency: 'EUR',
            availability:
              (article.stockQuantity ?? 1) > 0
                ? 'https://schema.org/InStock'
                : 'https://schema.org/OutOfStock'
          }
        }
      : {})
  };

  return (
    <div>
      <div className="grid gap-8 md:grid-cols-2">
        <JsonLd data={productLd} />

        <div className="relative aspect-square w-full overflow-hidden rounded-lg bg-neutral-100">
          <Image
            src={article.imageUrl || '/placeholder.svg'}
            alt={article.title}
            fill
            sizes="(max-width: 768px) 100vw, 50vw"
            className="object-cover"
            priority
          />
        </div>

        <div>
          <h1 className="text-2xl font-bold">{article.title}</h1>
          <p className="mt-1 text-sm text-neutral-500">
            Réf. {article.reference}
          </p>

          <div className="mt-4 flex items-baseline gap-3">
            <span className="text-xl font-semibold text-[var(--brand-dark)]">
              {article.price == null ? (
                <span className="text-base text-neutral-500">
                  Connectez-vous pour voir votre tarif
                </span>
              ) : (
                formatPrice(article.price)
              )}
            </span>
            {article.price != null &&
              article.basePrice != null &&
              article.basePrice > article.price && (
                <span className="text-sm text-neutral-400 line-through">
                  {formatPrice(article.basePrice)}
                </span>
              )}
            {article.promotion && (
              <span className="rounded-full bg-red-50 px-2 py-0.5 text-xs font-medium text-red-600">
                -{article.promotion.discountPercent}%
              </span>
            )}
            {typeof article.vatRate === 'number' && (
              <span className="text-xs text-neutral-400">
                TVA {article.vatRate}%
              </span>
            )}
          </div>

          <p className="mt-1 text-sm text-neutral-500">
            Unité : {article.unit}
            {article.packagingQuantity && article.packagingQuantity > 1
              ? ` · par ${article.packagingQuantity}`
              : ''}
          </p>

          {typeof article.stockQuantity === 'number' && (
            <p className="mt-2 text-sm text-neutral-600">
              {article.stockQuantity > 0
                ? `En stock (${article.stockQuantity})`
                : 'Rupture de stock'}
            </p>
          )}

          {article.description && (
            <p className="mt-4 whitespace-pre-line text-neutral-700">
              {article.description}
            </p>
          )}

          {/* Déclinaisons (gamme) + ajout au panier */}
          <div className="mt-6">
            <BuyBox
              reference={article.reference}
              gammes={article.gammes}
              priceHidden={article.price == null}
            />
          </div>

          {/* Caractéristiques */}
          <Specs article={article} />

          {/* Contenu enrichi (glossaires) */}
          {article.glossaires
            ?.filter((g) => g.text?.trim())
            .map((g) => (
              <p
                key={g.text}
                className="mt-4 text-sm whitespace-pre-line text-neutral-600"
              >
                {g.text}
              </p>
            ))}

          {/* Fiches techniques */}
          {article.specSheets && article.specSheets.length > 0 && (
            <div className="mt-5">
              <h2 className="text-sm font-medium text-neutral-700">
                Documents
              </h2>
              <ul className="mt-2 space-y-1">
                {article.specSheets.map((url, i) => (
                  <li key={url}>
                    <a
                      href={url}
                      target="_blank"
                      rel="noreferrer"
                      className="text-sm text-[var(--brand-dark)] underline"
                    >
                      Fiche technique {i + 1}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>

      {/* Continuer votre sélection — même famille que l'article courant. */}
      <RelatedProducts
        family={article.family ?? null}
        excludeReference={article.reference}
      />
    </div>
  );
}

async function RelatedProducts({
  family,
  excludeReference
}: {
  family: { code: string; label: string } | null;
  excludeReference: string;
}) {
  // Le kit ne propose pas de relation « accessoire lié ». On reste honnête : on
  // affiche les autres articles de la même famille, qui partagent l'usage.
  const articles = family
    ? await loadSameFamily(family.code, excludeReference)
    : [];
  if (articles.length === 0) return null;

  return (
    <section className="mt-12" aria-labelledby="related-heading">
      <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h2
            id="related-heading"
            className="text-xl font-semibold text-neutral-900"
          >
            Continuer votre sélection
          </h2>
          <p className="mt-1 text-sm text-neutral-500">
            D'autres articles de la famille « {family?.label ?? 'produit'} ».
          </p>
        </div>
        {family && (
          <Link
            href={`/catalogue?family=${encodeURIComponent(family.code)}`}
            className="shrink-0 self-start rounded-md border border-[var(--brand)] px-4 py-2 text-sm font-medium text-[var(--brand-dark)] hover:bg-[var(--brand-light)] sm:self-auto"
          >
            Voir toute la famille « {family.label} »
          </Link>
        )}
      </div>

      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
        {articles.map((a) => (
          <ArticleCard key={a.reference} article={a} />
        ))}
      </div>
    </section>
  );
}

async function loadSameFamily(
  familyCode: string,
  excludeReference: string
): Promise<Article[]> {
  // Auth-aware : prix client connecté, version anonyme sinon (cohérent avec la
  // fiche courante). On prend 5 puis on enlève l'article courant pour en
  // garder 4 ; on complète s'il en manque.
  const limit = 5;
  const query = { familyCode, limit, page: 1 };
  const authed = await isAuthenticatedAction();
  const res = authed
    ? await getArticlesAction(query)
    : await cachedRelatedArticles(query);

  const filtered = res.data.filter((a) => a.reference !== excludeReference);
  return filtered.slice(0, 4);
}

const cachedRelatedArticles = unstable_cache(
  (q: Parameters<typeof getAnonymousArticlesAction>[0]) =>
    getAnonymousArticlesAction(q),
  ['product-related-anon'],
  { revalidate: 300, tags: ['catalogue'] }
);

function Specs({ article }: { article: Article }) {
  const rows: [string, string][] = [];
  rows.push(['Référence', article.reference]);
  if (article.barcode) rows.push(['Code-barres', article.barcode]);
  rows.push(['Unité de vente', article.unit]);
  if (article.packagingQuantity && article.packagingQuantity > 1)
    rows.push(['Conditionnement', `par ${article.packagingQuantity}`]);
  if (typeof article.vatRate === 'number')
    rows.push(['TVA', `${article.vatRate} %`]);
  if (article.weightNet) rows.push(['Poids net', `${article.weightNet} kg`]);
  if (article.weightGross)
    rows.push(['Poids brut', `${article.weightGross} kg`]);
  if (article.warranty) rows.push(['Garantie / DLV', article.warranty]);
  if (article.expirationDate) rows.push(['DLC', article.expirationDate]);

  if (rows.length === 0) return null;
  return (
    <div className="mt-6">
      <h2 className="mb-2 text-sm font-medium text-neutral-700">
        Caractéristiques
      </h2>
      <dl className="card divide-y divide-neutral-100 text-sm">
        {rows.map(([k, v]) => (
          <div key={k} className="flex justify-between px-4 py-2.5">
            <dt className="text-neutral-500">{k}</dt>
            <dd className="font-medium text-neutral-800">{v}</dd>
          </div>
        ))}
      </dl>
    </div>
  );
}
