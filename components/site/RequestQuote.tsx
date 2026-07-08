'use client';

import { useState } from 'react';
import { toast } from 'sonner';
import { FileText, Check, Loader2 } from 'lucide-react';
import {
  useAuth,
  useCompany,
  useShopContext,
  useAddToCart,
  useCheckout
} from '@extracom/site-kit/react';
import { Button } from '@/components/ui/button';

/**
 * Bouton « Demander un devis » visible **uniquement** pour les clients dont
 * le rôle accorde la capacité `canQuote` (résolue côté serveur par le kit à
 * partir des permissions Sage — on ne touche jamais aux permissions brutes).
 *
 * Flux : on ajoute l'article au panier courant puis on valide ce panier en
 * devis (`documentType: '0'`) — c'est le seul chemin devis exposé par le kit.
 * Si le client a déjà des articles dans son panier, le devis portera sur
 * l'ensemble (cohérent avec un usage B2B : on demande un devis pour un panier).
 *
 * - `reference` : référence article (obligatoire).
 * - `variantId` : id de déclinaison choisie (obligatoire si l'article a des
 *   gammes). On le passe à l'ajout panier, le serveur le valide.
 * - `disabled`  : permet de désactiver le bouton depuis l'extérieur (ex.
 *   tant qu'aucune déclinaison n'a été choisie).
 */
export function RequestQuote({
  reference,
  variantId,
  disabled
}: {
  reference: string;
  variantId?: number | null;
  disabled?: boolean;
}) {
  const { user } = useAuth();
  const { activeId } = useCompany();
  const { data: context } = useShopContext();
  const { addItem, isLoading: adding } = useAddToCart();
  const { validateWithoutPayment, isLoading: quoting } = useCheckout();
  const [done, setDone] = useState(false);

  // Mêmes règles que la page commande : on retrouve la membership de
  // l'utilisateur sur la société active et le shop ambiant.
  const activeMembership = user?.memberships.find(
    (m) =>
      m.customerId === activeId &&
      (!context?.shopName || m.shopName === context.shopName)
  );
  const canQuote = activeMembership?.capabilities?.canQuote ?? false;

  // Pas de capability → on ne rend rien (les anonymes n'ont pas de
  // membership, donc rien à afficher pour eux non plus).
  if (!canQuote) return null;

  const busy = adding || quoting;

  return (
    <Button
      type="button"
      variant="outline"
      disabled={disabled || busy}
      className="w-full"
      onClick={async () => {
        try {
          await addItem({
            reference,
            quantity: 1,
            variantId: variantId ?? undefined
          });
          const res = await validateWithoutPayment({ documentType: '0' });
          setDone(true);
          toast.success(
            res?.reference
              ? `Devis envoyé (réf. ${res.reference})`
              : 'Demande de devis envoyée'
          );
          setTimeout(() => setDone(false), 2000);
        } catch {
          toast.error('La demande de devis a échoué. Réessayez.');
        }
      }}
    >
      {busy ? (
        <Loader2 className="size-4 animate-spin" />
      ) : done ? (
        <Check className="size-4" />
      ) : (
        <FileText className="size-4" />
      )}
      {busy ? '…' : done ? 'Devis envoyé' : 'Demander un devis'}
    </Button>
  );
}