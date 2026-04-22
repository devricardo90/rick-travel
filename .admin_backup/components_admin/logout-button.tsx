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
        <button
            onClick={handleLogout}
            className="rounded-full border border-white/10 bg-white/[0.04] px-4 py-2 text-sm font-medium text-white/72 transition-colors hover:bg-white/[0.08] hover:text-white"
        >
            Sair
        </button>
    );
}
