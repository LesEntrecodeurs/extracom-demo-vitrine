'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Minus, Plus, ShoppingCart } from 'lucide-react';
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
            <PanierLine
              key={line.id}
              line={line}
              onUpdate={(quantity) => updateLine(line.id, { quantity })}
              onRemove={() => removeItem(line.id)}
            />
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

interface PanierLineProps {
  line: {
    id: string;
    label?: string | null;
    reference: string;
    variantLabel?: string | null;
    unitPrice: number | null;
    unit?: string | null;
    quantity: number;
    lineTotalInclVat?: number | null;
  };
  onUpdate: (quantity: number) => void | Promise<void>;
  onRemove: () => void | Promise<void>;
}

function PanierLine({ line, onUpdate, onRemove }: PanierLineProps) {
  const [value, setValue] = useState(line.quantity);

  // Resynchronise l'affichage quand le panier est mis à jour (ex : après updateLine).
  useEffect(() => {
    setValue(line.quantity);
  }, [line.quantity]);

  const apply = (next: number) => {
    const safe = Math.max(1, Math.floor(next));
    setValue(safe);
    if (safe !== line.quantity) onUpdate(safe);
  };

  const name = line.label ?? line.reference;

  return (
    <li className="flex flex-wrap items-center gap-4 p-4">
      <div className="min-w-0 flex-1">
        <p className="font-medium">{name}</p>
        {line.variantLabel && (
          <p className="text-xs text-neutral-500">
            Déclinaison : {line.variantLabel}
          </p>
        )}
        <p className="text-sm text-neutral-500">
          {formatPrice(line.unitPrice)} / {line.unit ?? 'unité'}
        </p>
      </div>
      <InputGroup className="w-32">
        <InputGroupButton
          aria-label={`Diminuer la quantité de ${name}`}
          onClick={() => apply(value - 1)}
          disabled={value <= 1}
        >
          <Minus />
        </InputGroupButton>
        <InputGroupInput
          type="number"
          min={1}
          step={1}
          value={value}
          onChange={(e) =>
            setValue(Math.max(1, Number(e.target.value) || 1))
          }
          onBlur={() => apply(value)}
          aria-label={`Quantité de ${name}`}
          className="px-2 text-center"
        />
        <InputGroupButton
          aria-label={`Augmenter la quantité de ${name}`}
          onClick={() => apply(value + 1)}
        >
          <Plus />
        </InputGroupButton>
      </InputGroup>
      <div className="w-24 text-right font-medium">
        {formatPrice(
          line.lineTotalInclVat ?? line.unitPrice * line.quantity
        )}
      </div>
      <button
        type="button"
        onClick={onRemove}
        aria-label={`Retirer ${name} du panier`}
        className="text-sm text-neutral-400 hover:text-red-600"
      >
        <span aria-hidden="true">✕</span>
      </button>
    </li>
  );
}
