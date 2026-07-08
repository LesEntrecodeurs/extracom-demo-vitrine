'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { ShoppingCart, Check, Loader2, FileText } from 'lucide-react';
import { useAddToCart, useCheckout } from '@extracom/site-kit/react';
import { formatPrice, type Gamme } from '@extracom/site-kit';
import { Button } from '@/components/ui/button';

/**
 * Bloc d'achat de la fiche produit : sélection de déclinaison (gamme) +
 * ajout au panier — et, pour les clients autorisés, **demande de devis**
 * direct (transforme le panier en document Sage de type « devis »).
 * Si l'article a des déclinaisons, les deux actions sont **bloquées** tant
 * qu'aucune n'est choisie ; le `variantId` envoyé est l'id de la
 * déclinaison sélectionnée.
 */
export function BuyBox({
  reference,
  gammes,
  priceHidden,
  canQuote
}: {
  reference: string;
  gammes?: Gamme[];
  priceHidden?: boolean;
  canQuote?: boolean;
}) {
  const axes = (gammes ?? []).filter((g) => g.items.length > 0);
  const hasVariants = axes.length > 0;
  const { addItem, isLoading: adding } = useAddToCart();
  const { validateWithoutPayment, isLoading: quoting } = useCheckout();
  const router = useRouter();
  const [variantId, setVariantId] = useState<number | null>(null);
  const [added, setAdded] = useState(false);
  const variantMissing = hasVariants && variantId == null;
  const canAdd = !priceHidden && !variantMissing;
  // Le bouton « devis » suit la même logique que « ajouter au panier » côté
  // variant. Il ne s'affiche pas si le client n'a pas la capability
  // `document.create.quote` (dérivée du rôle côté serveur).
  const canRequestQuote = !!canQuote && !priceHidden && !variantMissing;

  const handleAdd = async () => {
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
  };

  const handleRequestQuote = async () => {
    try {
      // Prépare un panier à une ligne, puis le convertit en document « devis »
      // (type Sage 0). On laisse l'API gérer le reste (permissions, adresse de
      // livraison si requise côté shop).
      await addItem({
        reference,
        quantity: 1,
        variantId: variantId ?? undefined
      });
      const res = await validateWithoutPayment({ documentType: '0' });
      const ref = res?.reference;
      toast.success('Demande de devis envoyée', {
        description: ref
          ? `Référence provisoire : ${ref}.`
          : 'Votre demande a été enregistrée.',
        action: ref
          ? {
              label: 'Voir mes devis',
              onClick: () => router.push('/compte/commandes')
            }
          : undefined
      });
    } catch {
      toast.error(
        'Le devis n’a pas pu être créé. Vérifiez vos droits ou réessayez.'
      );
    }
  };

  return (
    <div className="max-w-sm space-y-4">
      {axes.map((axis) => (
        <div key={axis.id}>
          <p className="mb-1.5 text-sm font-medium text-neutral-700">
            {axis.label}
            {variantMissing && (
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

      <div className="space-y-2">
        <Button
          type="button"
          disabled={!canAdd || adding || quoting}
          className="w-full"
          onClick={handleAdd}
        >
          {adding ? (
            <Loader2 className="size-4 animate-spin" />
          ) : added ? (
            <Check className="size-4" />
          ) : (
            <ShoppingCart className="size-4" />
          )}
          {adding
            ? '…'
            : added
              ? 'Ajouté'
              : variantMissing
                ? 'Choisissez une déclinaison'
                : 'Ajouter au panier'}
        </Button>

        {canQuote && (
          <Button
            type="button"
            variant="outline"
            disabled={!canRequestQuote || adding || quoting}
            className="w-full"
            onClick={handleRequestQuote}
          >
            {quoting ? (
              <Loader2 className="size-4 animate-spin" />
            ) : (
              <FileText className="size-4" />
            )}
            {quoting ? '…' : 'Demander un devis'}
          </Button>
        )}
      </div>
    </div>
  );
}
