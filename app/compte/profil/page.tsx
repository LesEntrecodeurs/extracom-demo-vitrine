'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { toast } from 'sonner';
import {
  useAuth,
  useAccount,
  useCompany,
  useDocuments
} from '@extracom/site-kit/react';
import { formatPrice } from '@extracom/site-kit';
import { PageLoader } from '@/components/site/Loader';

export default function ProfilPage() {
  const { user, isLoading: loadingUser, reload } = useAuth();
  const { activeId } = useCompany();
  const { changePassword, updateProfile, isLoading } = useAccount();
  const { data: ordersData, isLoading: loadingOrders } = useDocuments({
    type: 1
  });
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [err, setErr] = useState<string | null>(null);

  // Identité éditable : on amorce les champs dès que l'utilisateur est chargé.
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [savingId, setSavingId] = useState(false);
  useEffect(() => {
    if (user) {
      setName(user.name);
      setEmail(user.email);
    }
  }, [user]);

  if (loadingUser) return <PageLoader label="Chargement du profil…" />;
  if (!user) return null;

  const identityChanged =
    name.trim() !== user.name || email.trim() !== user.email;

  const initials = user.name
    .split(' ')
    .map((p) => p[0])
    .filter(Boolean)
    .slice(0, 2)
    .join('')
    .toUpperCase();

  const orders = ordersData?.data ?? [];
  const orderCount = orders.length;
  const totalSpent = orders.reduce(
    (sum, o) => sum + (o.totalInclVat ?? 0),
    0
  );

  return (
    <div className="max-w-2xl space-y-8">
      {/* Résumé de l'activité — commandes passées + montant total */}
      <section>
        <h2 className="mb-3 text-sm font-medium">Votre activité</h2>
        <OrderSummary
          orderCount={orderCount}
          totalSpent={totalSpent}
          loading={loadingOrders}
        />
      </section>

      {/* Identité — éditable (self-service) */}
      <div>
        <h1 className="mb-6 text-xl font-semibold">Profil</h1>
        <form
          className="card space-y-4 p-5"
          onSubmit={async (e) => {
            e.preventDefault();
            if (!identityChanged) return;
            setSavingId(true);
            try {
              await updateProfile({ name: name.trim(), email: email.trim() });
              await reload();
              toast.success('Profil mis à jour');
            } catch {
              toast.error('La mise à jour du profil a échoué.');
            } finally {
              setSavingId(false);
            }
          }}
        >
          <div className="flex items-center gap-4">
            <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[var(--brand-light)] font-semibold text-[var(--brand-dark)]">
              {initials || '?'}
            </span>
            <p className="text-sm text-neutral-500">
              Mettez à jour votre nom et votre email de connexion.
            </p>
          </div>
          <label className="block space-y-1">
            <span className="text-xs font-medium text-neutral-500">Nom</span>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="field"
            />
          </label>
          <label className="block space-y-1">
            <span className="text-xs font-medium text-neutral-500">Email</span>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="field"
            />
          </label>
          <button
            type="submit"
            disabled={savingId || !identityChanged}
            className="btn-primary"
          >
            {savingId ? '…' : 'Enregistrer'}
          </button>
        </form>
      </div>

      {/* Entreprises rattachées */}
      {user.memberships.length > 0 && (
        <div>
          <h2 className="mb-2 text-sm font-medium">Entreprises rattachées</h2>
          <ul className="space-y-2">
            {user.memberships.map((m) => {
              const isActive = m.customerId === activeId;
              return (
                <li
                  key={`${m.shopName}-${m.customerId}`}
                  className="card p-3 text-sm"
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-medium">
                      {m.companyName?.trim() || m.customerId}
                    </span>
                    {isActive && (
                      <span className="rounded-full bg-[var(--brand-light)] px-2 py-0.5 text-xs font-medium text-[var(--brand-dark)]">
                        Active
                      </span>
                    )}
                  </div>
                  {(() => {
                    const tags: string[] = [];
                    if (m.capabilities.canOrder) tags.push('Commande');
                    if (m.capabilities.canQuote) tags.push('Devis');
                    return tags.length > 0 ? (
                      <p className="mt-1 text-xs text-neutral-500">
                        {tags.join(' · ')}
                      </p>
                    ) : null;
                  })()}
                  {m.managedCustomerIds && m.managedCustomerIds.length > 0 && (
                    <p className="mt-1 text-xs text-neutral-400">
                      {m.managedCustomerIds.length} compte(s) géré(s)
                    </p>
                  )}
                </li>
              );
            })}
          </ul>
        </div>
      )}

      {/* Sécurité */}
      <section>
        <h2 className="mb-3 text-sm font-medium">Sécurité — mot de passe</h2>
        <form
          className="card space-y-4 p-5"
          onSubmit={async (e) => {
            e.preventDefault();
            setErr(null);
            if (password !== confirm) {
              setErr('Les mots de passe ne correspondent pas.');
              return;
            }
            try {
              await changePassword({
                email: user.email,
                newPassword: password
              });
              setPassword('');
              setConfirm('');
              toast.success('Mot de passe mis à jour');
            } catch {
              setErr('La mise à jour du mot de passe a échoué.');
            }
          }}
        >
          <input
            type="password"
            required
            minLength={8}
            placeholder="Nouveau mot de passe"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="field"
          />
          <input
            type="password"
            required
            placeholder="Confirmer le mot de passe"
            value={confirm}
            onChange={(e) => setConfirm(e.target.value)}
            className="field"
          />
          {err && (
            <p role="alert" className="text-sm text-red-600">
              {err}
            </p>
          )}
          <button type="submit" disabled={isLoading} className="btn-primary">
            {isLoading ? '…' : 'Mettre à jour le mot de passe'}
          </button>
        </form>
      </section>
    </div>
  );
}

function OrderSummary({
  orderCount,
  totalSpent,
  loading
}: {
  orderCount: number;
  totalSpent: number;
  loading: boolean;
}) {
  if (loading) {
    return (
      <div className="card grid grid-cols-1 gap-4 p-5 sm:grid-cols-2">
        <div className="h-16 animate-pulse rounded bg-neutral-100" />
        <div className="h-16 animate-pulse rounded bg-neutral-100" />
      </div>
    );
  }

  return (
    <div className="card divide-y divide-neutral-100 sm:divide-y-0 sm:divide-x">
      <div className="grid grid-cols-1 sm:grid-cols-2">
        <div className="flex flex-col gap-1 p-5">
          <span className="text-xs font-medium uppercase tracking-wide text-neutral-500">
            Commandes passées
          </span>
          <span className="text-3xl font-semibold text-[var(--brand-dark)]">
            {orderCount}
          </span>
          {orderCount === 0 && (
            <Link
              href="/catalogue"
              className="mt-1 text-sm font-medium text-[var(--brand-dark)] hover:underline"
            >
              Découvrir le catalogue →
            </Link>
          )}
        </div>
        <div className="flex flex-col gap-1 p-5">
          <span className="text-xs font-medium uppercase tracking-wide text-neutral-500">
            Montant total dépensé
          </span>
          <span className="text-3xl font-semibold text-[var(--brand-dark)]">
            {formatPrice(totalSpent)}
          </span>
          {orderCount > 0 && (
            <Link
              href="/compte/commandes"
              className="mt-1 text-sm font-medium text-[var(--brand-dark)] hover:underline"
            >
              Voir mes commandes →
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}
