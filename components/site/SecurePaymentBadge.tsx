export function SecurePaymentBadge() {
  return (
    <div className="flex items-center gap-2 rounded-full border border-neutral-200 bg-white px-3 py-2 text-xs font-medium text-neutral-700 shadow-sm">
      <span className="inline-flex h-6 w-9 items-center justify-center overflow-hidden rounded bg-[#0b3f8c]" aria-label="Carte Bancaire">
        <svg viewBox="0 0 36 24" role="img" className="h-full w-full" aria-labelledby="cb-logo-title">
          <title id="cb-logo-title">Logo CB</title>
          <rect width="36" height="24" rx="3" fill="#0b3f8c" />
          <path d="M23 0h10a3 3 0 0 1 3 3v18a3 3 0 0 1-3 3H23z" fill="#1aa06d" />
          <text x="18" y="15.7" textAnchor="middle" fontSize="10" fontWeight="800" fontFamily="Arial, Helvetica, sans-serif" fill="white" letterSpacing="0.5">
            CB
          </text>
        </svg>
      </span>
      <span>Paiement 100% sécurisé</span>
    </div>
  );
}
