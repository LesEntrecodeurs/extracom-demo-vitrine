import Link from "next/link";

const navigation = {
  produits: [
    { label: "Machines", href: "/catalogue?famille=machines" },
    { label: "Chariots", href: "/catalogue?famille=chariots" },
    { label: "Produits d'entretien", href: "/catalogue?famille=produits" },
    { label: "Matériel manuel", href: "/catalogue?famille=manuel" },
  ],
  marques: [
    { label: "Toutes les marques", href: "/marques" },
    { label: "Kärcher", href: "/marques/karcher" },
    { label: "Nilfisk", href: "/marques/nilfisk" },
    { label: "Numatic", href: "/marques/numatic" },
  ],
  services: [
    { label: "SAV", href: "/services#sav" },
    { label: "Location", href: "/services#location" },
    { label: "Formation", href: "/services#formation" },
    { label: "Aides CARSAT", href: "/services#aides-carsat" },
  ],
  aide: [
    { label: "Contact", href: "/contact" },
    { label: "À propos", href: "/a-propos" },
    { label: "Blog", href: "/blog" },
    { label: "Glossaire", href: "/glossaire" },
    { label: "Mentions légales", href: "/mentions-legales" },
    { label: "CGV", href: "/cgv" },
  ],
};

export function Footer() {
  return (
    <footer className="bg-primary text-white">
      <div className="mx-auto max-w-7xl px-4 pb-8 pt-16 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 gap-8 md:grid-cols-4 lg:grid-cols-5">
          {/* Brand */}
          <div className="col-span-2 md:col-span-1 lg:col-span-1">
            <Link href="/" className="inline-block text-xl font-bold font-heading">
              Wédis
            </Link>
            <p className="mt-3 text-sm text-white/70 max-w-xs">
              Depuis 1998, votre distributeur de matériel et produits de nettoyage
              professionnel dans le Grand Est.
            </p>
            <div className="mt-4 space-y-1.5 text-sm text-white/70">
              <p>678 avenue du Général Leclerc</p>
              <p>54130 Neuves-Maisons</p>
              <p className="mt-2">
                <a href="tel:0383472626" className="hover:text-white transition-colors">
                  03 83 47 26 26
                </a>
              </p>
              <p>
                <a href="mailto:contact@wedis.fr" className="hover:text-white transition-colors">
                  contact@wedis.fr
                </a>
              </p>
            </div>
          </div>

          {/* Produits */}
          <div>
            <h3 className="text-sm font-semibold tracking-wider uppercase">
              Produits
            </h3>
            <ul className="mt-4 space-y-2">
              {navigation.produits.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="text-sm text-white/70 transition-colors hover:text-white"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Marques */}
          <div>
            <h3 className="text-sm font-semibold tracking-wider uppercase">
              Marques
            </h3>
            <ul className="mt-4 space-y-2">
              {navigation.marques.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="text-sm text-white/70 transition-colors hover:text-white"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Services */}
          <div>
            <h3 className="text-sm font-semibold tracking-wider uppercase">
              Services
            </h3>
            <ul className="mt-4 space-y-2">
              {navigation.services.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="text-sm text-white/70 transition-colors hover:text-white"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Aide */}
          <div>
            <h3 className="text-sm font-semibold tracking-wider uppercase">
              Aide
            </h3>
            <ul className="mt-4 space-y-2">
              {navigation.aide.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="text-sm text-white/70 transition-colors hover:text-white"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-12 border-t border-white/20 pt-8">
          <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
            <p className="text-sm text-white/60">
              &copy; {new Date().getFullYear()} Wédis — Tous droits réservés
            </p>
            <div className="flex gap-4 text-sm text-white/60">
              <Link href="/mentions-legales" className="hover:text-white transition-colors">
                Mentions légales
              </Link>
              <Link href="/cgv" className="hover:text-white transition-colors">
                CGV
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
