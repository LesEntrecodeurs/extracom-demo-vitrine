"use client";

import Link from "next/link";
import { useState } from "react";
import { Menu, X, Search, ShoppingCart, User, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "@extracom/site-kit/react";

const navigation = [
  { label: "Accueil", href: "/" },
  {
    label: "Catalogue",
    href: "/catalogue",
    children: [
      { label: "Machines", href: "/catalogue?famille=machines" },
      { label: "Chariots", href: "/catalogue?famille=chariots" },
      { label: "Produits d'entretien", href: "/catalogue?famille=produits" },
      { label: "Matériel manuel", href: "/catalogue?famille=manuel" },
    ],
  },
  {
    label: "Marques",
    href: "/marques",
    children: [
      { label: "Kärcher", href: "/marques/karcher" },
      { label: "Nilfisk", href: "/marques/nilfisk" },
      { label: "Numatic", href: "/marques/numatic" },
      { label: "Voir toutes", href: "/marques" },
    ],
  },
  { label: "Services", href: "/services" },
  { label: "Blog", href: "/blog" },
  { label: "Contact", href: "/contact" },
];

export function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const { user } = useAuth();

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/80">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between gap-4">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 shrink-0">
            <img
              src="/logo-wedis.png"
              alt="Wédis"
              className="h-10 w-auto"
            />
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-1">
            {navigation.map((item) => (
              <div
                key={item.href}
                className="relative"
                onMouseEnter={() => item.children && setOpenDropdown(item.label)}
                onMouseLeave={() => setOpenDropdown(null)}
              >
                <Link
                  href={item.href}
                  className={cn(
                    "flex items-center gap-1 rounded-md px-3 py-2 text-sm font-medium text-text-secondary transition-colors hover:bg-surface-secondary hover:text-text",
                  )}
                >
                  {item.label}
                  {item.children && (
                    <ChevronDown className="h-4 w-4" />
                  )}
                </Link>
                {item.children && openDropdown === item.label && (
                  <div className="absolute left-0 top-full mt-1 w-56 rounded-lg border border-border bg-white p-2 shadow-card">
                    {item.children.map((child) => (
                      <Link
                        key={child.href}
                        href={child.href}
                        className="block rounded-md px-3 py-2 text-sm text-text-secondary transition-colors hover:bg-surface-secondary hover:text-text"
                      >
                        {child.label}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </nav>

          {/* Right icons */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setSearchOpen(!searchOpen)}
              className="rounded-md p-2 text-text-secondary transition-colors hover:bg-surface-secondary hover:text-text"
              aria-label="Rechercher"
            >
              <Search className="h-5 w-5" />
            </button>

            <Link
              href={user ? "/compte/commandes" : "/connexion"}
              className="rounded-md p-2 text-text-secondary transition-colors hover:bg-surface-secondary hover:text-text"
              aria-label="Mon compte"
            >
              <User className="h-5 w-5" />
            </Link>

            <Link
              href="/panier"
              className="rounded-md p-2 text-text-secondary transition-colors hover:bg-surface-secondary hover:text-text"
              aria-label="Panier"
            >
              <ShoppingCart className="h-5 w-5" />
            </Link>

            {/* Mobile menu button */}
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="rounded-md p-2 text-text-secondary transition-colors hover:bg-surface-secondary hover:text-text lg:hidden"
              aria-label="Menu"
            >
              {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Search bar */}
      {searchOpen && (
        <div className="border-t border-border bg-white">
          <div className="mx-auto max-w-7xl px-4 py-3 sm:px-6 lg:px-8">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-text-secondary" />
              <input
                type="text"
                placeholder="Rechercher un produit, une marque…"
                className="w-full rounded-md border border-border bg-surface-secondary py-2.5 pl-10 pr-4 text-sm text-text placeholder:text-text-secondary focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
              />
            </div>
          </div>
        </div>
      )}

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="border-t border-border bg-white lg:hidden">
          <div className="space-y-1 px-4 py-3">
            {navigation.map((item) => (
              <div key={item.href}>
                <Link
                  href={item.href}
                  className="block rounded-md px-3 py-2 text-sm font-medium text-text-secondary hover:bg-surface-secondary hover:text-text"
                  onClick={() => setMobileOpen(false)}
                >
                  {item.label}
                </Link>
                {item.children && (
                  <div className="ml-4 space-y-1 pb-2">
                    {item.children.map((child) => (
                      <Link
                        key={child.href}
                        href={child.href}
                        className="block rounded-md px-3 py-1.5 text-sm text-text-secondary hover:bg-surface-secondary hover:text-text"
                        onClick={() => setMobileOpen(false)}
                      >
                        {child.label}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </header>
  );
}
