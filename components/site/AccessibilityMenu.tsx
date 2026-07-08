'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import {
  Accessibility,
  Check,
  Contrast,
  RotateCcw,
  Type,
  X
} from 'lucide-react';

type FontScale = 'normal' | 'large' | 'x-large' | 'xx-large';
type Contrast = 'normal' | 'high';

interface Preferences {
  fontScale: FontScale;
  contrast: Contrast;
}

const STORAGE_KEY = 'mantly-accessibility';

const FONT_LABELS: Record<FontScale, string> = {
  normal: 'Normal',
  large: 'Grand',
  'x-large': 'Très grand',
  'xx-large': 'Énorme'
};

const FONT_ORDER: FontScale[] = [
  'normal',
  'large',
  'x-large',
  'xx-large'
];

/**
 * Bouton flottant d'accessibilité (confort de lecture).
 * - Ajuste la taille du texte (4 paliers via classes sur <html>).
 * - Bascule un mode contraste renforcé (noir/ blanc, liens soulignés).
 * - Mémorise les préférences (localStorage) pour les visites suivantes.
 * - Panneau accessible : role="dialog", fermeture à Échap, focus management.
 */
export function AccessibilityMenu() {
  const [open, setOpen] = useState(false);
  const [prefs, setPrefs] = useState<Preferences>({
    fontScale: 'normal',
    contrast: 'normal'
  });
  const panelRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);

  // Lecture des préférences sauvegardées au montage.
  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return;
      const parsed = JSON.parse(raw) as Partial<Preferences>;
      setPrefs({
        fontScale: (parsed.fontScale as FontScale) ?? 'normal',
        contrast: (parsed.contrast as Contrast) ?? 'normal'
      });
    } catch {
      /* ignore */
    }
  }, []);

  // Application des préférences sur <html> et persistance.
  useEffect(() => {
    const html = document.documentElement;
    FONT_ORDER.forEach((s) => {
      html.classList.remove(`font-scale-${s}`);
    });
    if (prefs.fontScale !== 'normal') {
      html.classList.add(`font-scale-${prefs.fontScale}`);
    }
    html.classList.toggle('high-contrast', prefs.contrast === 'high');
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(prefs));
    } catch {
      /* ignore */
    }
  }, [prefs]);

  // Fermeture à Échap + click dehors.
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setOpen(false);
        triggerRef.current?.focus();
      }
    };
    const onClick = (e: MouseEvent) => {
      if (
        panelRef.current &&
        !panelRef.current.contains(e.target as Node) &&
        !triggerRef.current?.contains(e.target as Node)
      ) {
        setOpen(false);
      }
    };
    document.addEventListener('keydown', onKey);
    document.addEventListener('mousedown', onClick);
    return () => {
      document.removeEventListener('keydown', onKey);
      document.removeEventListener('mousedown', onClick);
    };
  }, [open]);

  const increaseFont = useCallback(() => {
    setPrefs((p) => {
      const i = FONT_ORDER.indexOf(p.fontScale);
      const next = FONT_ORDER[Math.min(i + 1, FONT_ORDER.length - 1)];
      return { ...p, fontScale: next };
    });
  }, []);

  const decreaseFont = useCallback(() => {
    setPrefs((p) => {
      const i = FONT_ORDER.indexOf(p.fontScale);
      const next = FONT_ORDER[Math.max(i - 1, 0)];
      return { ...p, fontScale: next };
    });
  }, []);

  const toggleContrast = useCallback(() => {
    setPrefs((p) => ({
      ...p,
      contrast: p.contrast === 'high' ? 'normal' : 'high'
    }));
  }, []);

  const reset = useCallback(() => {
    setPrefs({ fontScale: 'normal', contrast: 'normal' });
  }, []);

  const fontIndex = FONT_ORDER.indexOf(prefs.fontScale);
  const canDecrease = fontIndex > 0;
  const canIncrease = fontIndex < FONT_ORDER.length - 1;

  return (
    <div className="fixed right-4 bottom-4 z-40 sm:right-6 sm:bottom-6">
      {open && (
        <div
          ref={panelRef}
          role="dialog"
          aria-modal="false"
          aria-labelledby="a11y-menu-title"
          className="mb-3 w-72 rounded-2xl border border-neutral-200 bg-white p-4 shadow-[0_18px_50px_-12px_rgba(0,0,0,0.25)]"
        >
          <div className="flex items-center justify-between">
            <h2
              id="a11y-menu-title"
              className="flex items-center gap-2 text-sm font-semibold"
            >
              <Accessibility className="h-4 w-4 text-[var(--brand-dark)]" />
              Confort de lecture
            </h2>
            <button
              type="button"
              onClick={() => setOpen(false)}
              aria-label="Fermer le menu d'accessibilité"
              className="rounded-full p-1 text-neutral-500 hover:bg-neutral-100 hover:text-neutral-900"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          <div className="mt-4 space-y-4">
            <fieldset>
              <legend className="flex items-center gap-1.5 text-xs font-medium text-neutral-700">
                <Type className="h-3.5 w-3.5" />
                Taille du texte
              </legend>
              <div className="mt-2 flex items-center justify-between gap-2">
                <button
                  type="button"
                  onClick={decreaseFont}
                  disabled={!canDecrease}
                  aria-label="Diminuer la taille du texte"
                  className="btn-outline !px-3 !py-1.5 !text-sm disabled:opacity-40"
                >
                  A−
                </button>
                <span
                  aria-live="polite"
                  className="flex-1 text-center text-sm font-medium"
                >
                  {FONT_LABELS[prefs.fontScale]}
                </span>
                <button
                  type="button"
                  onClick={increaseFont}
                  disabled={!canIncrease}
                  aria-label="Augmenter la taille du texte"
                  className="btn-outline !px-3 !py-1.5 !text-sm disabled:opacity-40"
                >
                  A+
                </button>
              </div>
            </fieldset>

            <div className="flex items-center justify-between gap-3 rounded-xl border border-neutral-200 bg-neutral-50 px-3 py-2">
              <span className="flex items-center gap-1.5 text-xs font-medium text-neutral-700">
                <Contrast className="h-3.5 w-3.5" />
                Contraste renforcé
              </span>
              <button
                type="button"
                role="switch"
                aria-checked={prefs.contrast === 'high'}
                onClick={toggleContrast}
                aria-label="Activer le contraste renforcé"
                className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer items-center rounded-full transition ${
                  prefs.contrast === 'high'
                    ? 'bg-[var(--brand-dark)]'
                    : 'bg-neutral-300'
                }`}
              >
                <span
                  className={`inline-block h-5 w-5 transform rounded-full bg-white shadow transition ${
                    prefs.contrast === 'high' ? 'translate-x-5' : 'translate-x-0.5'
                  }`}
                />
              </button>
            </div>

            <button
              type="button"
              onClick={reset}
              className="flex w-full items-center justify-center gap-2 rounded-full border border-neutral-200 px-3 py-2 text-xs font-medium text-neutral-600 transition hover:border-neutral-300 hover:bg-neutral-50 hover:text-neutral-900"
            >
              {prefs.fontScale === 'normal' && prefs.contrast === 'normal' ? (
                <Check className="h-3.5 w-3.5 text-[var(--brand-dark)]" />
              ) : (
                <RotateCcw className="h-3.5 w-3.5" />
              )}
              Réinitialiser les réglages
            </button>
          </div>
        </div>
      )}

      <button
        ref={triggerRef}
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        aria-controls="a11y-menu-title"
        aria-label="Ouvrir le menu d'accessibilité"
        className="ml-auto flex h-12 w-12 items-center justify-center rounded-full bg-[var(--brand-dark)] text-white shadow-[0_10px_30px_-6px_rgba(0,0,0,0.35)] transition hover:bg-[var(--brand)] focus-visible:ring-4 focus-visible:ring-white"
      >
        <Accessibility className="h-6 w-6" />
      </button>
    </div>
  );
}