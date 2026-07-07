'use client';

import { useState } from 'react';
import { toast } from 'sonner';
import { ShoppingCart, Check, Loader2 } from 'lucide-react';
import { useAddToCart } from '@extracom/site-kit/react';
import { formatPrice, type Gamme } from '@extracom/site-kit';
import { Button } from '@/components/ui/button';

/**
 * Bloc d'achat de la fiche produit : sélection de déclinaison (gamme) +
 * ajout au panier. Si l'article a des déclinaisons, l'ajout est **bloqué**
 * tant qu'aucune n'est choisie ; le `variantId` envoyé est l'id de la
 * déclinaison sélectionnée.
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
  const [variantId, setVariantId] = useState<number | null>(null);
  const [added, setAdded] = useState(false);

  const canAdd = !priceHidden && (!hasVariants || variantId != null);

  return (
    <div className="max-w-sm space-y-4">
      {axes.map((axis) => (
        <div key={axis.id}>
          <p className="mb-1.5 text-sm font-medium text-neutral-700">
            {axis.label}
            {hasVariants && variantId == null && (
              <span className="ml-1 text-red-500">*</span>
            )}
          </p>
          <div className="flex flex-wrap gap-2">
            {axis.items.map((it) => {
              const selected = variantId === it.id;
              return (
                <button
                  key={it.id}
                  type="button"
                  onClick={() => setVariantId(it.id)}
                  aria-pressed={selected}
                  className={`inline-flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-sm font-medium transition ${
                    selected
                      ? 'border-[var(--brand)] bg-[var(--brand-light)] text-[var(--brand-dark)] shadow-sm ring-1 ring-[var(--brand)]'
                      : 'border-neutral-200 bg-white text-neutral-700 hover:border-neutral-400 hover:bg-neutral-50'
                  }`}
                  title={it.ean ? `EAN ${it.ean}` : undefined}
                >
                  {selected && <Check className="size-3.5" />}
                  {it.label}
                  {it.price != null && (
                    <span
                      className={`ml-1 ${
                        selected ? 'text-[var(--brand-dark)]/70' : 'text-neutral-400'
                      }`}
                    >
                      {formatPrice(it.price)}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      ))}

      {hasVariants && variantId != null && (() => {
        const selected = axes
          .flatMap((a) => a.items.map((it) => ({ axis: a, item: it })))
          .find((x) => x.item.id === variantId);
        if (!selected) return null;
        return (
          <div className="flex items-start gap-2 rounded-lg border border-[var(--brand)]/30 bg-[var(--brand-light)]/60 px-3 py-2.5 text-sm">
            <Check className="mt-0.5 size-4 shrink-0 text-[var(--brand-dark)]" />
            <div className="flex-1">
              <p className="font-medium text-[var(--brand-dark)]">
                Votre sélection : {selected.axis.label} — {selected.item.label}
              </p>
              {selected.item.price != null && (
                <p className="mt-0.5 text-xs text-neutral-600">
                  Prix de cette déclinaison : {formatPrice(selected.item.price)}
                </p>
              )}
            </div>
          </div>
        );
      })()}

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
            : hasVariants && variantId == null
              ? 'Choisissez une déclinaison'
              : 'Ajouter au panier'}
      </Button>
    </div>
  );
}
