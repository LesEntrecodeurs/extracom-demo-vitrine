'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { useAuth, useShopContext } from '@extracom/site-kit/react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup
} from '@/components/ui/field';

export default function ConnexionPage() {
  const { login } = useAuth();
  const { data: context } = useShopContext();
  const registrationOpen = context?.capabilities?.registrationOpen ?? false;
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [pending, setPending] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  return (
    <div className="mx-auto max-w-md">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">Connexion</CardTitle>
          <CardDescription>
            Connectez-vous à votre compte pour accéder à votre panier, vos
            commandes et vos tarifs négociés.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form
            noValidate
            className="space-y-4"
            onSubmit={async (e) => {
              e.preventDefault();
              if (pending) return;
              if (!email.trim() || !password) {
                setErr('Veuillez saisir votre email et votre mot de passe.');
                return;
              }
              setPending(true);
              setErr(null);
              try {
                const res = await login({ email: email.trim(), password });
                if ('user' in res) {
                  const redirect =
                    new URLSearchParams(window.location.search).get(
                      'redirect'
                    ) || '/compte';
                  toast.success('Connexion réussie. Bon retour !');
                  router.push(redirect);
                } else {
                  // Changement de mot de passe imposé → on bascule sur le flux reset.
                  router.push(
                    `/mot-de-passe-oublie?email=${encodeURIComponent(email.trim())}`
                  );
                }
              } catch {
                setErr('Identifiants invalides. Vérifiez votre saisie.');
              } finally {
                setPending(false);
              }
            }}
          >
            <FieldGroup>
              <Field>
                <Label htmlFor="email">Adresse email</Label>
                <Input
                  id="email"
                  type="email"
                  autoComplete="email"
                  required
                  placeholder="vous@exemple.fr"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  aria-invalid={!!err || undefined}
                />
              </Field>
              <Field>
                <div className="flex items-center justify-between">
                  <Label htmlFor="password">Mot de passe</Label>
                  <Link
                    href="/mot-de-passe-oublie"
                    className="text-xs text-muted-foreground underline-offset-4 hover:text-primary hover:underline"
                  >
                    Mot de passe oublié ?
                  </Link>
                </div>
                <Input
                  id="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  aria-invalid={!!err || undefined}
                />
              </Field>
              {err && <FieldError>{err}</FieldError>}
            </FieldGroup>
            <Button
              type="submit"
              disabled={pending}
              className="w-full"
              size="lg"
            >
              {pending ? 'Connexion en cours…' : 'Se connecter'}
            </Button>
          </form>
          {registrationOpen && (
            <FieldDescription className="mt-4 text-center">
              Pas encore de compte ?{' '}
              <Link
                href="/inscription"
                className="font-medium text-primary underline-offset-4 hover:underline"
              >
                Créer un compte
              </Link>
            </FieldDescription>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
