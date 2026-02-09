

"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function LoginPage() {
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
      credentials: "include", // 🔑 ESSENCIAL
      body: JSON.stringify({
        email,
        password,
        redirect: false, // 🔑 NÃO deixar o backend redirecionar
      }),
    });

    const data = await res.json().catch(() => ({}));
    setLoading(false);

    if (!res.ok) {
      setError(data?.error?.message ?? "Erro ao entrar");
      return;
    }

    // ✅ cookie criado corretamente
    // força recarregar tudo (middleware + header)
    window.location.replace("/");
  }

  return (
    <main className="mx-auto max-w-md px-6 py-16">
      <h1 className="text-3xl font-bold">Entrar</h1>
      <p className="mt-2 text-muted-foreground">
        Acesse sua conta para reservar passeios.
      </p>

      <form onSubmit={onSubmit} className="mt-8 space-y-4">
        <div className="space-y-2">
          <label className="text-sm">Email</label>
          <input
            className="w-full rounded-md border bg-background px-3 py-2"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="seu@email.com"
            required
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm">Senha</label>
          <input
            type="password"
            className="w-full rounded-md border bg-background px-3 py-2"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="********"
            required
          />
        </div>

        {error && <p className="text-sm text-red-500">{error}</p>}

        <Button type="submit" className="w-full" disabled={loading}>
          {loading ? "Entrando..." : "Entrar"}
        </Button>
      </form>

      <p className="mt-6 text-sm text-muted-foreground">
        Não tem conta?{" "}
        <Link className="underline" href="/register">
          Criar agora
        </Link>
      </p>
    </main>
  );
}

