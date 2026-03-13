'use client'

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useLocale, useTranslations } from 'next-intl';
import { Link } from "@/i18n/routing";
import { useSearchParams } from "next/navigation";

export default function LoginPage() {
  const t = useTranslations('LoginPage');
  const locale = useLocale();
  const searchParams = useSearchParams();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const res = await fetch("/api/auth/sign-in/email", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include", // 🔑 essencial
      body: JSON.stringify({ email, password }),
    });

    const data = await res.json().catch(() => ({}));
    setLoading(false);

    if (!res.ok) {
      setError(data?.error?.message ?? t('errorLogin'));
      return;
    }

    // ✅ sessão criada corretamente
    const redirectTarget = searchParams.get("redirect") || `/${locale}`;
    window.location.href = redirectTarget;
  }

  return (
    <main className="mx-auto max-w-md px-6 py-16">
      <h1 className="text-3xl font-bold">{t('title')}</h1>

      <form onSubmit={onSubmit} className="mt-8 space-y-4">
        <input
          placeholder={t('emailPlaceholder')}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full border p-2 rounded"
          required
        />
        <input
          type="password"
          placeholder={t('passwordPlaceholder')}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full border p-2 rounded"
          required
        />

        {error && <p className="text-red-500">{error}</p>}

        <Button type="submit" className="w-full" disabled={loading}>
          {loading ? t('loggingIn') : t('loginButton')}
        </Button>
      </form>

      <p className="mt-4 text-sm">
        {t('noAccount')} <Link href="/register">{t('createAccount')}</Link>
      </p>
    </main>
  );
}
