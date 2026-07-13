'use client';

import { useEffect, type ReactNode } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useAuth } from '@extracom/site-kit/react';
import { CompanySwitcher } from '@/components/site/CompanySwitcher';
import { PageLoader } from '@/components/site/Loader';

const NAV: [string, string][] = [
  ['Aperçu', '/compte'],
  ['Profil', '/compte/profil'],
  ['Adresses', '/compte/adresses'],
  ['Commandes', '/compte/commandes']
];

export default function CompteLayout({ children }: { children: ReactNode }) {
  const { user, isLoading, logout } = useAuth();
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !user) {
      router.replace(`/connexion?redirect=${encodeURIComponent(pathname)}`);
    }
  }, [isLoading, pathname, router, user]);

  if (isLoading || !user)
    return <PageLoader label="Chargement de votre compte…" />;

  return (
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
  );
}
