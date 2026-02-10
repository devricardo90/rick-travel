
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

export async function GET() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    return NextResponse.json([], { status: 200 });
  }

  const bookings = await prisma.booking.findMany({
    where: {
      userId: session.user.id,
      status: { in: ["PENDING", "CONFIRMED"] },
    },
    select: { tripId: true },
  });

  return NextResponse.json(bookings.map((b) => b.tripId));
}
