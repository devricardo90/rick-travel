import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { DomainError } from "@/lib/errors/domain-error";

export async function requireSession() {
    const session = await auth.api.getSession({
        headers: await headers(),
    });

    if (!session) {
        throw new DomainError("Nao autenticado", {
            code: "UNAUTHENTICATED",
            status: 401,
        });
    }

    return session;
}

export async function requireAdminSession() {
    const session = await requireSession();

    if (session.user.role !== "ADMIN") {
        throw new DomainError("Nao autorizado", {
            code: "FORBIDDEN",
            status: 403,
        });
    }

    return session;
}
