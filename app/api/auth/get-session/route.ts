

import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

export async function GET() {
  // 🔑 headers() É async
  const headersList = await headers();

  const session = await auth.api.getSession({
    headers: headersList,
  });

  return NextResponse.json({ session });
}

