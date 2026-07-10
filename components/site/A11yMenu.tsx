'use client';

import { useEffect, useRef, useState } from 'react';

const STORAGE_TEXT_SIZE = 'a11y-text-size';
const STORAGE_CONTRAST = 'a11y-contrast';

type TextSize = 'normal' | 'lg' | 'xl';

const TEXT_SIZE_LABELS: Record<TextSize, string> = {
  normal: 'Normale',
  lg: 'Grande',
  xl: 'Très grande'
};

const SIZE_ORDER: TextSize[] = ['normal', 'lg', 'xl'];

/**
 * Menu d'accessibilité flottant : ajuste la taille du texte et active un mode
 * contraste élevé. Les préférences sont stockées dans localStorage et
 * restituées immédiatement (sans flash) par le script inline dans
 * app/layout.tsx. À n'utiliser qu'avec un client malvoyant qui veut adapter
 * la lecture ; sinon, ne pas l'afficher.
 */
export function A11yMenu() {
  const [open, setOpen] = useState(false);
  const [textSize, setTextSize] = useState<TextSize>('normal');
  const [highContrast, setHighContrast] = useState(false);
  const popoverRef = useRef<HTMLDivElement | null>(null);
  const buttonRef = useRef<HTMLButtonElement | null>(null);

  // Lecture initiale des préférences depuis localStorage (déjà appliquées par
  // le script anti-FOUC du layout ; ici on synchronise juste l'état React).
  useEffect(() => {
    try {
      const t = localStorage.getItem(STORAGE_TEXT_SIZE) as TextSize | null;
      if (t && SIZE_ORDER.includes(t)) setTextSize(t);
      const c = localStorage.getItem(STORAGE_CONTRAST);
      if (c === '1') setHighContrast(true);
    } catch {
      /* localStorage indisponible : on garde les défauts */
    }
  }, []);

  // Fermeture au clic hors du panneau ou sur Échap.
  useEffect(() => {
    if (!open) return;
    const onPointer = (e: MouseEvent) => {
      if (
        popoverRef.current?.contains(e.target as Node) ||
        buttonRef.current?.contains(e.target as Node)
      ) {
        return;
      }
      setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false);
    };
    document.addEventListener('mousedown', onPointer);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('mousedown', onPointer);
      document.removeEventListener('keydown', onKey);
    };
  }, [open]);

  function applyTextSize(size: TextSize) {
    setTextSize(size);
    const root = document.documentElement;
    if (size === 'normal') root.removeAttribute('data-text-size');
    else root.setAttribute('data-text-size', size);
    try {
      localStorage.setItem(STORAGE_TEXT_SIZE, size);
    } catch {
      /* ignore */
    }
  }

  function applyContrast(on: boolean) {
    setHighContrast(on);
    const root = document.documentElement;
    if (on) root.setAttribute('data-contrast', 'high');
    else root.removeAttribute('data-contrast');
    try {
      localStorage.setItem(STORAGE_CONTRAST, on ? '1' : '0');
    } catch {
      /* ignore */
    }
  }

  function reset() {
    applyTextSize('normal');
    applyContrast(false);
  }

  return (
    <div className="fixed right-4 bottom-4 z-40 sm:right-6 sm:bottom-6">
      {open && (
        <div
          ref={popoverRef}
          role="dialog"
          aria-label="Préférences d'accessibilité"
          className="absolute right-0 bottom-14 w-72 origin-bottom-right rounded-2xl border border-neutral-200 bg-white p-4 shadow-xl"
        >
          <div className="flex items-center justify-between">
            <h2 className="text-base font-semibold text-neutral-900">
              Accessibilité
            </h2>
            <button
              type="button"
              onClick={() => setOpen(false)}
              aria-label="Fermer le menu accessibilité"
              className="rounded-full p-1 text-neutral-500 hover:bg-neutral-100 hover:text-neutral-900"
            >
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                className="h-5 w-5"
                aria-hidden="true"
              >
                <path
                  d="M6 6l12 12M18 6L6 18"
                  strokeLinecap="round"
                />
              </svg>
            </button>
          </div>

          <fieldset className="mt-4">
            <legend className="text-sm font-medium text-neutral-800">
              Taille du texte
            </legend>
            <div className="mt-2 flex gap-1.5">
              {SIZE_ORDER.map((size) => {
                const active = textSize === size;
                return (
                  <button
                    key={size}
                    type="button"
                    onClick={() => applyTextSize(size)}
                    aria-pressed={active}
                    className={
                      'flex-1 rounded-full border px-3 py-1.5 text-sm transition ' +
                      (active
                        ? 'border-[var(--brand-dark)] bg-[var(--brand-dark)] text-white'
                        : 'border-neutral-300 bg-white text-neutral-700 hover:border-neutral-400')
                    }
                  >
                    {TEXT_SIZE_LABELS[size]}
                  </button>
                );
              })}
            </div>
          </fieldset>

          <fieldset className="mt-4">
            <legend className="text-sm font-medium text-neutral-800">
              Contraste élevé
            </legend>
            <div className="mt-2 flex gap-1.5">
              <button
                type="button"
                onClick={() => applyContrast(false)}
                aria-pressed={!highContrast}
                className={
                  'flex-1 rounded-full border px-3 py-1.5 text-sm transition ' +
                  (!highContrast
                    ? 'border-[var(--brand-dark)] bg-[var(--brand-dark)] text-white'
                    : 'border-neutral-300 bg-white text-neutral-700 hover:border-neutral-400')
                }
              >
                Désactivé
              </button>
              <button
                type="button"
                onClick={() => applyContrast(true)}
                aria-pressed={highContrast}
                className={
                  'flex-1 rounded-full border px-3 py-1.5 text-sm transition ' +
                  (highContrast
                    ? 'border-[var(--brand-dark)] bg-[var(--brand-dark)] text-white'
                    : 'border-neutral-300 bg-white text-neutral-700 hover:border-neutral-400')
                }
              >
                Activé
              </button>
            </div>
          </fieldset>

          <button
            type="button"
            onClick={reset}
            className="mt-4 w-full rounded-full border border-neutral-300 px-3 py-1.5 text-sm text-neutral-700 hover:bg-neutral-100"
          >
            Réinitialiser
          </button>
        </div>
      )}

      <button
        ref={buttonRef}
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-label="Ouvrir le menu accessibilité"
        className="flex h-12 w-12 items-center justify-center rounded-full bg-[var(--brand-dark)] text-white shadow-lg transition hover:bg-[var(--brand-text)]"
      >
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          className="h-6 w-6"
          aria-hidden="true"
        >
          <circle cx="12" cy="4.5" r="1.6" fill="currentColor" />
          <path
            d="M5 8h14M9 8v12M15 8v12M9 14h6"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>
    </div>
  );
}
