'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { LogOut } from 'lucide-react';
import { toast } from 'sonner';
import { useAuth } from '@extracom/site-kit/react';

export function LogoutButton() {
  const { logout } = useAuth();
  const router = useRouter();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  async function handleLogout() {
    if (isLoggingOut) return;

    setIsLoggingOut(true);
    try {
      await logout();
      toast.success('Vous êtes déconnecté.');
      router.replace('/');
      router.refresh();
    } catch {
      setIsLoggingOut(false);
      toast.error('La déconnexion a échoué. Veuillez réessayer.');
    }
  }

  return (
    <button
      type="button"
      onClick={() => {
        void handleLogout();
      }}
      disabled={isLoggingOut}
      aria-label="Se déconnecter"
      className="flex min-h-11 items-center gap-1.5 rounded-md border border-neutral-200 px-3 text-neutral-700 transition hover:border-neutral-300 hover:bg-neutral-50 hover:text-neutral-900 disabled:cursor-wait disabled:opacity-50"
    >
      <LogOut className="h-5 w-5" aria-hidden="true" />
      <span className="hidden sm:inline">
        {isLoggingOut ? 'Déconnexion…' : 'Se déconnecter'}
      </span>
    </button>
  );
}
