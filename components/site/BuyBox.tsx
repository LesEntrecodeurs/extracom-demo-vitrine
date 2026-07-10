'use client';

import { useState } from 'react';
import { toast } from 'sonner';
import { ShoppingCart, Check, Loader2, FileText } from 'lucide-react';
import {
  useAddToCart,
  useAuth,
  useCompany,
  useShopContext
} from '@extracom/site-kit/react';
import { formatPrice, type Gamme } from '@extracom/site-kit';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

/**
 * Bloc d'achat de la fiche produit : sélection de déclinaison (gamme) +
 * ajout au panier OU demande de devis, selon les droits de l'utilisateur
 * sur la société active (`canOrder` / `canQuote`, dérivés de son rôle
 * côté serveur — l'API revérifie à la finalisation).
 *
 *  - Anonyme               → « Ajouter au panier » (connexion demandée au checkout).
 *  - `canOrder`            → « Ajouter au panier ».
 *  - `canQuote` seul       → « Demander un devis » (le seul bouton d'action).
 *  - `canOrder + canQuote` → les deux boutons (principal = panier, secondaire = devis).
 *  - aucun droit           → message invitant à contacter le commerçant.
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
  const [added, setAdded] = useState<'cart' | 'quote' | null>(null);

  // Capacités de l'utilisateur connecté sur la société active (mêmes règles
  // que la page commande — dérivation de rôle faite côté serveur).
  const { user } = useAuth();
  const { activeId } = useCompany();
  const { data: context } = useShopContext();
  const activeMembership = user?.memberships.find(
    (m) =>
      m.customerId === activeId &&
      (!context?.shopName || m.shopName === context.shopName)
  );
  const caps = activeMembership?.capabilities;
  const canOrder = caps?.canOrder ?? false;
  const canQuote = caps?.canQuote ?? false;

  // Visiteur anonyme : on lui laisse le bouton panier (il se connectera au
  // checkout). Le bouton devis, lui, est réservé aux rôles qui l'autorisent.
  const isAnon = !user;
  const showAddToCart = isAnon || canOrder;
  const showQuote = !isAnon && canQuote;
  const noActionAtAll = !showAddToCart && !showQuote;

  const canAdd = !priceHidden && (!hasVariants || variantId != null);

  const handleAdd = async (kind: 'cart' | 'quote') => {
    try {
      await addItem({
        reference,
        quantity: 1,
        variantId: variantId ?? undefined
      });
      setAdded(kind);
      toast.success(
        kind === 'quote'
          ? 'Article ajouté — confirmez votre devis depuis le panier'
          : 'Ajouté au panier'
      );
      setTimeout(() => setAdded(null), 1500);
    } catch {
      toast.error(
        kind === 'quote'
          ? "Impossible d'ajouter l'article pour le devis"
          : "Impossible d'ajouter au panier"
      );
    }
  };

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

      {noActionAtAll ? (
        // Client connecté sans droit de commander ni de demander un devis :
        // on ne propose pas de tunnel en ligne, on l'invite à nous contacter.
        <div className="rounded-lg border border-neutral-200 bg-neutral-50 p-3 text-sm text-neutral-700">
          Pour commander ou demander un devis, contactez-nous.{' '}
          <Link
            href="/contact"
            className="font-medium text-[var(--brand-dark)] underline"
          >
            Page contact
          </Link>
          .
        </div>
      ) : (
        <div className="flex flex-col gap-2 sm:flex-row">
          {showAddToCart && (
            <Button
              type="button"
              disabled={!canAdd || isLoading}
              className="flex-1"
              onClick={() => handleAdd('cart')}
            >
              {isLoading ? (
                <Loader2 className="size-4 animate-spin" />
              ) : added === 'cart' ? (
                <Check className="size-4" />
              ) : (
                <ShoppingCart className="size-4" />
              )}
              {isLoading
                ? '…'
                : added === 'cart'
                  ? 'Ajouté'
                  : hasVariants && variantId == null
                    ? 'Choisissez une déclinaison'
                    : 'Ajouter au panier'}
            </Button>
          )}
          {showQuote && (
            <Button
              type="button"
              variant="outline"
              disabled={!canAdd || isLoading}
              className="flex-1"
              onClick={() => handleAdd('quote')}
            >
              {isLoading ? (
                <Loader2 className="size-4 animate-spin" />
              ) : added === 'quote' ? (
                <Check className="size-4" />
              ) : (
                <FileText className="size-4" />
              )}
              {isLoading
                ? '…'
                : added === 'quote'
                  ? 'Ajouté'
                  : hasVariants && variantId == null
                    ? 'Choisissez une déclinaison'
                    : 'Demander un devis'}
            </Button>
          )}
        </div>
      )}
    </div>
  );
}
