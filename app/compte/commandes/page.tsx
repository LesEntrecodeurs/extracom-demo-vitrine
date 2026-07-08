'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { RotateCcw } from 'lucide-react';
import { toast } from 'sonner';
import { useDocuments, useCart } from '@extracom/site-kit/react';
import { formatPrice, formatDate } from '@extracom/site-kit';
import { ListSkeleton } from '@/components/site/Loader';

// Types de document proposés au client (code Sage). Fixe : Devis / Commande /
// Facture — les seuls pertinents côté client.
const TYPE_TABS: { code: number; label: string }[] = [
  { code: 0, label: 'Devis' },
  { code: 1, label: 'Commandes' },
  { code: 6, label: 'Factures' }
];

export default function CommandesPage() {
  // `undefined` = tous les types (filtre serveur désactivé).
  const [typeCode, setTypeCode] = useState<number | undefined>(undefined);
  // Filtres appliqués (texte) — appliqués au submit du formulaire.
  const [applied, setApplied] = useState<{ search?: string; city?: string }>(
    {}
  );
  const [searchInput, setSearchInput] = useState('');
  const [cityInput, setCityInput] = useState('');
  const { data, isLoading, error } = useDocuments({
    type: typeCode,
    search: applied.search,
    deliveryCity: applied.city
  });
  const { reorder } = useCart();
  const router = useRouter();
  // ID du document en cours de « recommandation » (anti-double-clic par ligne).
  const [reorderingId, setReorderingId] = useState<string | null>(null);

  const docs = data?.data ?? [];

  const handleReorder = async (docId: string, orderRef: string) => {
    if (reorderingId) return;
    setReorderingId(docId);
    try {
      await reorder(orderRef);
      router.push('/panier');
    } catch {
      toast.error('La recommande a échoué. Réessayez.');
      setReorderingId(null);
    }
  };

  const submitFilters = (e: React.FormEvent) => {
    e.preventDefault();
    setApplied({
      search: searchInput.trim() || undefined,
      city: cityInput.trim() || undefined
    });
  };
  const resetFilters = () => {
    setSearchInput('');
    setCityInput('');
    setApplied({});
  };
  const hasTextFilter = !!(applied.search || applied.city);

  return (
    <div>
      <h1 className="mb-6 text-xl font-semibold">Mes documents</h1>

      <div className="mb-4 flex flex-wrap gap-2">
        <Tab
          label="Tous"
          active={typeCode === undefined}
          onClick={() => setTypeCode(undefined)}
        />
        {TYPE_TABS.map((t) => (
          <Tab
            key={t.code}
            label={t.label}
            active={typeCode === t.code}
            onClick={() => setTypeCode(t.code)}
          />
        ))}
      </div>

      <form
        onSubmit={submitFilters}
        className="mb-4 flex flex-wrap items-center gap-2"
      >
        <input
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
          placeholder="Rechercher (référence…)"
          aria-label="Rechercher dans l'historique (référence)"
          className="field w-auto min-w-[180px] flex-1"
        />
        <input
          value={cityInput}
          onChange={(e) => setCityInput(e.target.value)}
          placeholder="Ville de livraison"
          aria-label="Filtrer par ville de livraison"
          className="field w-auto min-w-[150px]"
        />
        <button type="submit" className="btn-outline !py-2">
          Filtrer
        </button>
        {hasTextFilter && (
          <button
            type="button"
            onClick={resetFilters}
            className="text-sm text-neutral-500 hover:underline"
          >
            Effacer
          </button>
        )}
      </form>

      {isLoading ? (
        <ListSkeleton rows={5} />
      ) : error ? (
        <p role="alert" className="text-sm text-red-600">
          Impossible de charger l'historique. Réessayez plus tard.
        </p>
      ) : docs.length === 0 ? (
        typeCode === undefined ? (
          <div className="card p-10 text-center">
            <p className="text-neutral-600">
              Vous n'avez pas encore de document.
            </p>
            <Link href="/catalogue" className="btn-primary mt-4 inline-block">
              Parcourir le catalogue
            </Link>
          </div>
        ) : (
          <p className="text-sm text-neutral-500">Aucun document de ce type.</p>
        )
      ) : (
        <ul className="card divide-y divide-neutral-100">
          {docs.map((d) => (
            <li
              key={d.id}
              className="flex items-center justify-between gap-4 p-4"
            >
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <span className="font-medium">{d.reference}</span>
                  <span className="rounded-full bg-neutral-100 px-2 py-0.5 text-xs font-medium text-neutral-600">
                    {d.type}
                  </span>
                  {d.status && (
                    <span className="rounded-full bg-[var(--brand-light)] px-2 py-0.5 text-xs font-medium text-[var(--brand-dark)]">
                      {d.status}
                    </span>
                  )}
                </div>
                <p className="mt-0.5 text-sm text-neutral-500">
                  {formatDate(d.date)}
                </p>
              </div>
              <div className="flex shrink-0 items-center gap-3">
                <span className="font-medium">
                  {formatPrice(d.totalInclVat ?? null)}
                </span>
                {d.orderReference && (
                  <button
                    type="button"
                    onClick={() => handleReorder(d.id, d.orderReference!)}
                    disabled={reorderingId !== null}
                    className="inline-flex items-center gap-1.5 rounded-full border border-neutral-300 px-3 py-1.5 text-xs font-medium text-neutral-800 transition hover:border-neutral-400 hover:bg-neutral-100 active:scale-[0.98] disabled:opacity-50"
                    aria-label={`Recommander ${d.reference} en un clic`}
                  >
                    <RotateCcw className="h-3.5 w-3.5" aria-hidden />
                    {reorderingId === d.id
                      ? 'Recommande…'
                      : 'Recommander'}
                  </button>
                )}
                <Link
                  href={`/compte/commandes/${encodeURIComponent(d.id)}${
                    d.typeCode != null ? `?type=${d.typeCode}` : ''
                  }`}
                  className="text-sm font-medium text-[var(--brand-dark)] hover:underline"
                >
                  Détail →
                </Link>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

function Tab({
  label,
  active,
  onClick
}: {
  label: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-full px-3 py-1.5 text-sm ${
        active
          ? 'bg-[var(--brand)] text-white'
          : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200'
      }`}
    >
      {label}
    </button>
  );
}
