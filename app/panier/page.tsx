'use client';

import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';
import { Minus, Plus, ShoppingCart } from 'lucide-react';
import { toast } from 'sonner';
import { useCart } from '@extracom/site-kit/react';
import { formatPrice } from '@extracom/site-kit';
import { AuthGate } from '@/components/site/AuthGate';
import { CartSkeleton } from '@/components/site/Loader';
import { EmptyState } from '@/components/site/EmptyState';
import {
  InputGroup,
  InputGroupButton,
  InputGroupInput,
} from '@/components/ui/input-group';

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
                itemLabel={line.label ?? line.reference}
                onChange={async (q) => {
                  try {
                    await updateLine(line.id, { quantity: q });
                  } catch {
                    toast.error('Impossible de mettre à jour la quantité.');
                  }
                }}
                onRemove={async () => {
                  try {
                    await removeItem(line.id);
                  } catch {
                    toast.error('Impossible de retirer cet article.');
                  }
                }}
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

function QuantityStepper({
  value,
  min = 1,
  itemLabel,
  onChange,
  onRemove,
}: {
  value: number;
  min?: number;
  itemLabel?: string;
  onChange: (quantity: number) => Promise<void> | void;
  onRemove: () => Promise<void> | void;
}) {
  const [draft, setDraft] = useState(String(value));
  const [busy, setBusy] = useState(false);
  const dirtyRef = useRef(false);

  // Resynchronise le champ quand la valeur du panier change depuis l'extérieur,
  // sauf si l'utilisateur est en train de saisir.
  useEffect(() => {
    if (!dirtyRef.current) setDraft(String(value));
  }, [value]);

  const commit = async (raw: string) => {
    dirtyRef.current = false;
    const parsed = parseInt(raw, 10);
    if (Number.isNaN(parsed)) {
      setDraft(String(value));
      return;
    }
    if (parsed <= 0) {
      await onRemove();
      return;
    }
    if (parsed === value) {
      setDraft(String(value));
      return;
    }
    setBusy(true);
    try {
      await onChange(parsed);
      setDraft(String(parsed));
    } finally {
      setBusy(false);
    }
  };

  const step = async (delta: number) => {
    const current = parseInt(draft, 10);
    const base = Number.isNaN(current) ? value : current;
    const next = Math.max(min, base + delta);
    dirtyRef.current = false;
    setDraft(String(next));
    if (next === value) return;
    setBusy(true);
    try {
      await onChange(next);
    } finally {
      setBusy(false);
    }
  };

  const decreaseLabel = itemLabel
    ? `Diminuer la quantité de ${itemLabel}`
    : 'Diminuer la quantité';
  const increaseLabel = itemLabel
    ? `Augmenter la quantité de ${itemLabel}`
    : 'Augmenter la quantité';
  const quantityLabel = itemLabel
    ? `Quantité de ${itemLabel}`
    : 'Quantité';

  return (
    <InputGroup className="w-28">
      <InputGroupButton
        type="button"
        aria-label={decreaseLabel}
        onClick={() => step(-1)}
        disabled={busy || value <= min}
      >
        <Minus />
      </InputGroupButton>
      <InputGroupInput
        type="number"
        inputMode="numeric"
        min={min}
        value={draft}
        onChange={(e) => {
          dirtyRef.current = true;
          setDraft(e.target.value);
        }}
        onBlur={(e) => commit(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === 'Enter') {
            e.preventDefault();
            (e.currentTarget as HTMLInputElement).blur();
          }
        }}
        disabled={busy}
        aria-label={quantityLabel}
        className="text-center"
      />
      <InputGroupButton
        type="button"
        aria-label={increaseLabel}
        onClick={() => step(1)}
        disabled={busy}
      >
        <Plus />
      </InputGroupButton>
    </InputGroup>
  );
}