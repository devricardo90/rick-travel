
"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { authClient } from "@/lib/auth-client";
import { useLocale } from "next-intl";

type SessionUser = {
  id: string;
  name: string | null;
  email: string;
  role?: "USER" | "ADMIN";
};

export function AuthStatus() {
  const [user, setUser] = useState<SessionUser | null>(null);
  const [loading, setLoading] = useState(true);
  const locale = useLocale();

  async function loadSession() {
    try {
      const res = await fetch("/api/auth/get-session", {
        credentials: "include",
        cache: "no-store",
      });

      const data = await res.json();
      setUser(data?.session?.user ?? null);
    } catch {
      setUser(null);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadSession();

    const onFocus = () => loadSession();
    window.addEventListener("focus", onFocus);

    return () => window.removeEventListener("focus", onFocus);
  }, []);


  async function logout() {
    await authClient.signOut({
      fetchOptions: {
        onSuccess: () => {
          window.location.href = `/${locale}`;
        },
      },
    });
  }


  if (loading) return null;

  // 🔓 DESLOGADO
  if (!user) {
    return (
      <>
        <Button asChild variant="outline" size="sm">
          <Link href="/login">Login</Link>
        </Button>

        <Button asChild size="sm">
          <Link href="/register">Criar conta</Link>
        </Button>
      </>
    );
  }

  // 🔐 LOGADO
  return (
    <>
      <span className="hidden sm:block text-sm text-muted-foreground">
        Olá, <strong>{user.name ?? "usuário"}</strong>
      </span>

      <Button asChild variant="outline" size="sm">
        <Link href="/reservas">Minhas reservas</Link>
      </Button>

      {/* {user.role === "ADMIN" && (
        <Button asChild variant="outline" size="sm">
          <Link href="/admin">Admin</Link>
        </Button>
      )} */}

      <Button onClick={logout} size="sm">
        Logout
      </Button>
    </>
  );
}

