import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "À propos",
  description:
    "En savoir plus sur notre entreprise, notre histoire et notre façon d'accompagner nos clients professionnels.",
};

export default function AProposPage() {
  return (
    <main className="mx-auto max-w-5xl px-4 py-10 space-y-8">
      <header className="space-y-2">
        <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
          À propos de notre entreprise
        </h1>
        <p className="text-muted-foreground max-w-2xl">
          Cette page de présentation contient pour le moment un texte provisoire.
          Elle sera bientôt remplacée par une description fidèle de votre
          activité, de votre équipe et de vos engagements auprès de vos clients
          professionnels.
        </p>
      </header>

      <section className="grid gap-8 md:grid-cols-3">
        <div className="space-y-2">
          <h2 className="text-lg font-medium">Qui nous sommes</h2>
          <p className="text-sm text-muted-foreground">
            Depuis plusieurs années, nous accompagnons des entreprises de
            secteurs variés avec une même idée : simplifier leur quotidien en
            leur proposant une offre claire, un suivi réactif et des solutions
            adaptées à leurs contraintes.
          </p>
        </div>

        <div className="space-y-2">
          <h2 className="text-lg font-medium">Ce que nous faisons</h2>
          <p className="text-sm text-muted-foreground">
            Notre catalogue, nos services et nos outils en ligne sont pensés pour
            les besoins du B2B : gestion des comptes clients, conditions
            tarifaires spécifiques, commandes récurrentes et accompagnement dans
            la durée.
          </p>
        </div>

        <div className="space-y-2">
          <h2 className="text-lg font-medium">Notre façon de travailler</h2>
          <p className="text-sm text-muted-foreground">
            Proximité, transparence et réactivité guident nos échanges au
            quotidien. Nous vous aidons à trouver rapidement les réponses dont
            vous avez besoin, que ce soit pour un simple renseignement ou un
            projet plus structurant.
          </p>
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="text-xl font-semibold">Et la suite ?</h2>
        <p className="text-muted-foreground max-w-3xl">
          Ce contenu est provisoire : il pourra être remplacé par une
          présentation plus détaillée de votre entreprise (dates clés, équipe,
          valeurs, zones d&apos;intervention, chiffres, photos, etc.). N&apos;hésitez pas
          à nous indiquer les informations que vous souhaitez mettre en avant.
        </p>
      </section>
    </main>
  );
}
