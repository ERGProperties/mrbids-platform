import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(
  request: Request,
  { params }: { params: { auctionId: string } }
) {
  console.log("🔥 STEP 1 API HIT:", params.auctionId);

  const body = await request.json();
  console.log("🔥 BODY:", body);

  const updated = await prisma.auction.update({
    where: { id: params.auctionId },
    data: {
      title: body.title,
      addressLine: body.addressLine,
      cityStateZip: body.cityStateZip,
    },
  });

  console.log("🔥 UPDATED:", updated.id);

  return NextResponse.json({ success: true });
}
