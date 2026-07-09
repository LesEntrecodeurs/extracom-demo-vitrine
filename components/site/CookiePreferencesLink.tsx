'use client';

const STORAGE_KEY = 'cookie-consent';

/**
 * Lien « Gérer mes préférences cookies » : efface le choix mémorisé dans le
 * stockage local puis recharge la page pour rouvrir la bannière
 * `CookieConsent`. Permet au visiteur de revenir sur son choix à tout moment
 * depuis le pied de page.
 */
export function CookiePreferencesLink({
  className
}: {
  className?: string;
}) {
  const onClick = () => {
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch {
      /* stockage indisponible (mode privé strict) — on recharge quand même */
    }
    window.location.reload();
  };

  return (
    <button
      type="button"
      onClick={onClick}
      className={className ?? 'hover:text-neutral-600'}
    >
      Gérer mes préférences cookies
    </button>
  );
}