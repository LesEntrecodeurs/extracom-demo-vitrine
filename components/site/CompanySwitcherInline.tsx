'use client';

import { useCompany, useShopContext } from '@extracom/site-kit/react';
import { Spinner } from '@/components/site/Loader';

/**
 * Sélecteur de société au format compact, pensé pour la barre de navigation.
 * S'auto-masque si l'utilisateur n'a qu'une seule société sur la boutique.
 */
export function CompanySwitcherInline() {
  const { data: context } = useShopContext();
  const { companies, activeId, isSwitching, switchTo } = useCompany();

  const shopName = context?.shopName;
  const list = shopName
    ? companies.filter((c) => c.shopName === shopName)
    : companies;

  if (list.length <= 1) return null;

  const active = list.find((c) => c.customerId === activeId);

  return (
    <label
      className="flex h-9 items-center gap-1.5 rounded-md border border-neutral-200 bg-white px-2 text-sm text-neutral-700 transition-colors hover:border-neutral-300 focus-within:border-[var(--brand)] focus-within:ring-2 focus-within:ring-[var(--brand)]/20"
      title={active?.companyName ?? 'Changer de société'}
    >
      <BuildingIcon className="h-4 w-4 shrink-0 text-neutral-500" />
      <select
        aria-label="Société active"
        className="field h-full min-w-0 appearance-none border-0 bg-transparent p-0 pr-4 text-sm font-medium text-neutral-800 outline-none focus:ring-0"
        value={activeId ?? ''}
        disabled={isSwitching}
        onChange={(e) => switchTo(e.target.value)}
      >
        {list.map((c) => (
          <option key={c.customerId} value={c.customerId}>
            {c.companyName?.trim() || c.customerId}
          </option>
        ))}
      </select>
      {isSwitching ? (
        <Spinner className="h-3.5 w-3.5 text-neutral-400" />
      ) : (
        <ChevronIcon className="-mr-1 h-3.5 w-3.5 text-neutral-400" />
      )}
    </label>
  );
}

function BuildingIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <rect x="4" y="3" width="16" height="18" rx="2" />
      <path d="M8 7h2M8 11h2M8 15h2M14 7h2M14 11h2M14 15h2" />
      <path d="M10 21v-4h4v4" />
    </svg>
  );
}

function ChevronIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="m6 9 6 6 6-6" />
    </svg>
  );
}
