'use client';

import { useState } from 'react';
import { useCart, useDelivery } from '@extracom/site-kit/react';
import { AddressForm } from './AddressForm';

/**
 * Sélecteur d'adresse de livraison : choix parmi les adresses existantes du
 * client, ou ajout d'une nouvelle. La sélection est immédiatement reportée sur
 * le panier (`setDelivery`). À afficher au plus tard sur la page panier pour
 * que le client l'ait choisie avant la commande.
 */
export function DeliveryAddressPicker() {
  const { cart, setDelivery } = useCart();
  const { options, addAddress, isLoading } = useDelivery();
  const [showAdd, setShowAdd] = useState(false);

  const addresses = options?.addresses ?? [];
  const selectedId = cart?.deliveryAddressId ?? null;

  return (
    <section className="mt-8">
      <h2 className="mb-2 text-base font-medium">Adresse de livraison</h2>

      {isLoading ? (
        <p className="text-sm text-neutral-500">Chargement des adresses…</p>
      ) : addresses.length === 0 ? (
        <p className="text-sm text-neutral-600">
          Aucune adresse enregistrée. Ajoutez-en une pour être livré.
        </p>
      ) : (
        <ul className="space-y-2">
          {addresses.map((a) => (
            <li key={a.id}>
              <label
                className={`flex cursor-pointer items-start gap-3 rounded-lg border p-3 text-sm ${
                  selectedId === a.id
                    ? 'border-[var(--brand)] bg-[var(--brand-light)]'
                    : 'border-neutral-200 hover:border-neutral-300'
                }`}
              >
                <input
                  type="radio"
                  name="delivery-address"
                  className="mt-1"
                  checked={selectedId === a.id}
                  onChange={() => setDelivery({ deliveryAddressId: a.id })}
                />
                <span>
                  {a.label ? (
                    <span className="font-medium">{a.label} — </span>
                  ) : null}
                  {a.line1}
                  {a.line2 ? `, ${a.line2}` : ''}, {a.postalCode} {a.city}{' '}
                  ({a.country})
                </span>
              </label>
            </li>
          ))}
        </ul>
      )}

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
  );
}