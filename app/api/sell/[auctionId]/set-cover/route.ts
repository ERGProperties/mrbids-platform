import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(
  request: Request,
  { params }: { params: { auctionId: string } }
) {
  const body = await request.json();

  if (!body.image) {
    return NextResponse.json(
      { error: "No image provided" },
      { status: 400 }
    );
  }

  await prisma.auction.update({
    where: { id: params.auctionId },
    data: {
      coverImage: body.image,
    },
  });

  return NextResponse.json({ success: true });
}
