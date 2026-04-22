import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  const deep = req.nextUrl.searchParams.get("deep") === "1";

  if (!deep) {
    return NextResponse.json({
      ok: true,
      service: "rick-travel",
      checks: {
        app: "ok",
      },
    });
  }

  try {
    await prisma.$queryRaw`SELECT 1`;

    return NextResponse.json({
      ok: true,
      service: "rick-travel",
      checks: {
        app: "ok",
        database: "ok",
      },
    });
  } catch {
    return NextResponse.json(
      {
        ok: false,
        service: "rick-travel",
        checks: {
          app: "ok",
          database: "error",
        },
      },
      { status: 503 }
    );
  }
}
