import type { ReactNode } from 'react';
import Link from 'next/link';

export type FaqItem = {
  question: string;
  /** Texte brut, sans JSX — sert au JSON-LD et aux crawlers. */
  plain: string;
  /** Rendu ReactNode (peut contenir des liens internes) — sert à l'affichage. */
  rich: ReactNode;
};

export function buildHomeFaq(shopName: string): FaqItem[] {
  return [
    {
      question: `Comment accéder aux tarifs négociés de ${shopName} ?`,
      plain: `${shopName} affiche les prix par client après connexion. Pour voir vos tarifs négociés, créez un compte professionnel en quelques minutes — votre inscription est validée par un commercial. Vous accédez ensuite à vos prix, remises et historique depuis votre espace client.`,
      rich: (
        <>
          {shopName} affiche les prix par client après connexion. Pour voir
          vos tarifs négociés,{' '}
          <Link href="/inscription" className="font-medium underline">
            créez un compte professionnel
          </Link>{' '}
          en quelques minutes — votre inscription est validée par un
          commercial. Vous accédez ensuite à vos prix, remises et historique
          depuis votre{' '}
          <Link href="/compte" className="font-medium underline">
            espace client
          </Link>
          .
        </>
      )
    },
    {
      question: `Qui peut commander sur ${shopName} ?`,
      plain: `${shopName} est réservée aux professionnels : entreprises, artisans, collectivités, associations. Toute personne morale peut demander un compte pro, parcourir le catalogue et demander un devis. La commande en ligne est ouverte selon vos droits et les réglages de la boutique.`,
      rich: (
        <>
          {shopName} est réservée aux professionnels : entreprises, artisans,
          collectivités, associations. Toute personne morale peut demander un
          compte pro, parcourir le{' '}
          <Link href="/catalogue" className="font-medium underline">
            catalogue
          </Link>{' '}
          et demander un devis. La commande en ligne est ouverte selon vos
          droits et les réglages de la boutique.
        </>
      )
    },
    {
      question: `Quels sont les délais de livraison de ${shopName} ?`,
      plain: `${shopName} expédie les commandes sous 24 à 48 heures ouvrées après validation. Le délai exact dépend du transporteur, du poids et de la destination. Vous retrouvez le détail du suivi dans votre espace client, rubrique commandes.`,
      rich: (
        <>
          {shopName} expédie les commandes sous 24 à 48 heures ouvrées après
          validation. Le délai exact dépend du transporteur, du poids et de la
          destination. Vous retrouvez le détail du suivi dans votre{' '}
          <Link href="/compte" className="font-medium underline">
            espace client
          </Link>
          , rubrique commandes.
        </>
      )
    },
    {
      question: `Comment demander un devis à ${shopName} ?`,
      plain: `${shopName} permet de demander un devis en un clic depuis chaque fiche produit ou depuis votre panier. Ajoutez vos articles, cliquez sur « Demander un devis », validez : votre demande est transmise à notre équipe qui revient vers vous sous 24 heures ouvrées.`,
      rich: (
        <>
          {shopName} permet de demander un devis en un clic depuis chaque
          fiche produit ou depuis votre panier. Ajoutez vos articles, cliquez
          sur « Demander un devis », validez : votre demande est transmise à
          notre équipe qui revient vers vous sous 24 heures ouvrées.
        </>
      )
    },
    {
      question: `${shopName} accepte-t-elle le paiement par carte bancaire ?`,
      plain: `${shopName} propose le paiement en ligne par carte bancaire lorsque la boutique l'active. Vous voyez l'option apparaître dans votre tunnel de commande ; sinon, votre commercial vous indique les modalités de règlement convenues avec votre compte.`,
      rich: (
        <>
          {shopName} propose le paiement en ligne par carte bancaire lorsque
          la boutique l'active. Vous voyez l'option apparaître dans votre
          tunnel de commande ; sinon, votre commercial vous indique les
          modalités de règlement convenues avec votre compte.
        </>
      )
    }
  ];
}