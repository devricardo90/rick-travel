import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { tripSchema } from "@/lib/schemas";
import { updateTripRecord } from "@/lib/services/trip.service";
import { z } from "zod";

export async function PUT(
    req: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    const session = await auth.api.getSession({
        headers: await headers(),
    });

    if (!session || session.user.role !== "ADMIN") {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;

    try {
        const body = await req.json();
        const validated = tripSchema.parse(body);
        const updated = await updateTripRecord(id, validated);

        return NextResponse.json(updated);
    } catch (error) {
        if (error instanceof z.ZodError) {
            return NextResponse.json(
                { error: error.issues[0]?.message ?? "Dados invalidos" },
                { status: 400 }
            );
        }

        console.error("Error updating trip:", error);
        return NextResponse.json(
            { error: "Failed to update trip" },
            { status: 500 }
        );
    }
}
