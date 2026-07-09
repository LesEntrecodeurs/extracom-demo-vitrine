'use client';

import { useEffect, useState } from 'react';
import { Loader2, Minus, Plus } from 'lucide-react';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

export function QuantityStepper({
  value,
  min = 1,
  onChange,
  busy = false,
  disabled = false,
  ariaLabel,
  className
}: {
  value: number;
  onChange: (next: number) => Promise<unknown> | unknown;
  min?: number;
  busy?: boolean;
  disabled?: boolean;
  ariaLabel?: string;
  className?: string;
}) {
  const [draft, setDraft] = useState<string>(String(value));

  useEffect(() => {
    setDraft(String(value));
  }, [value]);

  const commit = async (raw: string | number) => {
    const next = typeof raw === 'number' ? raw : Number.parseInt(raw, 10);
    if (!Number.isFinite(next) || next < min) {
      setDraft(String(value));
      return;
    }
    if (next === value) {
      setDraft(String(value));
      return;
    }
    try {
      await onChange(next);
    } catch {
      setDraft(String(value));
      toast.error('Impossible de mettre à jour la quantité');
    }
  };

  return (
    <div
      className={cn(
        'inline-flex items-center rounded-full border border-neutral-300 bg-white',
        (busy || disabled) && 'opacity-60',
        className
      )}
    >
      <button
        type="button"
        onClick={() => commit(Math.max(min, value - 1))}
        disabled={disabled || busy || value <= min}
        aria-label="Diminuer la quantité"
        className="flex size-8 items-center justify-center rounded-l-full text-neutral-500 transition hover:text-neutral-800 disabled:cursor-not-allowed disabled:opacity-40"
      >
        <Minus className="size-4" />
      </button>
      <input
        type="number"
        inputMode="numeric"
        min={min}
        value={draft}
        onChange={(e) => setDraft(e.target.value)}
        onBlur={() => commit(draft)}
        onKeyDown={(e) => {
          if (e.key === 'Enter') {
            e.preventDefault();
            (e.currentTarget as HTMLInputElement).blur();
          }
        }}
        disabled={disabled || busy}
        aria-label={ariaLabel ?? 'Quantité'}
        className="w-12 border-0 bg-transparent text-center text-sm outline-none focus:ring-0 disabled:cursor-not-allowed"
      />
      <button
        type="button"
        onClick={() => commit(value + 1)}
        disabled={disabled || busy}
        aria-label="Augmenter la quantité"
        className="flex size-8 items-center justify-center rounded-r-full text-neutral-500 transition hover:text-neutral-800 disabled:cursor-not-allowed disabled:opacity-40"
      >
        {busy ? (
          <Loader2 className="size-4 animate-spin" />
        ) : (
          <Plus className="size-4" />
        )}
      </button>
    </div>
  );
}