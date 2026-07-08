import type { Metadata } from 'next';
import { AuthGate } from '@/components/site/AuthGate';
import { CartView } from '@/components/site/CartView';

// Page transactionnelle (panier client connecté) — pas d'indexation : le
// contenu est personnel et n'a aucun intérêt dans un moteur de recherche.
export const metadata: Metadata = {
  title: 'Mon panier',
  robots: { index: false, follow: false }
};

export default function PanierPage() {
  return (
    <AuthGate message="Connectez-vous pour accéder à votre panier.">
      <CartView />
    </AuthGate>
  );
}
