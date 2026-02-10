"use client";

import { authClient } from "@/lib/auth-client";
import { useRouter } from "next/navigation";

export function AdminLogoutButton() {
    const router = useRouter();

    const handleLogout = async () => {
        await authClient.signOut({
            fetchOptions: {
                onSuccess: () => {
                    router.push("/login"); // Redireciona para login após sair
                    router.refresh(); // Limpa cache do roteador
                },
            },
        });
    };

    return (
        <button onClick={handleLogout} className="text-red-500 hover:underline">
            Sair
        </button>
    );
}
