import Link from 'next/link';
import {
  ArrowRight,
  FileText,
  Inbox,
  MapPin,
  UserCircle
} from 'lucide-react';
import { getDocumentsAction } from '@extracom/site-kit/server';
import { formatDate, formatPrice } from '@extracom/site-kit';

function Shortcut({
  href,
  icon,
  title,
  desc
}: {
  href: string;
  icon: React.ReactNode;
  title: string;
  desc: string;
}) {
  return (
    <Link href={href} className="card group flex items-start gap-3 p-4">
      <span className="shrink-0 text-[var(--brand)]">{icon}</span>
      <span className="min-w-0 flex-1">
        <span className="block font-medium">{title}</span>
        <span className="mt-0.5 block text-sm text-neutral-500">{desc}</span>
      </span>
      <ArrowRight className="size-4 shrink-0 text-neutral-400 transition-transform duration-300 group-hover:translate-x-1 group-hover:text-[var(--brand-dark)]" />
    </Link>
  );
}

async function LatestQuote() {
  let reference: string | null = null;
  let date: string | null = null;
  let total: number | null = null;
  let id: string | null = null;

  try {
    const res = await getDocumentsAction({ type: 0 });
    const first = res?.data?.[0];
    if (first) {
      reference = first.reference;
      date = first.date;
      total = first.totalInclVat ?? null;
      id = first.id;
    }
  } catch {
    // Erreur API = état vide, pas de crash de la home.
  }

  if (!reference || !id) {
    return (
      <div className="card flex items-center gap-3 p-4">
        <span className="shrink-0 text-[var(--brand)]">
          <Inbox className="size-6" />
        </span>
        <span className="min-w-0 flex-1">
          <span className="block font-medium">Aucun devis pour l'instant</span>
          <span className="mt-0.5 block text-sm text-neutral-500">
            Vos devis apparaîtront ici dès qu'ils seront émis.
          </span>
        </span>
        <Link
          href="/compte/commandes?type=0"
          className="text-sm font-medium text-[var(--brand-dark)] hover:underline"
        >
          Mes devis →
        </Link>
      </div>
    );
  }

  return (
    <div className="card flex items-center gap-3 p-4">
      <span className="shrink-0 text-[var(--brand)]">
        <FileText className="size-6" />
      </span>
      <span className="min-w-0 flex-1">
        <span className="block font-medium">Dernier devis · {reference}</span>
        <span className="mt-0.5 block text-sm text-neutral-500">
          {formatDate(date)}
          {total != null && (
            <>
              {' · '}
              <span className="font-medium text-neutral-700">
                {formatPrice(total)}
              </span>
            </>
          )}
        </span>
      </span>
      <Link
        href={`/compte/commandes/${encodeURIComponent(id)}?type=0`}
        className="btn-primary !py-1.5 !text-sm"
      >
        Voir le devis
      </Link>
    </div>
  );
}

export async function ClientDashboard() {
  return (
    <section>
      <div className="mb-3 flex items-end justify-between gap-4">
        <h2 className="text-xl font-semibold">Votre espace rapide</h2>
        <Link
          href="/compte"
          className="text-sm text-[var(--brand-dark)] hover:underline"
        >
          Mon compte →
        </Link>
      </div>
      <div className="grid gap-3 sm:grid-cols-3">
        <Shortcut
          href="/compte/profil"
          icon={<UserCircle className="size-6" />}
          title="Mon profil"
          desc="Vos informations"
        />
        <Shortcut
          href="/compte/adresses"
          icon={<MapPin className="size-6" />}
          title="Mes adresses"
          desc="Livraison & facturation"
        />
        <Shortcut
          href="/compte/commandes?type=6"
          icon={<FileText className="size-6" />}
          title="Mes factures"
          desc="Historique de facturation"
        />
      </div>
      <div className="mt-3">
        <LatestQuote />
      </div>
    </section>
  );
}