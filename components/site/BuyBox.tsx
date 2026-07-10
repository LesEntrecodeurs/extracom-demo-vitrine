'use client';

import { useState } from 'react';
import { toast } from 'sonner';
import { ShoppingCart, Check, Loader2 } from 'lucide-react';
import { useAddToCart } from '@extracom/site-kit/react';
import { formatPrice, type Gamme, type GammeItem } from '@extracom/site-kit';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import {
  getAxisKind,
  getColorHex,
  isLightHex,
  type AxisKind
} from '@/data/variant-presets';

/**
 * Bloc d'achat de la fiche produit : sélection de déclinaison (gamme) +
 * ajout au panier. Si l'article a des déclinaisons, l'ajout est **bloqué**
 * tant qu'aucune n'est choisie ; le `variantId` envoyé est l'id de la
 * déclinaison sélectionnée.
 *
 * Le rendu de l'axe s'adapte à sa nature : pastilles de couleur pour un axe
 * « Couleur », grille claire pour un axe « Taille », pastilles texte pour
 * les autres (matière, modèle…).
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
    <div className="max-w-sm space-y-5">
      {axes.map((axis) => {
        const kind = getAxisKind(axis.label);
        const isMissing = hasVariants && variantId == null;
        return (
          <div key={axis.id}>
            <div className="mb-2 flex items-baseline justify-between">
              <p className="text-sm font-medium text-neutral-700">
                {axis.label}
                {isMissing && (
                  <span className="ml-1 text-red-500">*</span>
                )}
              </p>
            </div>
            {kind === 'color' ? (
              <ColorSwatches
                items={axis.items}
                selectedId={variantId}
                onSelect={setVariantId}
              />
            ) : kind === 'size' ? (
              <SizeGrid
                items={axis.items}
                selectedId={variantId}
                onSelect={setVariantId}
              />
            ) : (
              <TextChips
                items={axis.items}
                selectedId={variantId}
                onSelect={setVariantId}
              />
            )}
          </div>
        );
      })}

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

function ColorSwatches({
  items,
  selectedId,
  onSelect
}: {
  items: GammeItem[];
  selectedId: number | null;
  onSelect: (id: number) => void;
}) {
  return (
    <div className="flex flex-wrap gap-2.5">
      {items.map((it) => {
        const hex = getColorHex(it.label);
        const selected = selectedId === it.id;
        const needsBorder = hex ? isLightHex(hex) : true;
        return (
          <button
            key={it.id}
            type="button"
            onClick={() => onSelect(it.id)}
            aria-pressed={selected}
            aria-label={it.label}
            title={`${it.label}${it.price != null ? ` — ${formatPrice(it.price)}` : ''}`}
            className={cn(
              'relative size-9 rounded-full transition focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand)] focus-visible:ring-offset-2',
              needsBorder
                ? 'border border-neutral-300'
                : 'border border-transparent',
              selected && 'ring-2 ring-[var(--brand)] ring-offset-2'
            )}
            style={hex ? { backgroundColor: hex } : undefined}
          >
            {!hex && (
              <span className="absolute inset-0 flex items-center justify-center text-[10px] font-medium text-neutral-700">
                {initials(it.label)}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}

function SizeGrid({
  items,
  selectedId,
  onSelect
}: {
  items: GammeItem[];
  selectedId: number | null;
  onSelect: (id: number) => void;
}) {
  return (
    <div className="grid grid-cols-5 gap-2 sm:grid-cols-6">
      {items.map((it) => {
        const selected = selectedId === it.id;
        return (
          <button
            key={it.id}
            type="button"
            onClick={() => onSelect(it.id)}
            aria-pressed={selected}
            title={it.ean ? `EAN ${it.ean}` : it.label}
            className={cn(
              'flex h-11 items-center justify-center rounded-lg border text-sm font-medium transition focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand)] focus-visible:ring-offset-2',
              selected
                ? 'border-[var(--brand)] bg-[var(--brand)] text-white'
                : 'border-neutral-200 bg-white text-neutral-800 hover:border-neutral-300 hover:bg-neutral-50'
            )}
          >
            {it.label}
          </button>
        );
      })}
    </div>
  );
}

function TextChips({
  items,
  selectedId,
  onSelect
}: {
  items: GammeItem[];
  selectedId: number | null;
  onSelect: (id: number) => void;
}) {
  return (
    <div className="flex flex-wrap gap-2">
      {items.map((it) => {
        const selected = selectedId === it.id;
        return (
          <button
            key={it.id}
            type="button"
            onClick={() => onSelect(it.id)}
            aria-pressed={selected}
            title={it.ean ? `EAN ${it.ean}` : it.label}
            className={cn(
              'rounded-lg border px-3 py-1.5 text-sm transition focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand)] focus-visible:ring-offset-2',
              selected
                ? 'border-[var(--brand)] bg-[var(--brand-light)] text-[var(--brand-dark)]'
                : 'border-neutral-200 bg-white text-neutral-800 hover:border-neutral-300'
            )}
          >
            {it.label}
            {it.price != null && (
              <span
                className={cn(
                  'ml-1.5 text-xs',
                  selected ? 'text-[var(--brand-dark)]/70' : 'text-neutral-400'
                )}
              >
                {formatPrice(it.price)}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}

function initials(label: string): string {
  const cleaned = label.trim();
  if (!cleaned) return '?';
  const words = cleaned.split(/\s+/).slice(0, 2);
  return words.map((w) => w[0]?.toUpperCase() ?? '').join('') || '?';
}

// Réexport pour permettre la réutilisation du typage hors du fichier
// (par ex. si on ajoute un sélecteur de variantes ailleurs).
export type { AxisKind };