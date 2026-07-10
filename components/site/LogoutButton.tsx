'use client';

import { LogOut } from 'lucide-react';
import { useAuth } from '@extracom/site-kit/react';

/**
 * Bouton de déconnexion. Déclenche `logout()` exposé par le kit
 * (`@extracom/site-kit/react`) qui vide la session, puis rafraîchi l'UI.
 * Affiché uniquement aux utilisateurs connectés (la Nav le conditionne).
 */
export function LogoutButton() {
  const { isLoading, logout } = useAuth();

  return (
    <button
      type="button"
      onClick={() => {
        void logout();
      }}
      disabled={isLoading}
      aria-label="Se déconnecter"
      className="flex items-center gap-1.5 text-neutral-700 hover:text-neutral-900 disabled:opacity-50"
    >
      <LogOut className="h-5 w-5" aria-hidden="true" />
      <span className="hidden sm:inline">
        {isLoading ? 'Déconnexion…' : 'Se déconnecter'}
      </span>
    </button>
  );
}
