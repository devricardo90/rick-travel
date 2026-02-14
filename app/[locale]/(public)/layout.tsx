import { ReactNode } from "react";
import { HeroHeader } from "@/components/header";

export default function PublicLayout({
    children,
}: {
    children: ReactNode;
}) {
    return (
        <>
            <a
                href="#main-content"
                className="absolute left-4 top-4 z-50 -translate-y-[150%] rounded-md bg-background px-4 py-2 font-medium text-primary shadow-sm transition-transform focus:translate-y-0"
            >
                Pular para o conteúdo principal
            </a>
            <HeroHeader />
            <main id="main-content" className="flex-1">
                {children}
            </main>
        </>
    );
}
