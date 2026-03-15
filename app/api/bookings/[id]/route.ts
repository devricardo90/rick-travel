import { NextResponse } from "next/server";
import { requireSession } from "@/lib/authz";
import { isDomainError } from "@/lib/errors/domain-error";
import { cancelBookingForUser } from "@/lib/services/booking.service";

export async function PATCH(
  _req: Request,
  ctx: { params: Promise<{ id: string }> }
) {
  try {
    const session = await requireSession();
    const { id } = await ctx.params;
    const updated = await cancelBookingForUser(session.user.id, id);
    return NextResponse.json(updated);
  } catch (error) {
    if (isDomainError(error)) {
      return NextResponse.json({ error: error.message }, { status: error.status });
    }

    console.error(error);
    return NextResponse.json({ error: "Erro ao cancelar booking" }, { status: 500 });
  }
}
