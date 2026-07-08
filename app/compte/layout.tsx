'use client';

import type { ReactNode } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@extracom/site-kit/react';
import { AuthGate } from '@/components/site/AuthGate';
import { CompanySwitcher } from '@/components/site/CompanySwitcher';

const NAV: [string, string][] = [
  ['Aperçu', '/compte'],
  ['Profil', '/compte/profil'],
  ['Adresses', '/compte/adresses'],
  ['Commandes', '/compte/commandes']
];

export default function CompteLayout({ children }: { children: ReactNode }) {
  const { logout } = useAuth();
  const pathname = usePathname();

  return (
    <AuthGate message="Connectez-vous pour accéder à votre espace compte.">
      <div className="grid gap-8 md:grid-cols-[220px_1fr]">
        <aside className="space-y-3">
          <CompanySwitcher />
          <div className="space-y-1">
            {NAV.map(([label, href]) => {
              const active = pathname === href;
              return (
                <Link
                  key={href}
                  href={href}
                  className={`block rounded-md px-3 py-2 text-sm ${
                    active
                      ? 'bg-[var(--brand-light)] font-medium text-[var(--brand-dark)]'
                      : 'text-neutral-700 hover:bg-neutral-100'
                  }`}
                >
                  {label}
                </Link>
              );
            })}
            <button
              type="button"
              onClick={() => logout()}
              className="mt-2 block w-full rounded-md px-3 py-2 text-left text-sm text-neutral-500 hover:bg-neutral-100"
            >
              Se déconnecter
            </button>
          </div>
        </aside>
        <section>{children}</section>
      </div>
    </AuthGate>
  );
}
