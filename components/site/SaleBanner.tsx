import Link from 'next/link';

/**
 * Bandeau d'annonce plein largeur, affiché tout en haut du site (au-dessus
 * du menu principal). Sert à pousser une opération commerciale : soldes,
 * promotion saisonnière, événement… Réutilisable pour d'autres annonces.
 *
 * `tone` : couleur de fond du bandeau (`brand` = couleur principale,
 * `accent` = variante plus douce). Le texte reste lisible sur les deux.
 */
export function SaleBanner({
  message,
  ctaLabel = 'Découvrir',
  ctaHref = '/catalogue',
  tone = 'brand'
}: {
  message: string;
  ctaLabel?: string;
  ctaHref?: string;
  tone?: 'brand' | 'accent';
}) {
  const styles =
    tone === 'brand'
      ? 'bg-[var(--brand)] text-white'
      : 'bg-[var(--brand-light)] text-[var(--brand-dark)]';

  return (
    <div
      role="region"
      aria-label="Annonce commerciale"
      className={`w-full ${styles}`}
    >
      <div className="container-x flex flex-col items-center justify-center gap-2 py-2.5 text-center text-sm sm:flex-row sm:gap-3">
        <p className="font-medium">
          <span aria-hidden="true" className="mr-1">
            ☀
          </span>
          {message}
        </p>
        <Link
          href={ctaHref}
          className="inline-flex items-center gap-1 rounded-full border border-current/30 px-3 py-0.5 text-xs font-medium transition hover:bg-white/10"
        >
          {ctaLabel}
          <span aria-hidden="true">→</span>
        </Link>
      </div>
    </div>
  );
}