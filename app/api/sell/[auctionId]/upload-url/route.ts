export const runtime = "nodejs";

import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { generateUploadUrl } from "@vercel/blob/client";

export async function POST(
  request: Request,
  { params }: { params: { auctionId: string } }
) {
  const auction = await prisma.auction.findUnique({
    where: { id: params.auctionId },
  });

  if (!auction) {
    return NextResponse.json(
      { error: "Auction not found" },
      { status: 404 }
    );
  }

  const uploadUrl = await generateUploadUrl({
    access: "public",
  });

  return NextResponse.json({
    uploadUrl,
  });
}