"use client";

import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import { deleteTrip } from "@/app/[locale]/admin/trips/actions";
import { useRouter } from "next/navigation";
import { useTransition } from "react";

interface DeleteTripButtonProps {
    tripId: string;
}

export function DeleteTripButton({ tripId }: DeleteTripButtonProps) {
    const router = useRouter();
    const [isPending, startTransition] = useTransition();

    const handleDelete = async () => {
        if (!confirm("Are you sure you want to delete this trip? This action cannot be undone.")) {
            return;
        }

        startTransition(async () => {
            const result = await deleteTrip(tripId);
            if (result.error) {
                alert("Error deleting trip: " + result.error);
            } else {
                router.refresh();
            }
        });
    };

    return (
        <Button
            variant="destructive"
            size="sm"
            onClick={handleDelete}
            disabled={isPending}
        >
            <Trash2 className="w-4 h-4 mr-1" />
            {isPending ? "Excluindo..." : "Excluir"}
        </Button>
    );
}
