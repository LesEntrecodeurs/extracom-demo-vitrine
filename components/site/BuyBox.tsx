'use client';

import { useState } from 'react';
import { toast } from 'sonner';
import { ShoppingCart, Check, Loader2 } from 'lucide-react';
import { useAddToCart } from '@extracom/site-kit/react';
import { formatPrice, type Gamme } from '@extracom/site-kit';
import { Button } from '@/components/ui/button';

/**
 * Bloc d'achat de la fiche produit : sélection de déclinaison (gamme) +
 * ajout au panier. Chaque axe (Couleur, Taille…) garde son choix
 * indépendamment ; le bouton n'est actif que lorsque toutes les
 * sélections sont faites. Le `variantId` envoyé au panier est l'id de
 * la valeur du dernier axe sélectionné — c'est ce qu'accepte le kit
 * (un seul identifiant de variante par ajout).
 */
export function BuyBox({
  reference,
  gammes,
  priceHidden
}: {
  reference: string;
  gammes?: Gamme[];
  priceHidden?: boolean;
}) {
  const axes = (gammes ?? []).filter((g) => g.items.length > 0);
  const hasVariants = axes.length > 0;
  const { addItem, isLoading } = useAddToCart();
  const [selected, setSelected] = useState<Record<number, number>>({});
  const [added, setAdded] = useState(false);

  const isComplete =
    !hasVariants || axes.every((axis) => selected[axis.id] != null);
  const canAdd = !priceHidden && isComplete;

  const variantId =
    axes.length > 0 ? selected[axes[axes.length - 1].id] ?? null : null;

  return (
    <div className="max-w-sm space-y-4">
      {axes.map((axis) => (
        <div key={axis.id}>
          <p className="mb-1.5 text-sm font-medium text-neutral-700">
            {axis.label}
            {hasVariants && selected[axis.id] == null && (
              <span className="ml-1 text-red-500">*</span>
            )}
          </p>
          <div className="flex flex-wrap gap-2">
            {axis.items.map((it) => {
              const isSelected = selected[axis.id] === it.id;
              return (
                <button
                  key={it.id}
                  type="button"
                  onClick={() =>
                    setSelected((prev) => ({ ...prev, [axis.id]: it.id }))
                  }
                  aria-pressed={isSelected}
                  className={`rounded-lg border px-3 py-1.5 text-sm transition ${
                    isSelected
                      ? 'border-[var(--brand)] bg-[var(--brand-light)] text-[var(--brand-dark)]'
                      : 'border-neutral-200 hover:border-neutral-300'
                  }`}
                  title={it.ean ? `EAN ${it.ean}` : undefined}
                >
                  {it.label}
                  {it.price != null && (
                    <span className="ml-1.5 text-neutral-400">
                      {formatPrice(it.price)}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      ))}

      <Button
        type="button"
        disabled={!canAdd || isLoading}
        className="w-full"
        onClick={async () => {
          try {
            await addItem({
              reference,
              quantity: 1,
              variantId: variantId ?? undefined
            });
            setAdded(true);
            toast.success('Ajouté au panier');
            setTimeout(() => setAdded(false), 1500);
          } catch {
            toast.error("Impossible d'ajouter au panier");
          }
        }}
      >
        {isLoading ? (
          <Loader2 className="size-4 animate-spin" />
        ) : added ? (
          <Check className="size-4" />
        ) : (
          <ShoppingCart className="size-4" />
        )}
        {isLoading
          ? '…'
          : added
            ? 'Ajouté'
            : hasVariants && !isComplete
              ? 'Choisissez vos options'
              : 'Ajouter au panier'}
      </Button>
    </div>
  );
}