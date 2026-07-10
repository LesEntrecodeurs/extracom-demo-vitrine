import type { Metadata } from 'next';
import { unstable_cache } from 'next/cache';
import Image from 'next/image';
import {
  getArticleAction,
  getAnonymousArticleAction,
  isAuthenticatedAction
} from '@extracom/site-kit/server';
import { formatPrice, type Article } from '@extracom/site-kit';
import { BuyBox } from '@/components/site/BuyBox';
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
          <div className="mt-3">
            {article.stockQuantity > 0 ? (
              <span className="inline-flex items-center gap-2 rounded-full bg-emerald-50 px-3 py-1 text-sm font-semibold text-emerald-700 ring-1 ring-emerald-200">
                <span className="relative flex size-2">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                  <span className="relative inline-flex size-2 rounded-full bg-emerald-500" />
                </span>
                En stock
                <span className="font-normal text-emerald-600">
                  ({article.stockQuantity} disponible{article.stockQuantity > 1 ? 's' : ''})
                </span>
              </span>
            ) : (
              <span className="inline-flex items-center gap-2 rounded-full bg-red-50 px-3 py-1 text-sm font-semibold text-red-700 ring-1 ring-red-200">
                <span className="size-2 rounded-full bg-red-500" />
                Rupture de stock
              </span>
            )}
          </div>
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
            <h2 className="text-sm font-medium text-neutral-700">Documents</h2>
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
  );
}

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
