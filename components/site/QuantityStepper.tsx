'use client';

import { Minus, Plus, Loader2 } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';

export function QuantityStepper({
  value,
  onChange,
  min = 1,
  disabled = false,
  loading = false,
  ariaLabel
}: {
  value: number;
  onChange: (next: number) => void;
  min?: number;
  disabled?: boolean;
  loading?: boolean;
  ariaLabel?: string;
}) {
  const [draft, setDraft] = useState(String(value));
  const lastCommitted = useRef(value);

  useEffect(() => {
    if (value !== lastCommitted.current) {
      lastCommitted.current = value;
      setDraft(String(value));
    }
  }, [value]);

  const commit = (raw: string) => {
    const parsed = Number.parseInt(raw, 10);
    const safe = Number.isFinite(parsed) && parsed >= min ? parsed : min;
    if (safe !== value) {
      lastCommitted.current = safe;
      onChange(safe);
    } else {
      setDraft(String(value));
    }
  };

  const dec = () => {
    if (disabled || loading || value <= min) return;
    onChange(value - 1);
  };

  const inc = () => {
    if (disabled || loading) return;
    onChange(value + 1);
  };

  return (
    <div
      role="group"
      aria-label={ariaLabel ?? 'Quantité'}
      className="inline-flex items-center overflow-hidden rounded-md border border-neutral-200 bg-white"
    >
      <button
        type="button"
        onClick={dec}
        disabled={disabled || loading || value <= min}
        aria-label="Diminuer la quantité"
        className="grid h-8 w-8 place-items-center text-neutral-500 transition hover:bg-neutral-50 hover:text-neutral-900 disabled:cursor-not-allowed disabled:opacity-30"
      >
        <Minus className="size-3.5" aria-hidden="true" />
      </button>
      <input
        type="text"
        inputMode="numeric"
        value={draft}
        onChange={(e) => setDraft(e.target.value.replace(/\D/g, ''))}
        onBlur={(e) => commit(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === 'Enter') (e.target as HTMLInputElement).blur();
        }}
        disabled={disabled || loading}
        aria-label={ariaLabel ?? 'Quantité'}
        className="h-8 w-12 border-x border-neutral-200 bg-transparent text-center text-sm font-medium text-neutral-900 outline-none disabled:opacity-50"
      />
      <button
        type="button"
        onClick={inc}
        disabled={disabled || loading}
        aria-label="Augmenter la quantité"
        className="grid h-8 w-8 place-items-center text-neutral-500 transition hover:bg-neutral-50 hover:text-neutral-900 disabled:cursor-not-allowed disabled:opacity-30"
      >
        {loading ? (
          <Loader2 className="size-3.5 animate-spin" aria-hidden="true" />
        ) : (
          <Plus className="size-3.5" aria-hidden="true" />
        )}
      </button>
    </div>
  );
}