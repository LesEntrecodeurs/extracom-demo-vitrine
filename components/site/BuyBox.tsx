'use client';

import { useState } from 'react';
import { toast } from 'sonner';
import { ShoppingCart, Check, Loader2 } from 'lucide-react';
import { useAddToCart } from '@extracom/site-kit/react';
import { formatPrice, type Gamme, type GammeItem } from '@extracom/site-kit';
import { Button } from '@/components/ui/button';

/* Petite table des couleurs les plus courantes côté catalogue (FR + quelques
   équivalents anglais). Permet de transformer un libellé "Rouge", "Bleu
   marine", "Bordeaux"… en pastille. Les libellés non reconnus tombent sur un
   gris neutre — l'utilisateur voit toujours le nom sous la pastille. */
const COLOR_HEX: Record<string, string> = {
  rouge: '#dc2626',
  'rouge foncé': '#7f1d1d',
  bordeaux: '#7f1d1d',
  cerise: '#be123c',
  corail: '#fb7185',
  orange: '#ea580c',
  pêche: '#fdba74',
  jaune: '#eab308',
  moutarde: '#ca8a04',
  or: '#d4a017',
  beige: '#d6c7a3',
  ivoire: '#fffff0',
  crème: '#fffdd0',
  vert: '#16a34a',
  'vert foncé': '#166534',
  sapin: '#1f4d2b',
  olive: '#65731f',
  kaki: '#a3a06b',
  menthe: '#7eecc1',
  sarcelle: '#0e7c7b',
  turquoise: '#14b8a6',
  cyan: '#06b6d4',
  bleu: '#2563eb',
  'bleu marine': '#1e3a8a',
  marine: '#1e3a8a',
  cobalt: '#1d4ed8',
  roi: '#1e40af',
  ciel: '#7dd3fc',
  lavande: '#b8a4d4',
  violet: '#7c3aed',
  pourpre: '#6b21a8',
  prune: '#581c87',
  rose: '#ec4899',
  fuchsia: '#d946ef',
  magenta: '#d946ef',
  saumon: '#fa8072',
  marron: '#7c2d12',
  chocolat: '#3b1f0f',
  camel: '#c19a6b',
  taupe: '#9c8b7a',
  gris: '#9ca3af',
  'gris foncé': '#374151',
  anthracite: '#1f2937',
  argent: '#c0c0c0',
  noir: '#111111',
  blanc: '#f5f5f5',
  écru: '#e8e2c9',
  naturel: '#e5d9b6',
  transparent: '#e5e7eb'
};

function normalize(s: string): string {
  return s
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .trim();
}

function isColorAxis(label: string): boolean {
  const n = normalize(label);
  return (
    n.includes('couleur') ||
    n.includes('color') ||
    n.includes('colour') ||
    n.includes('teinte') ||
    n.includes('coloris')
  );
}

function ColorSwatch({
  item,
  selected,
  onSelect
}: {
  item: GammeItem;
  selected: boolean;
  onSelect: () => void;
}) {
  const hex = colorHexFor(item.label);
  const isWhite = hex === '#f5f5f5' || hex === '#fffff0' || hex === '#fffdd0';
  return (
    <button
      type="button"
      onClick={onSelect}
      className="group flex w-16 flex-col items-center gap-1 text-center"
      title={item.ean ? `EAN ${item.ean}` : item.label}
      aria-label={item.label}
      aria-pressed={selected}
    >
      <span
        className={`relative flex size-9 items-center justify-center rounded-full transition ${
          selected
            ? 'ring-2 ring-[var(--brand)] ring-offset-2'
            : 'ring-1 ring-neutral-300 group-hover:ring-neutral-400'
        } ${isWhite ? 'border border-neutral-200' : ''}`}
        style={{ backgroundColor: hex ?? '#e5e7eb' }}
      >
        {!hex && (
          <span className="text-[10px] font-medium text-neutral-500">?</span>
        )}
        {selected && (
          <Check
            className="size-4"
            style={{
              color: isWhite ? '#111' : '#fff',
              strokeWidth: 3
            }}
          />
        )}
      </span>
      <span
        className={`line-clamp-2 text-xs leading-tight ${
          selected ? 'font-medium text-neutral-900' : 'text-neutral-600'
        }`}
      >
        {item.label}
      </span>
    </button>
  );
}

function colorHexFor(label: string): string | null {
  const n = normalize(label);
  if (COLOR_HEX[n]) return COLOR_HEX[n];
  // Cherche la clé la plus longue d'abord ("bleu marine" avant "bleu")
  // pour qu'un libellé "Bleu marine" ne tombe pas sur le bleu générique.
  const keys = Object.keys(COLOR_HEX).sort((a, b) => b.length - a.length);
  for (const key of keys) {
    if (n.includes(key)) return COLOR_HEX[key];
  }
  return null;
}

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
      {axes.map((axis) => {
        const colorAxis = isColorAxis(axis.label);
        const selectedLabel = colorAxis
          ? axis.items.find((it) => it.id === variantId)?.label
          : undefined;
        return (
          <div key={axis.id}>
            <p className="mb-1.5 text-sm font-medium text-neutral-700">
              {axis.label}
              {colorAxis && selectedLabel && (
                <span className="ml-2 font-normal text-neutral-500">
                  — {selectedLabel}
                </span>
              )}
              {hasVariants && variantId == null && (
                <span className="ml-1 text-red-500">*</span>
              )}
            </p>
            {colorAxis ? (
              <div className="flex flex-wrap gap-3">
                {axis.items.map((it) => (
                  <ColorSwatch
                    key={it.id}
                    item={it}
                    selected={variantId === it.id}
                    onSelect={() => setVariantId(it.id)}
                  />
                ))}
              </div>
            ) : (
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
