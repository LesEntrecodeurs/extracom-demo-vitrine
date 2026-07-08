import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Mentions légales',
  description:
    'Informations légales de Boutique Martin : éditeur, hébergeur, propriété intellectuelle et données personnelles.',
  alternates: { canonical: '/mentions-legales' }
};

/**
 * Mentions légales — contenu statique éditable par l'agent. Remplace les
 * champs entre crochets par les informations réelles du shop (éditeur,
 * hébergeur, etc.). Contenu indicatif, à faire valider juridiquement.
 */
export default function MentionsLegalesPage() {
  return (
    <article className="mx-auto max-w-2xl space-y-8">
      <h1 className="text-2xl font-bold">Mentions légales</h1>

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

// ⤵ À personnaliser pour le shop puis faire valider juridiquement.
// Les informations ci-dessous sont à compléter avec les données réelles
// du marchand. Les champs entre crochets attendent une valeur.
const sections = [
  {
    title: 'Éditeur du site',
    body: `Boutique Martin — SARL au capital de [montant] €.
Siège social : 12 rue de Paris, Lyon.
SIREN : 123 456 789 — SIRET : [à compléter].
N° de TVA intracommunautaire : [à compléter].
Directeur de la publication : [nom et prénom].
Contact : contact@boutique-martin.fr`
  },
  {
    title: 'Hébergement',
    body: `Ce site est hébergé par [nom de l’hébergeur], [adresse de l’hébergeur].`
  },
  {
    title: 'Propriété intellectuelle',
    body: `L’ensemble des contenus du site Boutique Martin (textes, images,
marques, logos) est protégé. Toute reproduction ou représentation, totale ou
partielle, sans autorisation écrite préalable est interdite.`
  },
  {
    title: 'Données personnelles et cookies',
    body: `Les données collectées lors de la création de compte et des commandes
sont utilisées pour le traitement de la relation commerciale. Conformément au
RGPD, vous disposez d’un droit d’accès, de rectification et de suppression en
écrivant à contact@boutique-martin.fr.

Pour en savoir plus sur l’usage des cookies, consultez notre [politique de
cookies](/politique-cookies).`
  }
];
