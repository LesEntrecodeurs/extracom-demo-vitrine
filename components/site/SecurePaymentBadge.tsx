// Bandeau de réassurance « paiement 100% sécurisé » affiché sous le bouton
// de paiement de la page de commande. Sobre, sans dépendance, repose sur des
// SVG inline pour les marques de cartes (représentations génériques
// couramment utilisées sur les sites e-commerce français).
//
// Affichage attendu : cadenas + libellé + 4 pastilles de marques.
// Pas d'icône décorative de cadenas externe : tout est en SVG inline pour
// limiter les requêtes réseau et garder un rendu net quel que soit le zoom.

const LOCK_PATH =
  'M7 10V8a5 5 0 0 1 10 0v2M5 10h14v10H5z';

function VisaMark() {
  return (
    <svg viewBox="0 0 38 24" role="img" aria-label="Visa" className="h-5 w-auto">
      <rect width="38" height="24" rx="4" fill="#ffffff" stroke="#e5e7eb" />
      <text
        x="19"
        y="16"
        textAnchor="middle"
        fontFamily="ui-sans-serif, system-ui, sans-serif"
        fontWeight="800"
        fontStyle="italic"
        fontSize="9"
        fill="#1a1f71"
        letterSpacing="0.5"
      >
        VISA
      </text>
    </svg>
  );
}

function MastercardMark() {
  return (
    <svg viewBox="0 0 38 24" role="img" aria-label="Mastercard" className="h-5 w-auto">
      <rect width="38" height="24" rx="4" fill="#ffffff" stroke="#e5e7eb" />
      <circle cx="16" cy="12" r="5" fill="#eb001b" />
      <circle cx="22" cy="12" r="5" fill="#f79e1b" />
      <path
        d="M19 8.4a5 5 0 0 1 0 7.2 5 5 0 0 1 0-7.2Z"
        fill="#ff5f00"
      />
    </svg>
  );
}

function CbMark() {
  return (
    <svg viewBox="0 0 38 24" role="img" aria-label="Carte Bancaire" className="h-5 w-auto">
      <rect width="38" height="24" rx="4" fill="#ffffff" stroke="#e5e7eb" />
      <text
        x="19"
        y="16"
        textAnchor="middle"
        fontFamily="ui-sans-serif, system-ui, sans-serif"
        fontWeight="700"
        fontSize="9"
        fill="#003d7a"
        letterSpacing="0.5"
      >
        CB
      </text>
    </svg>
  );
}

function PaypalMark() {
  return (
    <svg viewBox="0 0 38 24" role="img" aria-label="PayPal" className="h-5 w-auto">
      <rect width="38" height="24" rx="4" fill="#ffffff" stroke="#e5e7eb" />
      <text
        x="19"
        y="16"
        textAnchor="middle"
        fontFamily="ui-sans-serif, system-ui, sans-serif"
        fontWeight="800"
        fontSize="9"
        fill="#003087"
        letterSpacing="0.2"
      >
        <tspan fill="#003087">Pay</tspan>
        <tspan fill="#009cde">Pal</tspan>
      </text>
    </svg>
  );
}

const MARKS = [VisaMark, MastercardMark, CbMark, PaypalMark];

export function SecurePaymentBadge() {
  return (
    <div className="mt-3 flex flex-col items-center gap-2 rounded-xl border border-neutral-200 bg-neutral-50 px-4 py-3 text-center text-xs text-neutral-600">
      <div className="flex items-center gap-1.5 font-medium text-neutral-700">
        <svg
          viewBox="0 0 24 24"
          aria-hidden="true"
          className="h-4 w-4 text-[var(--brand-dark)]"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d={LOCK_PATH} />
        </svg>
        Paiement 100&nbsp;% sécurisé
      </div>
      <div className="flex flex-wrap items-center justify-center gap-2">
        {MARKS.map((M, i) => (
          <M key={i} />
        ))}
      </div>
      <p className="text-[11px] leading-snug text-neutral-500">
        Vos données bancaires sont chiffrées et traitées par notre prestataire de paiement.
      </p>
    </div>
  );
}
