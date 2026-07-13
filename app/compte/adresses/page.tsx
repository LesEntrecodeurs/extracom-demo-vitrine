'use client';

import { useState } from 'react';
import { toast } from 'sonner';
import { useDelivery } from '@extracom/site-kit/react';
import { AddressForm } from '@/components/site/AddressForm';
import { ListSkeleton } from '@/components/site/Loader';

type DeliveryAddress = NonNullable<
  NonNullable<ReturnType<typeof useDelivery>['options']>['addresses']
>[number];

export default function AdressesPage() {
  const { options, isLoading, addAddress, updateAddress } = useDelivery();
  const [showAdd, setShowAdd] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [duplicateFrom, setDuplicateFrom] = useState<DeliveryAddress | null>(
    null
  );
  const addresses = options?.addresses ?? [];

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
                <div className="flex shrink-0 gap-3">
                  <button
                    type="button"
                    onClick={() => {
                      setEditId(null);
                      setShowAdd(false);
                      setDuplicateFrom(a);
                    }}
                    className="text-sm text-[var(--brand-dark)] hover:underline"
                  >
                    Dupliquer
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setShowAdd(false);
                      setDuplicateFrom(null);
                      setEditId(a.id);
                    }}
                    className="text-sm text-[var(--brand-dark)] hover:underline"
                  >
                    Modifier
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
            <AddressForm
              submitLabel="Ajouter"
              onCancel={() => setShowAdd(false)}
              onSubmit={async (a) => {
                await toast.promise(addAddress(a), {
                  loading: 'Ajout…',
                  success: 'Adresse ajoutée',
                  error: "Impossible d'ajouter l'adresse"
                });
                setShowAdd(false);
              }}
            />
          </div>
        ) : duplicateFrom ? (
          <div className="card p-4">
            <p className="mb-3 text-sm text-neutral-500">
              Dupliquer « {duplicateFrom.label || duplicateFrom.city} » — donnez
              un nouveau nom à cette adresse.
            </p>
            <AddressForm
              submitLabel="Créer la copie"
              onCancel={() => setDuplicateFrom(null)}
              initial={{
                label: '',
                line1: duplicateFrom.line1,
                line2: duplicateFrom.line2,
                postalCode: duplicateFrom.postalCode,
                city: duplicateFrom.city,
                country: duplicateFrom.country,
                contactName: duplicateFrom.contactName,
                phone: duplicateFrom.phone
              }}
              onSubmit={async (a) => {
                await toast.promise(addAddress(a), {
                  loading: 'Duplication…',
                  success: 'Adresse dupliquée',
                  error: "Impossible de dupliquer l'adresse"
                });
                setDuplicateFrom(null);
              }}
            />
          </div>
        ) : (
          <button
            type="button"
            onClick={() => {
              setEditId(null);
              setShowAdd(true);
            }}
            className="btn-outline"
          >
            + Ajouter une adresse
          </button>
        )}
      </div>
    </div>
  );
}
