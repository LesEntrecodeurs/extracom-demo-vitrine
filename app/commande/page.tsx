'use client';

import { useState } from 'react';
import Link from 'next/link';
import { toast } from 'sonner';
import {
  useCart,
  useDelivery,
  usePayment,
  useCheckout,
  useAuth,
  useCompany,
  useShopContext
} from '@extracom/site-kit/react';
import { formatPrice } from '@extracom/site-kit';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from '@/components/ui/dialog';
import { AddressForm } from '@/components/site/AddressForm';
import { AuthGate } from '@/components/site/AuthGate';
import { CartSkeleton } from '@/components/site/Loader';

export default function CommandePage() {
  return (
    <AuthGate message="Connectez-vous pour passer commande.">
      <CommandeContent />
    </AuthGate>
  );
}

function CommandeContent() {
  const { cart, isLoading, setDelivery, setComment } = useCart();
  const { options, addAddress } = useDelivery();
  const { start, isLoading: paying, error: payError } = usePayment();
  const {
    createOrder,
    validateWithoutPayment,
    isLoading: ordering,
    error: orderError
  } = useCheckout();
  const { user } = useAuth();
  const { activeId } = useCompany();
  const { data: context } = useShopContext();
  const [showAdd, setShowAdd] = useState(false);
  const [confirmedRef, setConfirmedRef] = useState<string | null>(null);
  const [created, setCreated] = useState(false);
  const [isQuote, setIsQuote] = useState(false);
  const [reference, setReference] = useState('');
  const [comment, setCommentValue] = useState('');
  // Action choisie par le client, affichée dans la modale de confirmation.
  // `null` = modale fermée.
  const [confirmAction, setConfirmAction] = useState<
    'order' | 'pay' | 'submit' | null
  >(null);

  // Enregistre le commentaire (si saisi) avant de finaliser la commande.
  const persistComment = async () => {
    if (comment.trim()) await setComment(comment.trim());
  };

  // Déclenche l'action métier après confirmation explicite dans la modale.
  const performAction = async (
    action: 'order' | 'pay' | 'submit'
  ) => {
    setConfirmAction(null);
    try {
      await persistComment();
      if (action === 'order') {
        const res = await validateWithoutPayment({
          documentType: '1',
          reference: reference.trim() || undefined
        });
        setCreated(true);
        setConfirmedRef(res?.reference ?? '');
      } else if (action === 'pay') {
        const { redirectUrl } = await start({});
        if (redirectUrl) window.location.href = redirectUrl;
      } else {
        const res = await createOrder();
        setCreated(false);
        setConfirmedRef(res?.reference ?? '');
      }
    } catch {
      const messages = {
        order:
          'La commande n’a pas pu être validée. Vérifiez vos droits ou réessayez.',
        pay: 'Le paiement n’a pas pu démarrer. Réessayez.',
        submit: "La commande n'a pas pu être envoyée. Réessayez."
      } as const;
      toast.error(messages[action]);
    }
  };

  // Capacités métier de l'utilisateur sur la société active (dérivées de son
  // rôle côté serveur — l'API revérifie de toute façon).
  const activeMembership = user?.memberships.find(
    (m) =>
      m.customerId === activeId &&
      (!context?.shopName || m.shopName === context.shopName)
  );
  const caps = activeMembership?.capabilities;
  const canQuote = caps?.canQuote ?? false;
  // Commande directe (création du document) = peut commander ET finaliser sans
  // paiement. Sinon on passe par le paiement / la soumission pour validation.
  const canOrderDirect =
    (caps?.canOrder && caps?.canCheckoutWithoutPayment) ?? false;

  // Capacités de la VITRINE (réglages shop, dérivés côté serveur) : pilotent
  // l'affichage. Défaut prudent quand le contexte n'a pas (encore) répondu :
  // livraison affichée, paiement masqué.
  const shopCaps = context?.capabilities;
  const paymentEnabled = shopCaps?.paymentEnabled ?? false;
  const deliveryEnabled = shopCaps?.deliveryEnabled ?? true;

  if (confirmedRef !== null)
    return (
      <div className="mx-auto max-w-lg">
        <div className="card p-10 text-center">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-[var(--brand-light)] text-2xl text-[var(--brand-dark)]">
            ✓
          </div>
          <h1 className="text-xl font-semibold">
            {isQuote
              ? 'Devis créé'
              : created
                ? 'Commande validée'
                : 'Commande envoyée'}
          </h1>
          <p className="mt-2 text-sm text-neutral-600">
            {confirmedRef ? `Référence : ${confirmedRef}. ` : ''}
            {isQuote || created
              ? 'Vous le retrouvez dès maintenant dans votre historique.'
              : 'Elle sera validée par un commercial.'}
          </p>
          <div className="mt-6 flex justify-center gap-3">
            <Link href="/compte/commandes" className="btn-primary">
              Mes commandes
            </Link>
            <Link href="/catalogue" className="btn-outline">
              Continuer mes achats
            </Link>
          </div>
        </div>
      </div>
    );

  if (isLoading) return <CartSkeleton />;
  if (!cart || cart.lines.length === 0)
    return (
      <p>
        Panier vide.{' '}
        <Link href="/catalogue" className="text-[var(--brand-dark)] underline">
          Catalogue
        </Link>
      </p>
    );

  const hasDelivery = !!cart.deliveryAddressId;
  // Si la vitrine n'offre pas de sélection de livraison, on ne bloque pas la
  // finalisation sur le choix d'une adresse.
  const deliveryOk = !deliveryEnabled || hasDelivery;

  return (
    <div className="mx-auto max-w-lg">
      <h1 className="mb-6 text-xl font-semibold">Validation de la commande</h1>

      <div className="card p-5">
        <ul className="divide-y divide-neutral-100 text-sm">
          {cart.lines.map((l) => (
            <li key={l.id} className="flex justify-between py-2">
              <span>
                {l.label ?? l.reference}
                {l.variantLabel ? ` — ${l.variantLabel}` : ''} × {l.quantity}
              </span>
              <span>
                {formatPrice(l.lineTotalInclVat ?? l.unitPrice * l.quantity)}
              </span>
            </li>
          ))}
        </ul>
        <div className="mt-3 flex justify-between border-t border-neutral-100 pt-3 text-lg font-semibold">
          <span>Total TTC</span>
          <span>{formatPrice(cart.totals?.totalInclVat ?? null)}</span>
        </div>
      </div>

      {deliveryEnabled && (
      <section className="mt-6">
        <h2 className="mb-2 font-medium">Adresse de livraison</h2>
        <ul className="space-y-2">
          {(options?.addresses ?? []).map((a) => (
            <li key={a.id}>
              <label
                className={`flex cursor-pointer items-center gap-3 rounded-lg border p-3 text-sm ${
                  cart.deliveryAddressId === a.id
                    ? 'border-[var(--brand)] bg-[var(--brand-light)]'
                    : 'border-neutral-200'
                }`}
              >
                <input
                  type="radio"
                  name="delivery"
                  checked={cart.deliveryAddressId === a.id}
                  onChange={() => setDelivery({ deliveryAddressId: a.id })}
                />
                <span>
                  {a.label ? `${a.label} — ` : ''}
                  {a.line1}, {a.postalCode} {a.city}
                </span>
              </label>
            </li>
          ))}
        </ul>

        <div className="mt-3">
          {showAdd ? (
            <div className="card p-4">
              <AddressForm
                submitLabel="Utiliser cette adresse"
                onCancel={() => setShowAdd(false)}
                onSubmit={async (addr) => {
                  const created = await addAddress(addr);
                  await setDelivery({ deliveryAddressId: created.id });
                  setShowAdd(false);
                }}
              />
            </div>
          ) : (
            <button
              type="button"
              onClick={() => setShowAdd(true)}
              className="text-sm text-[var(--brand-dark)] hover:underline"
            >
              + Ajouter une adresse
            </button>
          )}
        </div>
      </section>
      )}

      <section className="mt-6 space-y-3">
        <h2 className="font-medium">Informations complémentaires</h2>
        <div>
          <label htmlFor="commande-reference" className="text-sm text-neutral-600">
            Référence de commande
          </label>
          <input
            id="commande-reference"
            value={reference}
            onChange={(e) => setReference(e.target.value)}
            placeholder="Votre référence (bon de commande…)"
            className="field mt-1"
          />
        </div>
        <div>
          <label htmlFor="commande-comment" className="text-sm text-neutral-600">
            Commentaire
          </label>
          <textarea
            id="commande-comment"
            value={comment}
            onChange={(e) => setCommentValue(e.target.value.slice(0, 69))}
            placeholder="Note pour la préparation (69 caractères max)"
            rows={2}
            className="field mt-1 resize-none"
          />
          <p className="mt-0.5 text-right text-xs text-neutral-400">
            {comment.length}/69
          </p>
        </div>
      </section>

      {payError && (
        <p role="alert" className="mt-4 text-sm text-red-600">
          Le paiement n'a pas pu démarrer. Réessayez.
        </p>
      )}
      {orderError && (
        <p role="alert" className="mt-4 text-sm text-red-600">
          La commande n'a pas pu être envoyée. Réessayez.
        </p>
      )}

      <div className="mt-8 flex flex-col gap-3 sm:flex-row">
        {/* Devis : disponible dès que le rôle l'autorise (indépendant du
            paiement). Crée un document de type « devis » (0). */}
        {canQuote && (
          <button
            type="button"
            onClick={async () => {
              try {
                await persistComment();
                const res = await validateWithoutPayment({
                  documentType: '0',
                  reference: reference.trim() || undefined
                });
                setIsQuote(true);
                setCreated(true);
                setConfirmedRef(res?.reference ?? '');
              } catch {
                toast.error(
                  'Le devis n’a pas pu être créé. Vérifiez vos droits ou réessayez.'
                );
              }
            }}
            disabled={ordering || !deliveryOk}
            title={deliveryOk ? '' : 'Choisissez une adresse de livraison'}
            className="btn-outline flex-1"
          >
            {ordering ? '…' : 'Demander un devis'}
          </button>
        )}

        {canOrderDirect ? (
          // L'utilisateur peut commander sans payer → on crée le bon de
          // commande Sage directement (il apparaît dans l'historique).
          <button
            type="button"
            onClick={() => setConfirmAction('order')}
            disabled={ordering || !deliveryOk}
            title={deliveryOk ? '' : 'Choisissez une adresse de livraison'}
            className="btn-primary flex-1"
          >
            {ordering ? '…' : 'Valider la commande'}
          </button>
        ) : (
          <>
            {/* Paiement en ligne affiché uniquement si la vitrine l'autorise
                (capability dérivée : Axepta configuré pour le shop). */}
            {paymentEnabled && (
              <button
                type="button"
                onClick={() => setConfirmAction('pay')}
                disabled={paying || !deliveryOk}
                title={deliveryOk ? '' : 'Choisissez une adresse de livraison'}
                className="btn-primary flex-1"
              >
                {paying ? '…' : 'Payer'}
              </button>
            )}
            <button
              type="button"
              onClick={() => setConfirmAction('submit')}
              disabled={ordering || !deliveryOk}
              className="btn-outline"
              title="Soumettre pour validation par un commercial"
            >
              {ordering ? '…' : 'Soumettre pour validation'}
            </button>
          </>
        )}
      </div>

      <Dialog
        open={confirmAction !== null}
        onOpenChange={(open) => {
          if (!open && !ordering && !paying) setConfirmAction(null);
        }}
      >
        <DialogContent showCloseButton={false}>
          <DialogHeader>
            <DialogTitle>
              {confirmAction === 'pay'
                ? 'Confirmer le paiement'
                : 'Confirmer votre commande'}
            </DialogTitle>
            <DialogDescription>
              Vérifiez une dernière fois le récapitulatif avant de valider
              définitivement.
            </DialogDescription>
          </DialogHeader>

          <div className="max-h-64 overflow-y-auto rounded-md border border-neutral-200 bg-neutral-50 p-3 text-sm">
            <ul className="divide-y divide-neutral-200">
              {cart.lines.map((l) => (
                <li
                  key={l.id}
                  className="flex items-center justify-between gap-3 py-1.5"
                >
                  <span className="text-neutral-700">
                    {l.label ?? l.reference}
                    {l.variantLabel ? ` — ${l.variantLabel}` : ''} ×{' '}
                    {l.quantity}
                  </span>
                  <span className="font-medium">
                    {formatPrice(
                      l.lineTotalInclVat ?? l.unitPrice * l.quantity
                    )}
                  </span>
                </li>
              ))}
            </ul>
            <div className="mt-2 flex justify-between border-t border-neutral-200 pt-2 font-semibold">
              <span>Total TTC</span>
              <span>{formatPrice(cart.totals?.totalInclVat ?? null)}</span>
            </div>
            {reference.trim() && (
              <p className="mt-2 text-xs text-neutral-600">
                Référence : {reference.trim()}
              </p>
            )}
            {comment.trim() && (
              <p className="mt-1 text-xs text-neutral-600">
                Commentaire : {comment.trim()}
              </p>
            )}
          </div>

          <DialogFooter>
            <button
              type="button"
              onClick={() => setConfirmAction(null)}
              disabled={ordering || paying}
              className="btn-outline"
            >
              Retour
            </button>
            <button
              type="button"
              onClick={() => confirmAction && performAction(confirmAction)}
              disabled={ordering || paying}
              className="btn-primary"
            >
              {ordering || paying ? '…' : 'Confirmer'}
            </button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
