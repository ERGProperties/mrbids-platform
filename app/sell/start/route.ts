export const dynamic = "force-dynamic";

import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const auction = await prisma.auction.create({
    data: {
      status: "DRAFT",
      bidCount: 0,
    },
  });

  const url = new URL(
    `/sell/${auction.id}/step-1`,
    request.url
  );

  // 🔥 FORCE browser to switch to GET
  return NextResponse.redirect(url, 303);
}
