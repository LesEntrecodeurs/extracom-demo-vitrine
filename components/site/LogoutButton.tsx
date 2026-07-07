'use client';

import { useAuth } from '@extracom/site-kit/react';

export function LogoutButton() {
  const { logout, isLoading } = useAuth();

  return (
    <button
      type="button"
      onClick={() => logout()}
      disabled={isLoading}
      className="btn-outline !px-4 !py-2"
    >
      Se déconnecter
    </button>
  );
}