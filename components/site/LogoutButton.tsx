'use client';

import { LogOutIcon } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useTransition } from 'react';
import { toast } from 'sonner';
import { useAuth } from '@extracom/site-kit/react';
import { Button } from '@/components/ui/button';

/**
 * Bouton de déconnexion placé dans la barre de navigation.
 * Appelle `useAuth().logout()` du kit (vide la session côté serveur), puis
 * rafraîchit le layout serveur pour que la nav bascule de « Mon compte » à
 * « Connexion », et confirme visuellement.
 */
export function LogoutButton() {
  const { logout } = useAuth();
  const router = useRouter();
  const [pending, startTransition] = useTransition();

  const handleLogout = () => {
    startTransition(async () => {
      try {
        await logout();
        toast.success('Vous êtes déconnecté.');
        router.refresh();
      } catch {
        toast.error('La déconnexion a échoué. Réessayez.');
      }
    });
  };

  return (
    <Button
      type="button"
      variant="ghost"
      size="sm"
      onClick={handleLogout}
      disabled={pending}
      className="text-neutral-700 hover:text-neutral-900"
    >
      <LogOutIcon className="h-4 w-4" />
      <span className="hidden sm:inline">
        {pending ? 'Déconnexion…' : 'Se déconnecter'}
      </span>
      <span className="sr-only sm:hidden">Se déconnecter</span>
    </Button>
  );
}
