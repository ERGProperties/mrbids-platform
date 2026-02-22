import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST() {
  const auction = await prisma.auction.create({
    data: {
      status: "DRAFT",
      bidCount: 0,
    },
  });

  return NextResponse.json({ id: auction.id });
}
