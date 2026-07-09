'use client';

import { useCompany, useShopContext } from '@extracom/site-kit/react';
import { Spinner } from '@/components/site/Loader';

/**
 * Indicateur compact de la société active, affiché en haut de chaque page
 * pour que l'utilisateur sache d'un coup d'œil pour quelle société il
 * navigue (et donc pour quelle société prix + panier sont calculés).
 *
 * - 1 seule société → libellé simple, non interactif.
 * - Plusieurs sociétés → menu déroulant pour basculer (la session est
 *   re-scelleée par le kit → prix, panier et commandes suivent).
 */
export function CompanyIndicator() {
  const { data: context } = useShopContext();
  const { companies, activeId, isSwitching, switchTo } = useCompany();

  const shopName = context?.shopName;
  const list = shopName
    ? companies.filter((c) => c.shopName === shopName)
    : companies;

  if (list.length === 0) return null;

  const activeCompany = list.find((c) => c.customerId === activeId);
  const displayName =
    activeCompany?.companyName?.trim() || activeCompany?.customerId || '—';

  if (list.length === 1) {
    return (
      <div
        className="hidden items-center gap-1.5 rounded-full border border-neutral-200 bg-neutral-50 px-3 py-1 text-sm md:flex"
        title={`Société active : ${displayName}`}
        aria-label={`Société active : ${displayName}`}
      >
        <BuildingIcon className="h-3.5 w-3.5 text-[var(--brand-dark)]" />
        <span className="font-medium text-neutral-800">{displayName}</span>
      </div>
    );
  }

  return (
    <div
      className="hidden items-center gap-1 rounded-full border border-[var(--brand)] bg-[var(--brand-light)] py-1 pl-2 pr-1 text-sm md:flex"
      title="Cliquer pour changer de société"
    >
      <BuildingIcon className="h-3.5 w-3.5 text-[var(--brand-dark)]" />
      <label htmlFor="company-indicator" className="sr-only">
        Société active
      </label>
      <select
        id="company-indicator"
        value={activeId ?? ''}
        disabled={isSwitching}
        onChange={(e) => switchTo(e.target.value)}
        className="cursor-pointer appearance-none bg-transparent pr-1 font-medium text-neutral-900 focus:outline-none disabled:cursor-wait"
      >
        {list.map((c) => (
          <option key={c.customerId} value={c.customerId}>
            {c.companyName?.trim() || c.customerId}
          </option>
        ))}
      </select>
      <span className="flex h-5 w-5 items-center justify-center text-[var(--brand-dark)]">
        {isSwitching ? (
          <Spinner className="h-3.5 w-3.5" />
        ) : (
          <ChevronIcon className="h-3.5 w-3.5" />
        )}
      </span>
    </div>
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
      aria-hidden="true"
    >
      <path
        d="M3 21h18M5 21V7l7-4 7 4v14M9 9h2M9 13h2M9 17h2M13 9h2M13 13h2M13 17h2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
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
      aria-hidden="true"
    >
      <polyline points="6 9 12 15 18 9" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}