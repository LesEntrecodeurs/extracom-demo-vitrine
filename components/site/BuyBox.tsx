'use client';

import { useState } from 'react';
import { toast } from 'sonner';
import { ShoppingCart, Check, Loader2, HelpCircle } from 'lucide-react';
import { useAddToCart } from '@extracom/site-kit/react';
import { formatPrice, type Gamme } from '@extracom/site-kit';
import { Button } from '@/components/ui/button';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger
} from '@/components/ui/tooltip';

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
    <TooltipProvider delayDuration={150}>
      <div className="max-w-sm space-y-4">
        {axes.map((axis) => (
          <div key={axis.id}>
            <div className="mb-1.5 flex items-center gap-1.5 text-sm font-medium text-neutral-700">
              <span>
                {axis.label}
                {hasVariants && variantId == null && (
                  <span className="ml-1 text-red-500">*</span>
                )}
              </span>
              <Tooltip>
                <TooltipTrigger asChild>
                  <button
                    type="button"
                    aria-label={`En savoir plus sur le choix « ${axis.label} »`}
                    className="inline-flex size-4 items-center justify-center rounded-full text-neutral-400 transition hover:bg-neutral-100 hover:text-neutral-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand)]"
                  >
                    <HelpCircle className="size-3.5" />
                  </button>
                </TooltipTrigger>
                <TooltipContent side="top" className="max-w-xs">
                  <p>
                    Chaque option correspond à une version précise de cet
                    article. Le prix ou la référence peuvent varier selon votre
                    choix.
                  </p>
                </TooltipContent>
              </Tooltip>
            </div>
            <div className="flex flex-wrap gap-2">
              {axis.items.map((it) => {
                const selected = variantId === it.id;
                return (
                  <button
                    key={it.id}
                    type="button"
                    onClick={() => setVariantId(it.id)}
                    className={`rounded-lg border px-3 py-1.5 text-sm transition ${
                      selected
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
              : hasVariants && variantId == null
                ? 'Choisissez une déclinaison'
                : 'Ajouter au panier'}
        </Button>
      </div>
    </TooltipProvider>
  );
}
