"use client";

import { useLocale } from "next-intl";

import { authClient } from "@/lib/auth-client";
import { useRouter } from "@/i18n/routing";

export function AdminLogoutButton() {
    const router = useRouter();
    const locale = useLocale();

    const handleLogout = async () => {
        await authClient.signOut({
            fetchOptions: {
                onSuccess: () => {
                    router.push("/login", { locale });
                    router.refresh();
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
