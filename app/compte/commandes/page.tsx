'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useDocuments } from '@extracom/site-kit/react';
import { formatPrice, formatDate } from '@extracom/site-kit';
import { ListSkeleton } from '@/components/site/Loader';

// Types de document proposés au client (code Sage). Fixe : Devis / Commande /
// Facture — les seuls pertinents côté client.
const TYPE_TABS: { code: number; label: string }[] = [
  { code: 0, label: 'Devis' },
  { code: 1, label: 'Commandes' },
  { code: 6, label: 'Factures' }
];

const PERIOD_TABS: { id: 'all' | 'thisMonth' | 'thisYear'; label: string }[] = [
  { id: 'all', label: 'Tout' },
  { id: 'thisMonth', label: 'Ce mois-ci' },
  { id: 'thisYear', label: 'Cette année' }
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
  // Filtre période — appliqué côté client (le hook fourni par le kit n'expose
  // pas de filtre par date).
  const [period, setPeriod] = useState<'all' | 'thisMonth' | 'thisYear'>('all');
  const { data, isLoading, error } = useDocuments({
    type: typeCode,
    search: applied.search,
    deliveryCity: applied.city
  });

  // Bornes de la période choisie (mois ou année en cours).
  const periodStart = (() => {
    const now = new Date();
    if (period === 'thisMonth') return new Date(now.getFullYear(), now.getMonth(), 1);
    if (period === 'thisYear') return new Date(now.getFullYear(), 0, 1);
    return null;
  })();

  const docs = (data?.data ?? []).filter((d) => {
    if (!periodStart) return true;
    const t = new Date(d.date).getTime();
    return Number.isFinite(t) && t >= periodStart.getTime();
  });

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

      <div
        className="mb-4 flex flex-wrap items-center gap-2"
        role="group"
        aria-label="Filtrer par période"
      >
        <span className="text-sm text-neutral-500">Période :</span>
        {PERIOD_TABS.map((p) => (
          <Tab
            key={p.id}
            label={p.label}
            active={period === p.id}
            onClick={() => setPeriod(p.id)}
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
        typeCode === undefined && period === 'all' ? (
          <div className="card p-10 text-center">
            <p className="text-neutral-600">
              Vous n'avez pas encore de document.
            </p>
            <Link href="/catalogue" className="btn-primary mt-4 inline-block">
              Parcourir le catalogue
            </Link>
          </div>
        ) : (
          <div className="card p-6 text-center">
            <p className="text-sm text-neutral-500">
              Aucun document sur cette période.
            </p>
            {period !== 'all' && (
              <button
                type="button"
                onClick={() => setPeriod('all')}
                className="mt-3 text-sm font-medium text-[var(--brand-dark)] hover:underline"
              >
                Voir toutes les périodes
              </button>
            )}
          </div>
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
              <div className="flex shrink-0 items-center gap-4">
                <span className="font-medium">
                  {formatPrice(d.totalInclVat ?? null)}
                </span>
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
