'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';
import {
  ShoppingCart,
  Trash2,
  ArrowRight,
  Minus,
  Plus,
  Home
} from 'lucide-react';
import { useCart } from '@extracom/site-kit/react';
import { formatPrice } from '@extracom/site-kit';
import { CartSkeleton } from '@/components/site/Loader';
import { EmptyState } from '@/components/site/EmptyState';

/**
 * Contenu de la page panier (côté client) : liste des lignes + récap.
 * La page `app/panier/page.tsx` est elle-même un Server Component qui se charge
 * du `noindex` et de l'`AuthGate` — ce composant se concentre sur l'affichage.
 */
export function CartView() {
  const { cart, isLoading, error, updateLine, removeItem } = useCart();
  const [clearing, setClearing] = useState(false);

  if (isLoading) return <CartSkeleton />;
  if (error)
    return (
      <p role="alert" className="text-red-600">
        Impossible de charger le panier.
      </p>
    );
  if (!cart || cart.lines.length === 0)
    return (
      <EmptyState
        icon={<ShoppingCart className="size-8" />}
        title="Votre panier est vide"
        description="Parcourez le catalogue pour ajouter des articles."
        action={{ label: 'Voir le catalogue', href: '/catalogue' }}
      />
    );

  // Les totaux (itemCount / lineCount) sont calculés serveur par le kit ; on
  // retombe sur un calcul local si jamais ils ne sont pas renseignés.
  const itemCount =
    cart.totals?.itemCount ??
    cart.lines.reduce((n, l) => n + (l.quantity ?? 0), 0);
  const lineCount = cart.totals?.lineCount ?? cart.lines.length;

  const handleClear = async () => {
    if (clearing) return;
    if (
      !window.confirm(
        `Vider entièrement votre panier (${lineCount} article${lineCount > 1 ? 's' : ''}) ?`
      )
    )
      return;
    setClearing(true);
    try {
      // Le kit ne fournit pas d'action « vider tout » → on retire les lignes
      // une par une. On ne s'arrête pas à la première erreur pour vider un
      // max, et l'état final sera rechargé par `useCart`.
      for (const line of cart.lines) {
        try {
          await removeItem(line.id);
        } catch {
          /* on continue, le panier se rechargera de toute façon */
        }
      }
    } finally {
      setClearing(false);
    }
  };

  return (
    <div className="space-y-8">
      <header>
        <nav
          aria-label="Fil d'Ariane"
          className="mb-3 flex items-center gap-1.5 text-xs text-neutral-500"
        >
          <Link
            href="/"
            className="inline-flex items-center gap-1 hover:text-neutral-900"
          >
            <Home className="size-3.5" /> Accueil
          </Link>
          <span aria-hidden>/</span>
          <span className="text-neutral-700">Panier</span>
        </nav>
        <h1 className="font-display text-3xl font-semibold tracking-tight text-neutral-900 md:text-4xl">
          Votre panier
        </h1>
        <p className="mt-1.5 text-sm text-neutral-500">
          {lineCount} {lineCount > 1 ? 'articles' : 'article'} · {itemCount}{' '}
          unité{itemCount > 1 ? 's' : ''} au total
        </p>
      </header>

      <div className="grid gap-8 lg:grid-cols-[1fr_320px]">
        <div>
          <ul className="card divide-y divide-neutral-100">
            {cart.lines.map((line) => {
              const productHref = `/produit/${encodeURIComponent(line.reference)}`;
              const lineTotal =
                line.lineTotalInclVat ?? line.unitPrice * line.quantity;

              return (
                <li
                  key={line.id}
                  className="flex gap-4 p-4 sm:gap-5 sm:p-5"
                >
                  <Link
                    href={productHref}
                    aria-label={`Voir ${line.label ?? line.reference}`}
                    className="relative h-20 w-20 shrink-0 overflow-hidden rounded-xl bg-neutral-100 sm:h-24 sm:w-24"
                  >
                    {line.imageUrl ? (
                      <Image
                        src={line.imageUrl}
                        alt=""
                        fill
                        sizes="96px"
                        className="object-cover"
                      />
                    ) : (
                      <span className="flex h-full w-full items-center justify-center text-neutral-300">
                        <ShoppingCart className="size-6" />
                      </span>
                    )}
                  </Link>

                  <div className="flex min-w-0 flex-1 flex-col">
                    <Link
                      href={productHref}
                      className="line-clamp-2 font-medium text-neutral-900 hover:text-[var(--brand-dark)]"
                    >
                      {line.label ?? line.reference}
                    </Link>
                    <p className="mt-0.5 text-xs text-neutral-500">
                      Réf. {line.reference}
                    </p>
                    {line.variantLabel && (
                      <p className="mt-0.5 text-xs text-neutral-500">
                        Déclinaison : {line.variantLabel}
                      </p>
                    )}

                    <p className="mt-1 text-sm text-neutral-600">
                      {formatPrice(line.unitPrice)}{' '}
                      <span className="text-neutral-400">
                        / {line.unit ?? 'unité'}
                      </span>
                    </p>

                    <div className="mt-auto flex flex-wrap items-center justify-between gap-3 pt-3">
                      <div className="inline-flex items-center rounded-full border border-neutral-300 bg-white">
                        <button
                          type="button"
                          aria-label="Diminuer la quantité"
                          disabled={line.quantity <= 1}
                          onClick={() =>
                            updateLine(line.id, {
                              quantity: line.quantity - 1
                            })
                          }
                          className="flex h-8 w-8 items-center justify-center rounded-l-full text-neutral-600 transition hover:bg-neutral-50 hover:text-neutral-900 disabled:opacity-40"
                        >
                          <Minus className="size-3.5" />
                        </button>
                        <span
                          aria-live="polite"
                          className="min-w-9 text-center text-sm font-medium tabular-nums"
                        >
                          {line.quantity}
                        </span>
                        <button
                          type="button"
                          aria-label="Augmenter la quantité"
                          onClick={() =>
                            updateLine(line.id, {
                              quantity: line.quantity + 1
                            })
                          }
                          className="flex h-8 w-8 items-center justify-center rounded-r-full text-neutral-600 transition hover:bg-neutral-50 hover:text-neutral-900"
                        >
                          <Plus className="size-3.5" />
                        </button>
                      </div>

                      <div className="flex items-center gap-3">
                        <span className="text-base font-semibold text-neutral-900 tabular-nums">
                          {formatPrice(lineTotal)}
                        </span>
                        <button
                          type="button"
                          onClick={() => removeItem(line.id)}
                          aria-label={`Retirer ${line.label ?? line.reference} du panier`}
                          className="rounded-full p-1.5 text-neutral-400 transition hover:bg-red-50 hover:text-red-600"
                        >
                          <Trash2 className="size-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                </li>
              );
            })}
          </ul>

          <div className="mt-3 flex items-center justify-between text-sm">
            <Link
              href="/catalogue"
              className="inline-flex items-center gap-1.5 text-neutral-600 hover:text-[var(--brand-dark)]"
            >
              <ArrowRight className="size-3.5 rotate-180" />
              Continuer mes achats
            </Link>
            <button
              type="button"
              onClick={handleClear}
              disabled={clearing}
              className="inline-flex items-center gap-1.5 text-neutral-500 transition hover:text-red-600 disabled:opacity-50"
            >
              <Trash2 className="size-3.5" />
              {clearing ? 'Vidage…' : 'Vider le panier'}
            </button>
          </div>
        </div>

        <aside className="card sticky top-6 h-fit p-5">
          <h2 className="font-display text-lg font-semibold">Récapitulatif</h2>
          <dl className="mt-4 space-y-2 text-sm">
            <div className="flex justify-between">
              <dt className="text-neutral-500">Sous-total HT</dt>
              <dd className="tabular-nums">
                {formatPrice(cart.totals?.totalExclVat ?? null)}
              </dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-neutral-500">TVA</dt>
              <dd className="tabular-nums">
                {formatPrice(cart.totals?.totalVat ?? null)}
              </dd>
            </div>
          </dl>
          <div className="mt-3 flex items-baseline justify-between border-t border-neutral-100 pt-3">
            <span className="font-medium">Total TTC</span>
            <span className="text-lg font-semibold text-[var(--brand-dark)] tabular-nums">
              {formatPrice(cart.totals?.totalInclVat ?? null)}
            </span>
          </div>
          <Link href="/commande" className="btn-primary mt-5 w-full">
            Passer la commande
          </Link>
          <p className="mt-3 text-center text-xs text-neutral-400">
            Livraison et adresse définies à l'étape suivante.
          </p>
        </aside>
      </div>
    </div>
  );
}
