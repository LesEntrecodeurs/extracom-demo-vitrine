import './globals.css';
import type { ReactNode } from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { getContextAction, meAction } from '@extracom/site-kit/server';
import type { ShopContext, User } from '@extracom/site-kit';
import { Nav } from '@/components/site/Nav';
import { JsonLd } from '@/components/site/JsonLd';
import { CookieConsent } from '@/components/site/CookieConsent';
import { Toaster } from '@/components/ui/sonner';
import { siteUrl, localBusinessLd } from '@/lib/seo';
import { shopInfo } from '@/data/shop';

export const dynamic = 'force-dynamic';

export async function generateMetadata(): Promise<Metadata> {
  let name = 'Boutique';
  const description = shopInfo.shortDescription;
  try {
    const c = await getContextAction();
    name = c.branding?.name ?? c.shopName ?? name;
  } catch {
    /* dégrade proprement */
  }
  return {
    metadataBase: new URL(siteUrl()),
    title: { default: name, template: `%s · ${name}` },
    description,
    applicationName: name,
    openGraph: { title: name, description, type: 'website', siteName: name },
    twitter: { card: 'summary_large_image', title: name, description },
    robots: { index: true, follow: true }
  };
}

export default async function RootLayout({
  children
}: {
  children: ReactNode;
}) {
  let context: ShopContext | null = null;
  try {
    context = await getContextAction();
  } catch {
    context = null;
  }
  let user: User | null = null;
  try {
    user = await meAction();
  } catch {
    user = null;
  }
  const title = context?.branding?.name ?? context?.shopName ?? 'Boutique';

  return (
    <html lang="fr">
      <body>
        <JsonLd data={localBusinessLd(shopInfo, title)} />
        <Nav context={context} user={user} />
        <main className="container-x py-10">{children}</main>

        <footer className="mt-16 border-t border-neutral-200 bg-white">
          <div className="container-x grid gap-8 py-10 sm:grid-cols-2 md:grid-cols-4">
            <div>
              <p className="font-semibold">{title}</p>
              <p className="mt-2 text-sm text-neutral-500">
                {shopInfo.shortDescription}
              </p>
            </div>
            <FooterCol
              title="Boutique"
              links={[
                ['Catalogue', '/catalogue'],
                ['Mon panier', '/panier']
              ]}
            />
            <FooterCol
              title="Compte"
              links={[
                ['Connexion', '/connexion'],
                ...(context?.capabilities?.registrationOpen
                  ? [['Créer un compte', '/inscription'] as [string, string]]
                  : []),
                ['Mon compte', '/compte']
              ]}
            />
            <FooterCol
              title="Aide"
              links={[
                ['Nous contacter', '/contact'],
                ['À propos', '/a-propos'],
                ['Mentions légales', '/mentions-legales']
              ]}
            />
          </div>
          <div className="border-t border-neutral-100">
            <div className="container-x py-4 text-center text-xs text-neutral-400">
              © {new Date().getFullYear()} {title} — Propulsé par Extracom
            </div>
          </div>
        </footer>
        <CookieConsent />
        <Toaster richColors position="top-center" />
      </body>
    </html>
  );
}

function FooterCol({
  title,
  links
}: {
  title: string;
  links: [string, string][];
}) {
  return (
    <div>
      <p className="text-sm font-medium">{title}</p>
      <ul className="mt-2 space-y-1.5 text-sm text-neutral-500">
        {links.map(([label, href]) => (
          <li key={href}>
            <Link href={href} className="hover:text-neutral-900">
              {label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
