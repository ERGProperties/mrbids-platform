import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    return NextResponse.json(
      { error: "Unauthorized" },
      { status: 401 }
    );
  }

  const body = await req.json();

  const { auctionId, status } = body;

  if (!auctionId || !status) {
    return NextResponse.json(
      { error: "Missing required fields" },
      { status: 400 }
    );
  }

  const auction = await prisma.auction.findUnique({
    where: { id: auctionId },
  });

  if (!auction) {
    return NextResponse.json(
      { error: "Auction not found" },
      { status: 404 }
    );
  }

  await prisma.auction.update({
    where: { id: auctionId },
    data: {
      serviceFeeStatus: status,
      ...(status === "PAID" && {
        serviceFeePaidAt: new Date(),
      }),
    },
  });

  return NextResponse.json({
    success: true,
  });
}