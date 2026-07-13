'use client';

import { formatPrice } from '@extracom/site-kit';
import { getDocumentsAction } from '@extracom/site-kit/server';
import { useEffect, useState } from 'react';

const PAGE_SIZE = 50;

type Summary = {
  orderCount: number;
  totalSpent: number | null;
};

export function OrderSummary({ companyId }: { companyId: string }) {
  const [summary, setSummary] = useState<Summary | null>(null);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    let cancelled = false;

    async function loadSummary() {
      setSummary(null);
      setHasError(false);

      try {
        const orders = new Map<
          string,
          { totalInclVat?: number | null }
        >();
        let page = 1;
        let expectedTotal: number | null = null;

        while (expectedTotal === null || orders.size < expectedTotal) {
          const response = await getDocumentsAction({
            type: 1,
            page,
            limit: PAGE_SIZE
          });

          for (const order of response.data) {
            orders.set(order.id, order);
          }

          expectedTotal = response.pagination?.total ?? orders.size;

          if (
            response.data.length === 0 ||
            response.pagination === undefined
          ) {
            break;
          }

          page += 1;
        }

        if (expectedTotal !== null && orders.size < expectedTotal) {
          throw new Error('Historique incomplet');
        }

        const values = Array.from(orders.values());
        const hasMissingAmount = values.some(
          (order) => order.totalInclVat == null
        );
        const totalSpent = hasMissingAmount
          ? null
          : values.reduce(
              (total, order) => total + (order.totalInclVat ?? 0),
              0
            );

        if (!cancelled) {
          setSummary({
            orderCount: expectedTotal ?? orders.size,
            totalSpent
          });
        }
      } catch {
        if (!cancelled) setHasError(true);
      }
    }

    void loadSummary();

    return () => {
      cancelled = true;
    };
  }, [companyId]);

  if (hasError) {
    return (
      <p role="alert" className="card p-4 text-sm text-neutral-500">
        Le résumé des commandes est momentanément indisponible.
      </p>
    );
  }

  return (
    <div
      className="grid grid-cols-1 gap-3 sm:grid-cols-2"
      aria-busy={summary === null}
      aria-live="polite"
    >
      <div className="card p-4">
        <p className="text-xs font-medium text-neutral-500">
          Commandes passées
        </p>
        <p className="mt-2 text-2xl font-semibold">
          {summary?.orderCount ?? '…'}
        </p>
      </div>
      <div className="card p-4">
        <p className="text-xs font-medium text-neutral-500">
          Montant total dépensé
        </p>
        <p className="mt-2 text-2xl font-semibold">
          {summary
            ? summary.totalSpent === null
              ? 'Indisponible'
              : formatPrice(summary.totalSpent)
            : '…'}
        </p>
        <p className="mt-1 text-xs text-neutral-400">TTC</p>
      </div>
    </div>
  );
}
