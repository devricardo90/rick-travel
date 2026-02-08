
"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { authClient } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";

type SessionResponse =
  | { user?: { name?: string | null; email?: string | null } }
  | null;

export function AuthStatus() {
  const [session, setSession] = useState<SessionResponse>(null);

  async function refresh() {
    const res = await fetch("/api/auth/get-session", { credentials: "include" });
    if (!res.ok) {
      setSession(null);
      return;
    }
    const data = await res.json();
    setSession(data ?? null);
  }

  useEffect(() => {
    refresh();
  }, []);

  async function logout() {
    await authClient.signOut();
    await refresh();
    window.location.href = "/";
  }

  const user = session?.user;

  if (!user) {
    return (
      <div className="flex items-center gap-2">
        <Button asChild variant="outline">
          <Link href="/login">Login</Link>
        </Button>
        <Button asChild>
          <Link href="/register">Sign up</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-3">
      <span className="hidden sm:inline text-sm text-muted-foreground">
        Logado: {user.name || user.email}
      </span>
      <Button variant="outline" onClick={logout}>
        Sair
      </Button>
    </div>
  );
}

