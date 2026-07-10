'use client';

import Link from 'next/link';
import { ShoppingCart } from 'lucide-react';
import { useCart } from '@extracom/site-kit/react';
import { formatPrice } from '@extracom/site-kit';
import { AuthGate } from '@/components/site/AuthGate';
import { CartSkeleton } from '@/components/site/Loader';
import { EmptyState } from '@/components/site/EmptyState';

export default function PanierPage() {
  return (
    <AuthGate message="Connectez-vous pour accéder à votre panier.">
      <PanierContent />
    </AuthGate>
  );
}

function PanierContent() {
  const { cart, isLoading, error, updateLine, removeItem } = useCart();

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

  // Total économisé grâce aux promos actives (TTC, agrégé par ligne).
  // Le prix client (`unitPrice`) est déjà remisé ; `unitBasePrice` est le prix
  // avant remise. On reconvertit en TTC via la TVA de chaque ligne.
  const promoSavingsTtc = cart.lines.reduce((sum, l) => {
    if (l.unitBasePrice == null || l.unitBasePrice <= l.unitPrice) return sum;
    const savingHt = (l.unitBasePrice - l.unitPrice) * l.quantity;
    const vatFactor = 1 + (typeof l.vatRate === 'number' ? l.vatRate : 0) / 100;
    return sum + savingHt * vatFactor;
  }, 0);

  return (
    <div className="grid gap-8 lg:grid-cols-[1fr_300px]">
      <div>
        <h1 className="mb-6 text-xl font-semibold">Votre panier</h1>
        <ul className="card divide-y divide-neutral-100">
          {cart.lines.map((line) => {
            const hasPromo =
              line.unitBasePrice != null && line.unitBasePrice > line.unitPrice;
            const promoPercent = hasPromo
              ? Math.round((1 - line.unitPrice / (line.unitBasePrice as number)) * 100)
              : 0;
            const lineSavingHt =
              hasPromo
                ? ((line.unitBasePrice as number) - line.unitPrice) * line.quantity
                : 0;
            const vatFactor = 1 + (typeof line.vatRate === 'number' ? line.vatRate : 0) / 100;
            const lineSavingTtc = lineSavingHt * vatFactor;
            return (
              <li
                key={line.id}
                className={`flex items-center gap-4 p-4 ${
                  hasPromo ? 'border-l-4 border-[var(--brand)] bg-[var(--brand-light)]/60' : ''
                }`}
              >
                <div className="flex-1">
                  <p className="font-medium">{line.label ?? line.reference}</p>
                  {line.variantLabel && (
                    <p className="text-xs text-neutral-500">
                      Déclinaison : {line.variantLabel}
                    </p>
                  )}
                  {hasPromo && (
                    <div className="mt-1.5 inline-flex items-center gap-2 rounded-md bg-[var(--brand)] px-2 py-1 text-xs font-semibold uppercase tracking-wide text-white shadow-sm">
                      <span>Promo</span>
                      <span className="rounded bg-white/20 px-1.5 py-0.5 text-[11px]">
                        −{promoPercent}%
                      </span>
                    </div>
                  )}
                  {hasPromo ? (
                    <div className="mt-2 flex flex-wrap items-baseline gap-x-2 text-sm">
                      <span className="text-neutral-400 line-through">
                        {formatPrice(line.unitBasePrice as number)} /{' '}
                        {line.unit ?? 'unité'}
                      </span>
                      <span className="font-semibold text-[var(--brand-dark)]">
                        {formatPrice(line.unitPrice)} / {line.unit ?? 'unité'}
                      </span>
                    </div>
                  ) : (
                    <p className="mt-1 text-sm text-neutral-500">
                      {formatPrice(line.unitPrice)} / {line.unit ?? 'unité'}
                    </p>
                  )}
                  {hasPromo && (
                    <p className="mt-1 text-xs font-medium text-[var(--brand-dark)]">
                      Vous économisez {formatPrice(lineSavingTtc)} sur cette ligne
                    </p>
                  )}
                </div>
                <input
                  type="number"
                  min={1}
                  defaultValue={line.quantity}
                  onBlur={(e) =>
                    updateLine(line.id, { quantity: Number(e.target.value) })
                  }
                  className="field w-16 text-center"
                />
                <div className="w-24 text-right font-medium">
                  {formatPrice(
                    line.lineTotalInclVat ?? line.unitPrice * line.quantity
                  )}
                </div>
                <button
                  type="button"
                  onClick={() => removeItem(line.id)}
                  aria-label={`Retirer ${line.label ?? line.reference} du panier`}
                  className="text-sm text-neutral-400 hover:text-red-600"
                >
                  <span aria-hidden="true">✕</span>
                </button>
              </li>
            );
          })}
        </ul>
      </div>

      <aside className="card h-fit p-5">
        <h2 className="text-sm font-medium text-neutral-500">Récapitulatif</h2>
        <div className="mt-3 flex justify-between text-sm">
          <span>Sous-total HT</span>
          <span>{formatPrice(cart.totals?.totalExclVat ?? null)}</span>
        </div>
        <div className="mt-1 flex justify-between text-sm">
          <span>TVA</span>
          <span>{formatPrice(cart.totals?.totalVat ?? null)}</span>
        </div>
        {promoSavingsTtc > 0 && (
          <div className="mt-4 flex items-center justify-between rounded-md border border-[var(--brand)] bg-[var(--brand-light)] px-3 py-2 text-sm font-medium text-[var(--brand-dark)]">
            <span className="flex items-center gap-2">
              <span aria-hidden="true">🏷️</span>
              Vous économisez grâce aux promos
            </span>
            <span className="font-semibold">−{formatPrice(promoSavingsTtc)}</span>
          </div>
        )}
        <div className="mt-3 flex justify-between border-t border-neutral-100 pt-3 text-lg font-semibold">
          <span>Total TTC</span>
          <span>{formatPrice(cart.totals?.totalInclVat ?? null)}</span>
        </div>
        <Link href="/commande" className="btn-primary mt-5 w-full">
          Commander
        </Link>
      </aside>
    </div>
  );
}
