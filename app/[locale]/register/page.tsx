'use client'

import { useState } from "react";
import Link from "next/link";
import { authClient } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";
import { useTranslations } from 'next-intl';

export default function RegisterPage() {
  const t = useTranslations('RegisterPage');
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const res = await authClient.signUp.email({ name, email, password });

    setLoading(false);

    if (res?.error) {
      setError(res.error.message || t('errorRegister'));
      return;
    }

    window.location.href = "/";
  }

  return (
    <main className="mx-auto max-w-md px-6 py-16">
      <h1 className="text-3xl font-bold">{t('title')}</h1>
      <p className="mt-2 text-muted-foreground">
        {t('subtitle')}
      </p>

      <form onSubmit={onSubmit} className="mt-8 space-y-4">
        <div className="space-y-2">
          <label className="text-sm">{t('nameLabel')}</label>
          <input
            className="w-full rounded-md border bg-background px-3 py-2"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder={t('namePlaceholder')}
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm">{t('emailLabel')}</label>
          <input
            className="w-full rounded-md border bg-background px-3 py-2"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder={t('emailPlaceholder')}
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm">{t('passwordLabel')}</label>
          <input
            type="password"
            className="w-full rounded-md border bg-background px-3 py-2"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder={t('passwordPlaceholder')}
          />
        </div>

        {error ? <p className="text-sm text-red-500">{error}</p> : null}

        <Button type="submit" className="w-full" disabled={loading}>
          {loading ? t('creating') : t('createButton')}
        </Button>
      </form>

      <p className="mt-6 text-sm text-muted-foreground">
        {t('haveAccount')}{" "}
        <Link className="underline" href="/login">
          {t('login')}
        </Link>
      </p>
    </main>
  );
}
