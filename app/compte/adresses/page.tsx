'use client';

import { useState } from 'react';
import { toast } from 'sonner';
import { useDelivery } from '@extracom/site-kit/react';
import type {
  AddDeliveryAddressInput,
  DeliveryAddress
} from '@extracom/site-kit';
import { AddressForm } from '@/components/site/AddressForm';
import { ListSkeleton } from '@/components/site/Loader';

export default function AdressesPage() {
  const { options, isLoading, addAddress, updateAddress } = useDelivery();
  const [showAdd, setShowAdd] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [prefill, setPrefill] = useState<
    Partial<AddDeliveryAddressInput> | null
  >(null);
  const addresses = options?.addresses ?? [];

  const startAdd = (source?: DeliveryAddress) => {
    setEditId(null);
    setPrefill(
      source
        ? {
            label: '',
            line1: source.line1,
            line2: source.line2,
            postalCode: source.postalCode,
            city: source.city,
            country: source.country,
            contactName: source.contactName,
            phone: source.phone
          }
        : null
    );
    setShowAdd(true);
  };

  return (
    <div className="max-w-lg">
      <h1 className="mb-6 text-xl font-semibold">Mes adresses</h1>

      {isLoading ? (
        <ListSkeleton rows={3} />
      ) : addresses.length === 0 ? (
        <p className="text-sm text-neutral-500">Aucune adresse enregistrée.</p>
      ) : (
        <ul className="space-y-2">
          {addresses.map((a) =>
            editId === a.id ? (
              <li key={a.id} className="card p-4">
                <AddressForm
                  submitLabel="Enregistrer"
                  initial={{
                    label: a.label,
                    line1: a.line1,
                    line2: a.line2,
                    postalCode: a.postalCode,
                    city: a.city,
                    country: a.country,
                    contactName: a.contactName,
                    phone: a.phone
                  }}
                  onCancel={() => setEditId(null)}
                  onSubmit={async (data) => {
                    await toast.promise(updateAddress({ id: a.id, ...data }), {
                      loading: 'Mise à jour…',
                      success: 'Adresse mise à jour',
                      error: "Impossible de modifier l'adresse"
                    });
                    setEditId(null);
                  }}
                />
              </li>
            ) : (
              <li
                key={a.id}
                className="card flex items-start justify-between gap-3 p-3 text-sm"
              >
                <div>
                  <p className="font-medium">{a.label || a.city}</p>
                  <p className="text-neutral-500">
                    {a.line1}
                    {a.line2 ? `, ${a.line2}` : ''}, {a.postalCode} {a.city} (
                    {a.country})
                  </p>
                  {a.contactName && (
                    <p className="text-neutral-400">{a.contactName}</p>
                  )}
                </div>
                <div className="flex shrink-0 flex-col items-end gap-1">
                  <button
                    type="button"
                    onClick={() => {
                      setShowAdd(false);
                      setPrefill(null);
                      setEditId(a.id);
                    }}
                    className="text-sm text-[var(--brand-dark)] hover:underline"
                  >
                    Modifier
                  </button>
                  <button
                    type="button"
                    onClick={() => startAdd(a)}
                    className="text-sm text-neutral-500 hover:underline"
                  >
                    Dupliquer
                  </button>
                </div>
              </li>
            )
          )}
        </ul>
      )}

      <div className="mt-4">
        {showAdd ? (
          <div className="card p-4">
            {prefill && (
              <p className="mb-2 text-xs text-neutral-500">
                Dupliquer «{' '}
                {prefill.line1}
                {prefill.line2 ? `, ${prefill.line2}` : ''},{' '}
                {prefill.postalCode} {prefill.city} » — donnez un nouveau
                libellé (ex. Bureau).
              </p>
            )}
            <AddressForm
              submitLabel="Ajouter"
              initial={prefill ?? undefined}
              onCancel={() => {
                setShowAdd(false);
                setPrefill(null);
              }}
              onSubmit={async (a) => {
                await toast.promise(addAddress(a), {
                  loading: 'Ajout…',
                  success: 'Adresse ajoutée',
                  error: "Impossible d'ajouter l'adresse"
                });
                setShowAdd(false);
                setPrefill(null);
              }}
            />
          </div>
        ) : (
          <button
            type="button"
            onClick={() => startAdd()}
            className="btn-outline"
          >
            + Ajouter une adresse
          </button>
        )}
      </div>
    </div>
  );
}
