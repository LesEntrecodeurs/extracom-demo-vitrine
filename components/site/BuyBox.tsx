'use client';

import { useMemo, useState } from 'react';
import { toast } from 'sonner';
import { ShoppingCart, Check, Loader2 } from 'lucide-react';
import { useAddToCart } from '@extracom/site-kit/react';
import {
  formatPrice,
  type Gamme,
  type GammeItem,
  type Promotion
} from '@extracom/site-kit';
import { Button } from '@/components/ui/button';

/**
 * Bloc d'achat de la fiche produit : sélection de déclinaison (gamme) +
 * ajout au panier. Si l'article a des déclinaisons, l'ajout est **bloqué**
 * tant qu'aucune n'est choisie ; le `variantId` envoyé est l'id de la
 * déclinaison sélectionnée. Le prix affiché réagit à la sélection : il
 * montre le prix de la variante choisie (s'il existe) ou le prix initial.
 */
export function BuyBox({
  reference,
  gammes,
  priceHidden,
  initialPrice,
  basePrice,
  promotion,
  vatRate
}: {
  reference: string;
  gammes?: Gamme[];
  priceHidden?: boolean;
  initialPrice?: number | null;
  basePrice?: number | null;
  promotion?: Promotion | null;
  vatRate?: number;
}) {
  const axes = (gammes ?? []).filter((g) => g.items.length > 0);
  const hasVariants = axes.length > 0;
  const { addItem, isLoading } = useAddToCart();
  const [variantId, setVariantId] = useState<number | null>(null);
  const [added, setAdded] = useState(false);

  // Variante choisie (et son axe) — calculée à partir du variantId.
  const { selectedVariant, selectedAxis } = useMemo(() => {
    if (variantId == null) return { selectedVariant: null, selectedAxis: null };
    for (const axis of axes) {
      const found = axis.items.find((it) => it.id === variantId);
      if (found) return { selectedVariant: found, selectedAxis: axis };
    }
    return { selectedVariant: null, selectedAxis: null };
  }, [variantId, axes]);

  // Prix courant : variante sélectionnée (si elle porte un prix), sinon article parent.
  const displayedPrice = selectedVariant?.price ?? initialPrice ?? null;
  const hasDisplayPrice = displayedPrice != null && !priceHidden;

  const canAdd = !priceHidden && (!hasVariants || variantId != null);

  return (
    <div className="max-w-sm space-y-4">
      {/* Prix : réagit à la sélection de la déclinaison */}
      <div className="space-y-1">
        {priceHidden ? (
          <p className="text-sm text-neutral-500">
            Connectez-vous pour voir votre tarif
          </p>
        ) : hasDisplayPrice ? (
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold text-[var(--brand-dark)]">
              {formatPrice(displayedPrice!)}
            </span>
            {basePrice != null && basePrice > displayedPrice! && (
              <span className="text-sm text-neutral-400 line-through">
                {formatPrice(basePrice)}
              </span>
            )}
            {promotion && (
              <span className="rounded-full bg-red-50 px-2 py-0.5 text-xs font-medium text-red-600">
                -{promotion.discountPercent}%
              </span>
            )}
            {typeof vatRate === 'number' && (
              <span className="text-xs text-neutral-400">TVA {vatRate}%</span>
            )}
          </div>
        ) : null}
      </div>

      {/* Axes de sélection (Couleur, Taille…) */}
      {axes.map((axis) => (
        <div key={axis.id}>
          <p className="mb-1.5 text-sm font-medium text-neutral-700">
            {axis.label}
            {hasVariants && variantId == null && (
              <span className="ml-1 text-red-500">*</span>
            )}
          </p>
          <div
            role="radiogroup"
            aria-label={axis.label}
            className="flex flex-wrap gap-2"
          >
            {axis.items.map((it) => {
              const selected = variantId === it.id;
              return (
                <button
                  key={it.id}
                  type="button"
                  role="radio"
                  aria-checked={selected}
                  onClick={() => setVariantId(it.id)}
                  className={`rounded-lg border px-3 py-1.5 text-sm transition ${
                    selected
                      ? 'border-[var(--brand)] bg-[var(--brand-light)] font-medium text-[var(--brand-dark)] ring-2 ring-[var(--brand)] ring-offset-1'
                      : 'border-neutral-200 hover:border-neutral-400'
                  }`}
                  title={it.ean ? `EAN ${it.ean}` : undefined}
                >
                  {it.label}
                </button>
              );
            })}
          </div>
        </div>
      ))}

      {/* Récap de la sélection en cours */}
      {selectedVariant && selectedAxis && (
        <p className="rounded-md bg-neutral-50 px-3 py-2 text-sm text-neutral-700">
          <span className="text-neutral-500">{selectedAxis.label} :</span>{' '}
          <span className="font-medium text-neutral-900">
            {selectedVariant.label}
          </span>
        </p>
      )}

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
