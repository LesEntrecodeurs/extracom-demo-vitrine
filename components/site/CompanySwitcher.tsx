'use client';

import { useCart, useCompany, useShopContext } from '@extracom/site-kit/react';
import { Spinner } from '@/components/site/Loader';

/**
 * Sélecteur d'entreprise (compte client). N'apparaît que si l'utilisateur est
 * rattaché à plusieurs sociétés sur cette boutique. Au changement, le panier
 * de la société en cours est vidé (ligne par ligne — le kit n'expose pas de
 * vidage global) avant la bascule, pour éviter tout mélange avec les prix
 * de la nouvelle société. Le kit recharge ensuite la page.
 */
export function CompanySwitcher() {
  const { data: context } = useShopContext();
  const { companies, activeId, isSwitching, switchTo } = useCompany();
  const { cart, removeItem } = useCart();

  const shopName = context?.shopName;
  const list = shopName
    ? companies.filter((c) => c.shopName === shopName)
    : companies;

  if (list.length <= 1) return null;

  const handleChange = async (newCustomerId: string) => {
    if (newCustomerId === activeId) return;
    const lineIds = cart?.lines.map((line) => line.id) ?? [];
    for (const lineId of lineIds) {
      try {
        await removeItem(lineId);
      } catch {
        // On continue malgré l'erreur : ne pas bloquer le changement de société.
      }
    }
    await switchTo(newCustomerId);
  };

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
        onChange={(e) => {
          void handleChange(e.target.value);
        }}
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
