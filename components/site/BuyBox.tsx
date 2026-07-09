'use client';

import { useMemo, useState } from 'react';
import { toast } from 'sonner';
import { ShoppingCart, Check, Loader2 } from 'lucide-react';
import { useAddToCart } from '@extracom/site-kit/react';
import { formatPrice, type Gamme } from '@extracom/site-kit';
import { Button } from '@/components/ui/button';

/**
 * Bloc d'achat de la fiche produit.
 *
 * Sélection des déclinaisons (une par item, multi-axes) + ajout au panier.
 * - Chaque « item » de chaque axe représente une combinaison produit
 *   (variante concrète). L'utilisateur peut cocher plusieurs items, par
 *   exemple une couleur ET une taille : chaque item est une ligne distincte
 *   ajoutée au panier (quantité 1 par défaut).
 * - L'ajout est bloqué tant qu'aucun item n'est sélectionné sur un produit
 *   qui possède des déclinaisons.
 * - `variantId` envoyé au panier = l'id de l'item (le kit attend un id
 *   singulier par ligne ; on ajoute donc une ligne par item sélectionné).
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
  const axes = useMemo(
    () => (gammes ?? []).filter((g) => g.items.length > 0),
    [gammes]
  );
  const allItems = useMemo(
    () => axes.flatMap((a) => a.items.map((it) => ({ axisId: a.id, it }))),
    [axes]
  );
  const hasVariants = allItems.length > 0;

  const { addItem, isLoading } = useAddToCart();
  // Map itemId → item, pour retrouver prix / label à l'ajout.
  const itemById = useMemo(() => {
    const m = new Map<number, { axisId: number; label: string; price?: number | null }>();
    for (const { axisId, it } of allItems) m.set(it.id, { axisId, label: it.label, price: it.price });
    return m;
  }, [allItems]);
  const [selectedIds, setSelectedIds] = useState<Set<number>>(new Set());

  const canAdd = !priceHidden && (!hasVariants || selectedIds.size > 0);

  function toggle(itemId: number) {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(itemId)) next.delete(itemId);
      else next.add(itemId);
      return next;
    });
  }

  async function handleAdd() {
    if (isLoading) return;
    const ids = Array.from(selectedIds);
    let addedCount = 0;
    let firstError: unknown = null;
    for (const id of ids) {
      try {
        await addItem({ reference, quantity: 1, variantId: id });
        addedCount += 1;
      } catch (e) {
        if (!firstError) firstError = e;
      }
    }
    if (addedCount > 0) {
      toast.success(
        addedCount === 1
          ? 'Ajouté au panier'
          : `${addedCount} articles ajoutés au panier`
      );
      // Vide la sélection après ajout réussi pour repartir sur du propre.
      setSelectedIds(new Set());
    } else {
      toast.error("Impossible d'ajouter au panier");
    }
  }

  return (
    <div className="max-w-md space-y-5">
      {axes.map((axis) => (
        <div key={axis.id}>
          <div className="mb-2 flex items-baseline justify-between">
            <p className="text-sm font-medium text-neutral-700">
              {axis.label}
              {hasVariants && selectedIds.size === 0 && (
                <span className="ml-1 text-red-500">*</span>
              )}
            </p>
            <p className="text-xs text-neutral-400">
              {(() => {
                const n = axis.items.filter((it) => selectedIds.has(it.id)).length;
                if (n === 0) return 'Sélectionnez une ou plusieurs options';
                if (n === 1) return '1 option choisie';
                return `${n} options choisies`;
              })()}
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            {axis.items.map((it) => {
              const selected = selectedIds.has(it.id);
              return (
                <button
                  key={it.id}
                  type="button"
                  onClick={() => toggle(it.id)}
                  aria-pressed={selected}
                  className={`rounded-lg border px-3 py-1.5 text-sm transition ${
                    selected
                      ? 'border-[var(--brand)] bg-[var(--brand-light)] text-[var(--brand-dark)] ring-1 ring-[var(--brand)]/40'
                      : 'border-neutral-200 hover:border-neutral-300'
                  }`}
                  title={it.ean ? `EAN ${it.ean}` : undefined}
                >
                  <span className="inline-flex items-center gap-1.5">
                    {selected && <Check className="size-3.5" />}
                    {it.label}
                  </span>
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

      {hasVariants && selectedIds.size > 1 && (
        <div className="rounded-md border border-neutral-200 bg-neutral-50 px-3 py-2 text-sm text-neutral-600">
          {Array.from(selectedIds)
            .map((id) => itemById.get(id)?.label)
            .filter(Boolean)
            .join(' · ')}
        </div>
      )}

      <Button
        type="button"
        disabled={!canAdd || isLoading}
        className="w-full"
        onClick={handleAdd}
      >
        {isLoading ? (
          <Loader2 className="size-4 animate-spin" />
        ) : (
          <ShoppingCart className="size-4" />
        )}
        {isLoading
          ? '…'
          : !hasVariants
            ? 'Ajouter au panier'
            : selectedIds.size === 0
              ? 'Choisissez au moins une option'
              : selectedIds.size === 1
                ? 'Ajouter au panier'
                : `Ajouter ${selectedIds.size} articles au panier`}
      </Button>
    </div>
  );
}
