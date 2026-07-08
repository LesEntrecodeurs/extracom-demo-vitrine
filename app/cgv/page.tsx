import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Conditions générales de vente',
  description:
    'Conditions générales de vente de la boutique : commande, prix, paiement, livraison, retours et litiges.',
  alternates: { canonical: '/cgv' }
};

/**
 * Conditions générales de vente — page statique affichée à l'URL /cgv.
 *
 * La version « officielle » acceptée à l'inscription provient des
 * `TermsDocument` du kit (configuration Extracom / Sage). Cette page propose
 * un gabarit lisible et pérenne, avec une clause rédigée à la demande du
 * marchand pour le paiement à la livraison. Les sections marquées
 * « [À compléter] » sont à rédiger par le marchand et à faire valider
 * juridiquement avant publication.
 */
export default function CgvPage() {
  return (
    <article className="mx-auto max-w-2xl space-y-8">
      <h1 className="text-2xl font-bold">Conditions générales de vente</h1>

      <p className="rounded-md border border-amber-200 bg-amber-50 p-3 text-sm text-amber-900">
        Brouillon en attente de validation par votre conseil juridique.
        Les sections marquées « [À compléter] » doivent être personnalisées
        avec vos conditions réelles avant publication.
      </p>

      {sections.map((s) => (
        <section key={s.title}>
          <h2 className="text-lg font-semibold">{s.title}</h2>
          <p className="mt-2 text-sm leading-relaxed whitespace-pre-line text-neutral-600">
            {s.body}
          </p>
        </section>
      ))}
    </article>
  );
}

const sections = [
  {
    title: '1. Objet et champ d’application',
    body: `Les présentes conditions générales de vente (CGV) régissent les
relations entre [raison sociale] et ses clients professionnels dans le cadre
des commandes passées sur le site [À compléter].`
  },
  {
    title: '2. Commandes et devis',
    body: `[À compléter : processus de commande, validation, devis, conditions
particulières B2B, etc.]`
  },
  {
    title: '3. Prix et conditions tarifaires',
    body: `[À compléter : grille tarifaire, tarifs négociés, conditions de
révision, etc.]`
  },
  {
    title: '4. Paiement',
    body: `4.1 Moyens de paiement
Le règlement des commandes s’effectue en ligne, par carte bancaire, lors de
la validation de la commande, via une page de paiement sécurisée.

4.2 Paiement à la livraison pour les clients autorisés
Pour les clients disposant d’un compte ouvert auprès de notre service
commercial et autorisés à ce mode de règlement, le paiement de la commande
peut être effectué à la livraison, dans les conditions convenues avec le
commercial en charge du compte.

Ce mode de paiement est strictement réservé aux clients préalablement
autorisés ; il n’est pas proposé par défaut lors de la commande en ligne. Tout
client non autorisé règle le montant de sa commande par les moyens de
paiement en ligne proposés à la validation.

La liste des clients autorisés au paiement à la livraison est tenue à jour
par notre service commercial. Toute évolution (ajout ou retrait d’un client)
prend effet dès sa prise en compte par nos services.`
  },
  {
    title: '5. Livraison et délais',
    body: `[À compléter : délais, frais, zones, transporteur, conditions de
réception, etc.]`
  },
  {
    title: '6. Retours, réclamations et garanties',
    body: `[À compléter : conditions de retour, SAV, garanties légales et
contractuelles, etc.]`
  },
  {
    title: '7. Responsabilité, données et litiges',
    body: `[À compléter : responsabilité, traitement des données personnelles,
tribunal compétent, médiation, etc.]`
  }
];