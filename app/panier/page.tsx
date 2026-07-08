'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { Minus, Plus, ShoppingCart } from 'lucide-react';
import { toast } from 'sonner';
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
  const [pending, setPending] = useState<Record<string, boolean>>({});

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

  const setQuantity = async (lineId: string, next: number) => {
    setPending((p) => ({ ...p, [lineId]: true }));
    try {
      await updateLine(lineId, { quantity: next });
    } catch {
      toast.error('Quantité non mise à jour, réessayez.');
    } finally {
      setPending((p) => ({ ...p, [lineId]: false }));
    }
  };

  const removeLine = async (lineId: string) => {
    setPending((p) => ({ ...p, [lineId]: true }));
    try {
      await removeItem(lineId);
    } catch {
      toast.error('Ligne non retirée, réessayez.');
    } finally {
      setPending((p) => ({ ...p, [lineId]: false }));
    }
  };

  return (
    <div className="grid gap-8 lg:grid-cols-[1fr_300px]">
      <div>
        <h1 className="mb-6 text-xl font-semibold">Votre panier</h1>
        <ul className="card divide-y divide-neutral-100">
          {cart.lines.map((line) => (
            <li key={line.id} className="flex items-center gap-4 p-4">
              <div className="flex-1">
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
                min={1}
                busy={!!pending[line.id]}
                onChange={(q) => setQuantity(line.id, q)}
              />
              <div className="w-24 text-right font-medium">
                {formatPrice(
                  line.lineTotalInclVat ?? line.unitPrice * line.quantity
                )}
              </div>
              <button
                type="button"
                onClick={() => removeLine(line.id)}
                disabled={pending[line.id]}
                aria-label={`Retirer ${line.label ?? line.reference} du panier`}
                className="text-sm text-neutral-400 hover:text-red-600 disabled:opacity-50"
              >
                <span aria-hidden="true">✕</span>
              </button>
            </li>
          ))}
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

/** Sélecteur de quantité contrôlé pour une ligne du panier.
 *  Boutons - / + et saisie directe ; bloque la ligne pendant la mise à jour. */
function QuantityStepper({
  value,
  min,
  busy,
  onChange
}: {
  value: number;
  min: number;
  busy: boolean;
  onChange: (next: number) => void;
}) {
  const [draft, setDraft] = useState(String(value));

  // Synchronise le champ avec la valeur serveur quand elle change
  // (mise à jour réseau, autres actions externes), sans écraser une saisie
  // en cours qui correspondrait déjà à la nouvelle valeur.
  useEffect(() => {
    setDraft((current) =>
      Number(current) === value ? current : String(value)
    );
  }, [value]);

  const commit = (raw: string | number) => {
    const next = typeof raw === 'number' ? raw : Number(raw);
    if (!Number.isFinite(next) || next < min) {
      setDraft(String(value));
      return;
    }
    onChange(next);
  };

  return (
    <div className="inline-flex items-center overflow-hidden rounded-full border border-neutral-300 bg-white">
      <button
        type="button"
        aria-label="Diminuer la quantité"
        disabled={busy || Number(draft) <= min}
        onClick={() => commit(Number(draft) - 1)}
        className="grid h-9 w-9 place-items-center text-neutral-600 transition hover:bg-neutral-100 disabled:cursor-not-allowed disabled:opacity-40"
      >
        <Minus className="size-4" />
      </button>
      <input
        type="number"
        inputMode="numeric"
        min={min}
        value={draft}
        disabled={busy}
        onChange={(e) => setDraft(e.target.value)}
        onBlur={() => commit(draft)}
        onKeyDown={(e) => {
          if (e.key === 'Enter') (e.target as HTMLInputElement).blur();
        }}
        aria-label="Quantité"
        className="h-9 w-14 border-x border-neutral-200 bg-white px-2 text-center text-sm text-neutral-900 outline-none focus:ring-2 focus:ring-[var(--brand-light)] disabled:cursor-not-allowed disabled:opacity-50 [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
      />
      <button
        type="button"
        aria-label="Augmenter la quantité"
        disabled={busy}
        onClick={() => commit(Number(draft) + 1)}
        className="grid h-9 w-9 place-items-center text-neutral-600 transition hover:bg-neutral-100 disabled:cursor-not-allowed disabled:opacity-40"
      >
        <Plus className="size-4" />
      </button>
    </div>
  );
}
