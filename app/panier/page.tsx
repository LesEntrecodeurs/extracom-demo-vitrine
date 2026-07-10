'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ShoppingCart } from 'lucide-react';
import { toast } from 'sonner';
import { useCart } from '@extracom/site-kit/react';
import { formatPrice } from '@extracom/site-kit';
import { AuthGate } from '@/components/site/AuthGate';
import { CartSkeleton } from '@/components/site/Loader';
import { EmptyState } from '@/components/site/EmptyState';
import { QuantityStepper } from '@/components/site/QuantityStepper';

export default function PanierPage() {
  return (
    <AuthGate message="Connectez-vous pour accéder à votre panier.">
      <PanierContent />
    </AuthGate>
  );
}

function PanierContent() {
  const { cart, isLoading, error, updateLine, removeItem } = useCart();
  const [updatingLineId, setUpdatingLineId] = useState<string | null>(null);
  const [removingLineId, setRemovingLineId] = useState<string | null>(null);

  const changeQuantity = async (lineId: string, quantity: number) => {
    setUpdatingLineId(lineId);
    try {
      await updateLine(lineId, { quantity });
    } catch {
      toast.error('Impossible de mettre à jour la quantité.');
    } finally {
      setUpdatingLineId(null);
    }
  };

  const removeLine = async (lineId: string, label: string | undefined) => {
    setRemovingLineId(lineId);
    try {
      await removeItem(lineId);
      toast.success('Article retiré du panier.');
    } catch {
      toast.error('Impossible de retirer cet article.');
    } finally {
      setRemovingLineId(null);
      void label;
    }
  };

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

  return (
    <div className="grid gap-8 lg:grid-cols-[1fr_300px]">
      <div>
        <h1 className="mb-6 text-xl font-semibold">Votre panier</h1>
        <ul className="card divide-y divide-neutral-100">
          {cart.lines.map((line) => {
            const isUpdating = updatingLineId === line.id;
            const isRemoving = removingLineId === line.id;
            const rowDisabled = isUpdating || isRemoving;
            return (
              <li
                key={line.id}
                className="flex flex-wrap items-center gap-3 p-4 sm:flex-nowrap sm:gap-4"
              >
                <div className="min-w-0 flex-1">
                  <p className="font-medium">{line.label ?? line.reference}</p>
                  {line.variantLabel && (
                    <p className="text-xs text-neutral-500">
                      Déclinaison : {line.variantLabel}
                    </p>
                  )}
                  <p className="text-sm text-neutral-500">
                    {formatPrice(line.unitPrice)} / {line.unit ?? 'unité'}
                  </p>
                </div>
                <QuantityStepper
                  value={line.quantity}
                  onChange={(q) => changeQuantity(line.id, q)}
                  disabled={rowDisabled}
                  loading={isUpdating}
                  ariaLabel={`Quantité pour ${line.label ?? line.reference}`}
                />
                <div className="w-28 text-right font-medium">
                  {formatPrice(
                    line.lineTotalInclVat ?? line.unitPrice * line.quantity
                  )}
                </div>
                <button
                  type="button"
                  onClick={() => removeLine(line.id, line.label ?? line.reference)}
                  disabled={rowDisabled}
                  aria-label={`Retirer ${line.label ?? line.reference} du panier`}
                  className="grid size-8 place-items-center rounded text-sm text-neutral-400 transition hover:bg-red-50 hover:text-red-600 disabled:cursor-not-allowed disabled:opacity-40"
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