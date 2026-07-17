"use client";

import { useState } from "react";
import { useAuth, useAccount } from "@extracom/site-kit/react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Container } from "@/components/ui/Container";
import Link from "next/link";
import { toast } from "sonner";
import { LogOut } from "lucide-react";

function ProfilContent() {
  const { user, isLoading: authLoading, logout } = useAuth();
  const { updateProfile, isLoading: isUpdating } = useAccount();

  const [form, setForm] = useState({
    name: user?.name || "",
    email: user?.email || "",
  });

  if (authLoading) {
    return <div className="animate-pulse h-40 bg-surface-secondary rounded-lg" />;
  }

  if (!user) {
    return (
      <div className="text-center py-12">
        <p className="text-lg font-medium">Connectez-vous pour voir votre profil</p>
        <Link href="/connexion"><Button className="mt-4">Se connecter</Button></Link>
      </div>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const payload: { name?: string; email?: string } = {};
      if (form.name !== user.name) payload.name = form.name;
      if (form.email !== user.email) payload.email = form.email;
      if (Object.keys(payload).length === 0) {
        toast.info("Aucune modification");
        return;
      }
      await updateProfile(payload);
      toast.success("Profil mis à jour");
    } catch {
      toast.error("Erreur lors de la mise à jour");
    }
  };

  const handleLogout = async () => {
    await logout();
    toast.success("Déconnecté");
    window.location.href = "/";
  };

  return (
    <>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold font-heading">Mon profil</h2>
        <Button variant="ghost" size="sm" onClick={handleLogout}>
          <LogOut className="mr-1 h-4 w-4" /> Déconnexion
        </Button>
      </div>

      <div className="rounded-lg border border-border p-6 space-y-4 mb-6">
        <p className="text-sm text-text-secondary">Email</p>
        <p className="font-medium">{user.email}</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5 rounded-lg border border-border p-6">
        <h3 className="font-semibold">Modifier mes informations</h3>
        <Input
          label="Nom complet"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
        />
        <Input
          label="Email"
          type="email"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
        />
        <Button type="submit" isLoading={isUpdating}>Enregistrer</Button>
      </form>
    </>
  );
}

export default function ProfilPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-3xl font-bold font-heading mb-8">Mon compte</h1>
      <div className="flex flex-col lg:flex-row gap-8">
        <aside className="lg:w-56 shrink-0">
          <nav className="space-y-1">
            <Link href="/compte/commandes" className="block rounded-md px-3 py-2 text-sm font-medium text-text-secondary hover:bg-surface-secondary hover:text-text transition-colors">Mes commandes</Link>
            <Link href="/compte/adresses" className="block rounded-md px-3 py-2 text-sm font-medium text-text-secondary hover:bg-surface-secondary hover:text-text transition-colors">Mes adresses</Link>
            <Link href="/compte/profil" className="block rounded-md px-3 py-2 text-sm font-medium text-primary bg-primary/5">Mon profil</Link>
          </nav>
        </aside>
        <div className="flex-1 min-w-0"><ProfilContent /></div>
      </div>
    </div>
  );
}
