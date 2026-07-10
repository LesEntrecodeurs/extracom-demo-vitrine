'use client';

import { useEffect, useRef } from 'react';
import { Search } from 'lucide-react';

/**
 * Raccourci clavier global : Ctrl+K (ou ⌘+K sur Mac) ouvre la barre de
 * recherche de l'en-tête, `/` aussi. Pratique en navigation rapide :
 * l'utilisateur peut chercher un produit depuis n'importe quelle page.
 *
 * - Si l'input est déjà présent (en-tête), on lui donne le focus et on
 *   sélectionne son contenu.
 * - Sinon, on navigue vers /catalogue?q=… (le champ du catalogue prend le
 *   relais).
 */
export function SearchShortcuts() {
  const isMacRef = useRef(false);

  useEffect(() => {
    isMacRef.current = /Mac|iPhone|iPad/.test(navigator.platform);
  }, []);

  useEffect(() => {
    function focusSearch(prefill?: string) {
      // 1) Cible idéale : la recherche de l'en-tête (présente sur toutes
      //    les pages et qui accepte nom + référence).
      const headerInput = document.querySelector<HTMLInputElement>(
        'form[role="search"] input[name="q"]'
      );
      if (headerInput) {
        if (prefill) headerInput.value = prefill;
        headerInput.focus();
        headerInput.select();
        return;
      }
      // 2) Sinon, on navigue vers le catalogue avec le terme.
      if (prefill) {
        const params = new URLSearchParams({ q: prefill });
        window.location.href = `/catalogue?${params.toString()}`;
      } else {
        window.location.href = '/catalogue';
      }
    }

    function onKey(e: KeyboardEvent) {
      // ⌘K / Ctrl+K
      const modK =
        (e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k';
      // `/` (hors champ éditable)
      const slash =
        e.key === '/' &&
        !isEditableTarget(e.target) &&
        !e.metaKey &&
        !e.ctrlKey &&
        !e.altKey;

      if (modK) {
        e.preventDefault();
        focusSearch();
      } else if (slash) {
        e.preventDefault();
        focusSearch();
      }
    }

    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  return null;
}

/** Vrai si l'utilisateur est en train de taper dans un champ éditable. */
function isEditableTarget(target: EventTarget | null): boolean {
  if (!(target instanceof HTMLElement)) return false;
  const tag = target.tagName;
  if (tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT') return true;
  return target.isContentEditable;
}
