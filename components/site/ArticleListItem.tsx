import Link from 'next/link';
import Image from 'next/image';
import { formatPrice, type Article } from '@extracom/site-kit';
import { AddToCart } from './AddToCart';

export function ArticleListItem({ article }: { article: Article }) {
  const href = `/produit/${encodeURIComponent(article.reference)}`;
  const hasVariants = (article.gammes ?? []).some((g) => g.items.length > 0);
  const hasPromo =
    article.promotion != null &&
    article.basePrice != null &&
    article.price != null &&
    article.basePrice > article.price;

  return (
    <div className="card flex flex-col gap-4 overflow-hidden p-3 sm:flex-row sm:items-stretch sm:gap-4">
      <Link
        href={href}
        className="relative block aspect-square w-full shrink-0 overflow-hidden rounded-md bg-neutral-100 sm:w-28 sm:h-28"
      >
        <Image
          src={article.imageUrl || '/placeholder.svg'}
          alt={article.title}
          fill
          sizes="(max-width: 640px) 100vw, 112px"
          className="object-cover transition-transform duration-500 ease-out hover:scale-[1.06]"
        />
        {hasPromo && (
          <span className="absolute top-2 left-2 rounded-full bg-[var(--brand)] px-2.5 py-0.5 text-xs font-medium text-white shadow-sm">
            Promo
          </span>
        )}
      </Link>

      <div className="flex flex-1 flex-col gap-1">
        <Link href={href}>
          <h3 className="text-sm leading-snug font-medium hover:text-[var(--brand-dark)]">
            {article.title}
          </h3>
        </Link>

        {article.reference && (
          <p className="text-xs text-neutral-500">
            Réf. {article.reference}
          </p>
        )}

        {hasVariants && (
          <p className="text-xs text-neutral-500">
            {article.gammes!.map((g) => g.label).join(', ')} ·{' '}
            {article.gammes!.reduce((n, g) => n + g.items.length, 0)}{' '}
            déclinaisons
          </p>
        )}

        {article.stockQuantity != null && (
          <p
            className={`text-xs font-medium ${
              article.stockQuantity > 0
                ? 'text-[var(--brand-dark)]'
                : 'text-red-500'
            }`}
          >
            {article.stockQuantity > 0
              ? `En stock${article.stockQuantity > 1 ? ` (${article.stockQuantity})` : ''}`
              : 'Épuisé'}
          </p>
        )}
      </div>

      <div className="flex shrink-0 flex-row items-center justify-between gap-4 sm:flex-col sm:items-end sm:justify-center sm:text-right">
        <div className="flex items-baseline gap-2">
          {article.price == null ? (
            <span className="text-xs text-neutral-500">
              Connectez-vous pour voir le prix
            </span>
          ) : (
            <>
              <span className="text-base font-semibold text-[var(--brand-dark)]">
                {formatPrice(article.price)}
              </span>
              {hasPromo && (
                <span className="text-xs text-neutral-400 line-through">
                  {formatPrice(article.basePrice)}
                </span>
              )}
              {article.unit && (
                <span className="text-xs text-neutral-400">
                  / {article.unit}
                </span>
              )}
            </>
          )}
        </div>

        {hasVariants ? (
          <Link
            href={href}
            className="rounded-md border border-[var(--brand)] px-3 py-1.5 text-sm font-medium text-[var(--brand-dark)] hover:bg-[var(--brand-light)]"
          >
            Choisir une déclinaison
          </Link>
        ) : (
          <AddToCart
            reference={article.reference}
            disabled={article.price == null}
          />
        )}
      </div>
    </div>
  );
}