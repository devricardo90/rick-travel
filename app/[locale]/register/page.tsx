'use client'

import { useState } from "react";
import Link from "next/link";
import { ShieldCheck, UserRound, Mail, KeyRound } from "lucide-react";
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
    <main className="relative min-h-screen overflow-hidden bg-[#071826] text-white">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-80"
        style={{
          background:
            'radial-gradient(1200px 560px at 50% -10%, rgba(255,255,255,0.09), transparent 58%), linear-gradient(180deg, rgba(200,168,107,0.06) 0%, transparent 18%)',
        }}
      />

      <div className="relative z-10 mx-auto flex min-h-screen max-w-7xl items-center px-5 py-20 lg:px-12">
        <div className="grid w-full gap-8 lg:grid-cols-[0.95fr_460px] lg:items-center">
          <section className="space-y-8">
            <div className="surface-dark-solid p-6 md:p-8">
              <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.05] px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.16em] text-[#d8c18f]">
                <ShieldCheck className="h-3.5 w-3.5" />
                Cadastro seguro
              </div>

              <h1 className="mt-6 max-w-[11ch] text-balance text-4xl font-semibold tracking-[-0.05em] text-white md:text-5xl">
                Crie sua conta para reservar com mais clareza
              </h1>

              <p className="mt-5 max-w-3xl text-[15px] leading-8 text-white/68 md:text-lg">
                Cadastre-se para acompanhar reservas, iniciar pagamentos e manter seu planejamento de viagem organizado em um só lugar.
              </p>

              <div className="mt-6 flex flex-wrap items-center gap-3">
                <span className="chip-dark">
                  <ShieldCheck className="h-3.5 w-3.5" />
                  Dados protegidos
                </span>
                <span className="chip-dark">
                  <UserRound className="h-3.5 w-3.5" />
                  Acesso ao histórico de reservas
                </span>
              </div>
            </div>
          </section>

          <section className="rounded-[28px] border border-white/8 bg-[#0d2436] p-6 shadow-[0_24px_70px_rgba(0,0,0,0.24)] md:p-7">
            <h2 className="text-2xl font-semibold tracking-[-0.04em] text-white">{t('title')}</h2>
            <p className="mt-3 text-sm leading-7 text-white/62">
              {t('subtitle')}
            </p>

            <form onSubmit={onSubmit} className="mt-6 space-y-5">
              <div className="grid gap-2">
                <label className="text-sm text-white/76">{t('nameLabel')}</label>
                <div className="relative">
                  <UserRound className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-white/42" />
                  <input
                    className="h-12 w-full rounded-2xl border border-white/10 bg-white/[0.04] px-11 py-2 text-sm text-white outline-none transition-colors placeholder:text-white/36 hover:bg-white/[0.06] focus:border-white/20"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder={t('namePlaceholder')}
                  />
                </div>
              </div>

              <div className="grid gap-2">
                <label className="text-sm text-white/76">{t('emailLabel')}</label>
                <div className="relative">
                  <Mail className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-white/42" />
                  <input
                    className="h-12 w-full rounded-2xl border border-white/10 bg-white/[0.04] px-11 py-2 text-sm text-white outline-none transition-colors placeholder:text-white/36 hover:bg-white/[0.06] focus:border-white/20"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder={t('emailPlaceholder')}
                  />
                </div>
              </div>

              <div className="grid gap-2">
                <label className="text-sm text-white/76">{t('passwordLabel')}</label>
                <div className="relative">
                  <KeyRound className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-white/42" />
                  <input
                    type="password"
                    className="h-12 w-full rounded-2xl border border-white/10 bg-white/[0.04] px-11 py-2 text-sm text-white outline-none transition-colors placeholder:text-white/36 hover:bg-white/[0.06] focus:border-white/20"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder={t('passwordPlaceholder')}
                  />
                </div>
              </div>

              {error ? <p className="rounded-2xl border border-red-400/20 bg-red-500/10 px-4 py-3 text-sm text-red-200">{error}</p> : null}

              <Button type="submit" className="h-12 w-full rounded-2xl" disabled={loading}>
                {loading ? t('creating') : t('createButton')}
              </Button>
            </form>

            <p className="mt-5 text-sm text-white/58">
              {t('haveAccount')}{" "}
              <Link className="font-medium text-[#d8c18f] transition-colors hover:text-[#f0ddaf]" href="/login">
                {t('login')}
              </Link>
            </p>
          </section>
        </div>
      </div>
    </main>
  );
}
