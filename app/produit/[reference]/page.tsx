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

  // Documents techniques : on préfère `documents` (nom + commentaire par
  // fichier) quand le backend le fournit, sinon on retombe sur `specSheets`
  // (liste d'URLs) en dérivant un libellé depuis l'URL.
  const technicalDocs: {
    key: string;
    name: string;
    comment: string;
    url: string;
  }[] =
    article.documents && article.documents.length > 0
      ? article.documents.map((d) => ({
          key: d.url,
          name: d.name?.trim() || 'Fiche technique',
          comment: d.comment?.trim() || '',
          url: d.url
        }))
      : (article.specSheets ?? []).map((url) => {
          const file = url.split('/').pop() || '';
          const cleaned = decodeURIComponent(file.replace(/\.[a-z0-9]+$/i, ''))
            .replace(/[-_]+/g, ' ')
            .trim();
          return {
            key: url,
            name: cleaned || 'Fiche technique',
            comment: '',
            url
          };
        });

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
        {technicalDocs.length > 0 && (
          <div className="mt-6">
            <h2 className="mb-2 text-sm font-medium text-neutral-700">
              Documents
            </h2>
            <ul className="card divide-y divide-neutral-100 text-sm">
              {technicalDocs.map((doc) => (
                <li key={doc.key}>
                  <a
                    href={doc.url}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-3 px-4 py-3 transition-colors hover:bg-neutral-50"
                  >
                    <span className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded bg-red-50 text-[10px] font-semibold tracking-wide text-red-600">
                      PDF
                    </span>
                    <span className="flex min-w-0 flex-1 flex-col">
                      <span className="truncate font-medium text-neutral-800">
                        {doc.name}
                      </span>
                      {doc.comment && (
                        <span className="truncate text-xs text-neutral-500">
                          {doc.comment}
                        </span>
                      )}
                    </span>
                    <span
                      aria-hidden="true"
                      className="shrink-0 text-neutral-400"
                    >
                      ↗
                    </span>
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
