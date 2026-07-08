'use client';

import { useCompany, useShopContext } from '@extracom/site-kit/react';
import { Spinner } from '@/components/site/Loader';

type Variant = 'card' | 'inline';

/**
 * Sélecteur d'entreprise (compte client). N'apparaît que si l'utilisateur est
 * rattaché à plusieurs sociétés sur cette boutique. Changer de société recharge
 * la page → prix, panier et commandes suivent la société choisie.
 *
 * Deux variantes :
 * - `card` (défaut) : encadré avec libellé « Société », pour le sidebar
 *   de l'espace compte.
 * - `inline` : sélecteur compact sans cadre, pour la barre de navigation.
 */
export function CompanySwitcher({ variant = 'card' as Variant }: { variant?: Variant }) {
  const { data: context } = useShopContext();
  const { companies, activeId, isSwitching, switchTo } = useCompany();

  const shopName = context?.shopName;
  const list = shopName
    ? companies.filter((c) => c.shopName === shopName)
    : companies;

  if (list.length <= 1) return null;

  const activeCompany = list.find((c) => c.customerId === activeId);
  const activeLabel = activeCompany?.companyName?.trim() || activeCompany?.customerId;

  const fieldClass =
    variant === 'inline'
      ? 'h-9 max-w-[14rem] truncate rounded-md border border-neutral-200 bg-white px-2 text-xs text-neutral-700 hover:border-neutral-300 focus:border-[var(--brand)] focus:outline-none disabled:opacity-60'
      : 'field mt-1 w-full truncate';

  return (
    <div className={variant === 'card' ? 'card p-3' : 'flex items-center gap-1.5'}>
      {variant === 'card' ? (
        <label htmlFor="company-switcher" className="text-xs font-medium text-neutral-500">
          Société
        </label>
      ) : (
        <label htmlFor="company-switcher-nav" className="sr-only">
          Société active
        </label>
      )}
      <div className={variant === 'inline' ? 'relative' : undefined}>
        <select
          id={variant === 'card' ? 'company-switcher' : 'company-switcher-nav'}
          aria-label="Changer de société"
          className={fieldClass}
          value={activeId ?? ''}
          disabled={isSwitching}
          title={activeLabel ?? undefined}
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
        {variant === 'inline' && isSwitching && (
          <span className="pointer-events-none absolute top-1/2 right-2 -translate-y-1/2">
            <Spinner className="h-3 w-3 text-[var(--brand)]" />
          </span>
        )}
      </div>
      {variant === 'card' && isSwitching && (
        <p className="mt-1 flex items-center gap-1.5 text-xs text-neutral-400">
          <Spinner className="h-3 w-3" />
          Changement en cours…
        </p>
      )}
    </div>
  );
}
