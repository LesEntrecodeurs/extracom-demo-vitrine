import Link from 'next/link';
import Image from 'next/image';
import { formatPrice, type Article } from '@extracom/site-kit';
import { AddToCart } from './AddToCart';

/**
 * Variante « ligne horizontale » d'un article, utilisée quand le visiteur
 * choisit la vue liste sur le catalogue. Image à gauche, informations au
 * centre, action à droite. Volontairement compacte pour maximiser le nombre
 * d'articles visibles sans scroller.
 */
export function ArticleRow({ article }: { article: Article }) {
  const href = `/produit/${encodeURIComponent(article.reference)}`;
  const hasVariants = (article.gammes ?? []).some((g) => g.items.length > 0);
  const hasPromo =
    article.promotion != null &&
    article.basePrice != null &&
    article.price != null &&
    article.basePrice > article.price;

  return (
    <div className="card flex items-center gap-4 p-3 sm:p-4">
      <Link href={href} className="block flex-shrink-0">
        <div className="relative h-20 w-20 overflow-hidden rounded-md bg-neutral-100 sm:h-24 sm:w-24">
          <Image
            src={article.imageUrl || '/placeholder.svg'}
            alt={article.title}
            fill
            sizes="96px"
            className="object-cover transition-transform duration-500 ease-out hover:scale-[1.06]"
          />
          {hasPromo && (
            <span className="absolute top-1 left-1 rounded-full bg-[var(--brand)] px-1.5 py-0.5 text-[10px] font-medium text-white shadow-sm">
              Promo
            </span>
          )}
        </div>
      </Link>

      <div className="min-w-0 flex-1">
        <Link href={href}>
          <h3 className="line-clamp-1 text-sm leading-snug font-medium hover:text-[var(--brand-dark)] sm:text-base">
            {article.title}
          </h3>
        </Link>
        <p className="mt-0.5 text-xs text-neutral-400">
          Réf. {article.reference}
        </p>

        <div className="mt-1.5 flex flex-wrap items-baseline gap-x-2 gap-y-0.5">
          {article.price == null ? (
            <span className="text-xs text-neutral-500">
              Connectez-vous pour voir le prix
            </span>
          ) : (
            <>
              <span className="font-semibold text-[var(--brand-dark)]">
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
          {article.stockQuantity != null && (
            <span
              className={`text-xs font-medium ${
                article.stockQuantity > 0
                  ? 'text-[var(--brand-dark)]'
                  : 'text-red-500'
              }`}
            >
              {article.stockQuantity > 0 ? 'Disponible' : 'Indisponible'}
            </span>
          )}
        </div>
      </div>

      <div className="flex flex-shrink-0 flex-col items-stretch gap-1.5">
        {hasVariants ? (
          <Link
            href={href}
            className="rounded-md border border-[var(--brand)] px-3 py-1.5 text-center text-xs font-medium text-[var(--brand-dark)] hover:bg-[var(--brand-light)] sm:text-sm"
          >
            Choisir
          </Link>
        ) : (
          <AddToCart
            reference={article.reference}
            disabled={article.price == null}
            size="sm"
          />
        )}
        <Link
          href={href}
          className="rounded-md px-3 py-1.5 text-center text-xs text-neutral-500 hover:text-[var(--brand-dark)]"
        >
          Voir
        </Link>
      </div>
    </div>
  );
}