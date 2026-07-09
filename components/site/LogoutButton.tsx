'use client';

import { useRouter } from 'next/navigation';
import { useAuth } from '@extracom/site-kit/react';

export function LogoutButton() {
  const { logout } = useAuth();
  const router = useRouter();

  return (
    <button
      type="button"
      onClick={async () => {
        await logout();
        router.refresh();
      }}
      aria-label="Se déconnecter"
      className="flex items-center gap-1.5 text-neutral-500 hover:text-neutral-900"
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
        d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path d="m16 17 5-5-5-5" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M21 12H9" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
