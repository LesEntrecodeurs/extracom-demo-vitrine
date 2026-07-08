'use client';

import { useRouter } from 'next/navigation';
import { useAuth } from '@extracom/site-kit/react';

/** Bouton de déconnexion pour le menu principal du site. */
export function LogoutButton() {
  const { logout } = useAuth();
  const router = useRouter();

  const handleLogout = async () => {
    await logout();
    router.push('/');
    router.refresh();
  };

  return (
    <button
      type="button"
      onClick={handleLogout}
      className="flex items-center gap-1.5 text-neutral-700 hover:text-neutral-900"
    >
      <LogoutIcon className="h-5 w-5" />
      <span className="hidden sm:inline">Se déconnecter</span>
    </button>
  );
}

function LogoutIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      aria-hidden="true"
    >
      <path
        d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path d="M10 17l-5-5 5-5" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M15 12H5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
