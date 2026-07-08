import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Politique de cookies',
  description:
    'Politique de cookies : types de cookies utilisés, finalités, durées de conservation et gestion du consentement.',
  alternates: { canonical: '/politique-cookies' }
};

/**
 * Politique de cookies — contenu statique éditable par l'agent.
 * À faire valider juridiquement.
 */
export default function PolitiqueCookiesPage() {
  return (
    <article className="mx-auto max-w-2xl space-y-8">
      <h1 className="text-2xl font-bold">Politique de cookies</h1>

      {sections.map((s) => (
        <section key={s.title}>
          <h2 className="text-lg font-semibold">{s.title}</h2>
          <p className="mt-2 text-sm leading-relaxed whitespace-pre-line text-neutral-600">
            {s.body}
          </p>
        </section>
      ))}

      <section>
        <h2 className="text-lg font-semibold">Détail des cookies utilisés</h2>
        <div className="mt-2 overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-neutral-200 text-neutral-500">
              <tr>
                <th className="py-2 pr-4 font-medium">Nom</th>
                <th className="py-2 pr-4 font-medium">Finalité</th>
                <th className="py-2 font-medium">Durée</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100 text-neutral-600">
              {cookies.map((c) => (
                <tr key={c.name}>
                  <td className="py-2 pr-4 font-mono text-xs">{c.name}</td>
                  <td className="py-2 pr-4">{c.purpose}</td>
                  <td className="py-2">{c.duration}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </article>
  );
}

// ⤵ À personnaliser pour le shop puis faire valider juridiquement.
const sections = [
  {
    title: "Qu'est-ce qu'un cookie ?",
    body: `Un cookie est un petit fichier texte déposé sur votre appareil (ordinateur,
tablette, smartphone) lorsque vous consultez un site web. Il permet au site de
mémoriser vos actions et préférences (connexion, panier, langue…) pendant la
durée de votre visite ou lors de vos visites ultérieures.`
  },
  {
    title: 'Cookies essentiels',
    body: `Ce site utilise uniquement des cookies strictement nécessaires à son
fonctionnement : maintien de la session, mémorisation du panier, sécurité des
formulaires. Ces cookies ne nécessitent pas de consentement préalable au titre
du RGPD car ils sont indispensables au service demandé.`
  },
  {
    title: 'Cookies non essentiels',
    body: `Aucun cookie de mesure d’audience (analytics) ni de marketing n’est
déposé par défaut. Si de tels cookies étaient ajoutés à l’avenir, ils seraient
soumis à un consentement explicite et préalable via le bandeau « Cookies »,
conformément à la réglementation en vigueur.`
  },
  {
    title: 'Gérer son consentement',
    body: `Lors de votre première visite, un bandeau vous informe de l’utilisation
des cookies essentiels. Vous pouvez accepter ou fermer ce bandeau ; votre choix
est mémorisé et le bandeau ne réapparaît plus lors de vos visites suivantes.
Pour modifier votre choix, vous pouvez supprimer les données de navigation de
votre navigateur.`
  },
  {
    title: 'Durées de conservation',
    body: `Les cookies essentiels sont conservés pour la durée de la session ou,
au maximum, 13 mois conformément aux recommandations de la CNIL. Aucune donnée
n’est conservée au-delà.`
  },
  {
    title: 'Contact',
    body: `Pour toute question relative aux cookies et à la protection de vos
données, vous pouvez nous écrire à [email de contact].`
  }
];

const cookies = [
  {
    name: 'session',
    purpose: 'Maintien de la session de navigation et du panier.',
    duration: 'Session'
  },
  {
    name: 'cookie-consent',
    purpose: 'Mémorise votre choix vis-à-vis du bandeau cookies.',
    duration: '13 mois (localStorage)'
  }
];