import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(
  request: Request,
  { params }: { params: { auctionId: string } }
) {
  const body = await request.json();

  await prisma.auction.update({
    where: { id: params.auctionId },
    data: {
      images: body.images,
    },
  });

  return NextResponse.json({ success: true });
}
