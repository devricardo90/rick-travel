import { NextResponse } from "next/server";
import { requireSession } from "@/lib/authz";
import { isDomainError } from "@/lib/errors/domain-error";
import { createBookingForUser, listBookingsForUser } from "@/lib/services/booking.service";

export async function GET() {
  try {
    const session = await requireSession();
    const bookings = await listBookingsForUser(session.user.id);
    return NextResponse.json(bookings);
  } catch (error) {
    if (isDomainError(error)) {
      return NextResponse.json({ error: error.message }, { status: error.status });
    }

    console.error(error);
    return NextResponse.json({ error: "Erro ao carregar bookings" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const session = await requireSession();
    const body = await req.json();
    const created = await createBookingForUser(session.user.id, body);
    return NextResponse.json(created, { status: 201 });
  } catch (error) {
    if (isDomainError(error)) {
      return NextResponse.json({ error: error.message }, { status: error.status });
    }

    console.error(error);
    return NextResponse.json({ error: "Erro ao criar booking" }, { status: 500 });
  }
}
