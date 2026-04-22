"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { CheckCheck, Eye, RotateCcw, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { updateContactStatus } from "@/app/[locale]/admin/contacts/actions";

interface ContactActionsProps {
    contactId: string;
    currentStatus: string;
}

export function ContactActions({ contactId, currentStatus }: ContactActionsProps) {
    const router = useRouter();
    const [loadingStatus, setLoadingStatus] = useState<string | null>(null);

    async function handleUpdate(status: "PENDING" | "READ" | "REPLIED") {
        if (currentStatus === status) return;

        setLoadingStatus(status);
        try {
            const result = await updateContactStatus(contactId, status);
            if (result.error) {
                toast.error("Erro ao atualizar contato", { description: result.error });
                return;
            }

            toast.success("Status do contato atualizado");
            router.refresh();
        } catch {
            toast.error("Erro inesperado ao atualizar contato");
        } finally {
            setLoadingStatus(null);
        }
    }

    function isLoading(status: string) {
        return loadingStatus === status;
    }

    return (
        <div className="flex gap-2 justify-end">
            <Button
                size="icon"
                variant="outline"
                className={cn(
                    "h-9 w-9 rounded-2xl border-white/10 bg-white/[0.04] text-white/72 hover:bg-white/[0.08] hover:text-white",
                    isLoading("PENDING") && "opacity-50"
                )}
                onClick={() => handleUpdate("PENDING")}
                disabled={Boolean(loadingStatus)}
                title="Marcar como pendente"
            >
                {isLoading("PENDING") ? <Loader2 className="h-4 w-4 animate-spin" /> : <RotateCcw className="h-4 w-4" />}
            </Button>

            <Button
                size="icon"
                variant="outline"
                className={cn(
                    "h-9 w-9 rounded-2xl border-sky-400/18 bg-sky-500/10 text-sky-200 hover:bg-sky-500/16 hover:text-sky-100",
                    isLoading("READ") && "opacity-50"
                )}
                onClick={() => handleUpdate("READ")}
                disabled={Boolean(loadingStatus)}
                title="Marcar como lido"
            >
                {isLoading("READ") ? <Loader2 className="h-4 w-4 animate-spin" /> : <Eye className="h-4 w-4" />}
            </Button>

            <Button
                size="icon"
                variant="outline"
                className={cn(
                    "h-9 w-9 rounded-2xl border-emerald-400/18 bg-emerald-500/10 text-emerald-200 hover:bg-emerald-500/16 hover:text-emerald-100",
                    isLoading("REPLIED") && "opacity-50"
                )}
                onClick={() => handleUpdate("REPLIED")}
                disabled={Boolean(loadingStatus)}
                title="Marcar como respondido"
            >
                {isLoading("REPLIED") ? <Loader2 className="h-4 w-4 animate-spin" /> : <CheckCheck className="h-4 w-4" />}
            </Button>
        </div>
    );
}
