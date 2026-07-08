'use client';

import { useCompany, useShopContext } from '@extracom/site-kit/react';
import { Spinner } from '@/components/site/Loader';

/**
 * Sélecteur d'entreprise (compte client). N'apparaît que si l'utilisateur est
 * rattaché à plusieurs sociétés sur cette boutique. Changer de société recharge
 * la page → prix, panier et commandes suivent la société choisie.
 *
 * Deux variantes :
 *  - "aside" (défaut) : carte détaillée, à utiliser dans l'espace compte.
 *  - "compact"      : sélecteur discret à intégrer dans le bandeau du haut,
 *                     accessible de partout (catalogue, fiche produit, panier…).
 */
export function CompanySwitcher({ variant = 'aside' }: { variant?: 'aside' | 'compact' }) {
  const { data: context } = useShopContext();
  const { companies, activeId, isSwitching, switchTo } = useCompany();

  const shopName = context?.shopName;
  const list = shopName
    ? companies.filter((c) => c.shopName === shopName)
    : companies;

  if (list.length <= 1) return null;

  if (variant === 'compact') {
    const active = list.find((c) => c.customerId === activeId);
    return (
      <div className="hidden items-center gap-1.5 text-sm md:flex">
        <label
          htmlFor="company-switcher-compact"
          className="sr-only"
        >
          Société
        </label>
        <select
          id="company-switcher-compact"
          aria-label="Société active"
          className="field max-w-[12rem] truncate py-1.5 text-sm"
          value={activeId ?? ''}
          disabled={isSwitching}
          title={active?.companyName ?? undefined}
          onChange={(e) => switchTo(e.target.value)}
        >
          {list.map((c) => (
            <option
              key={c.customerId}
              value={c.customerId}
              title={c.companyName ?? c.customerId}
            >
              {c.companyName?.trim() || c.customerId}
            </option>
          ))}
        </select>
        {isSwitching && (
          <Spinner className="h-3.5 w-3.5 text-neutral-400" />
        )}
      </div>
    );
  }

  return (
    <div className="card p-3">
      <label htmlFor="company-switcher" className="text-xs font-medium text-neutral-500">
        Société
      </label>
      <select
        id="company-switcher"
        className="field mt-1 w-full truncate"
        value={activeId ?? ''}
        disabled={isSwitching}
        title={
          list.find((c) => c.customerId === activeId)?.companyName ??
          undefined
        }
        onChange={(e) => switchTo(e.target.value)}
      >
        {list.map((c) => (
          <option
            key={c.customerId}
            value={c.customerId}
            title={c.companyName ?? c.customerId}
          >
            {c.companyName?.trim() || c.customerId}
          </option>
        ))}
      </select>
      {isSwitching && (
        <p className="mt-1 flex items-center gap-1.5 text-xs text-neutral-400">
          <Spinner className="h-3 w-3" />
          Changement en cours…
        </p>
      )}
    </div>
  );
}
