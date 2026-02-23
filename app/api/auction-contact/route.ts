import { prisma } from "@/lib/db";
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

  const { auctionId, message } = body;

  if (!auctionId || !message) {
    return NextResponse.json(
      { error: "Missing required fields" },
      { status: 400 }
    );
  }

  // OPTIONAL: verify auction exists
  const auction = await prisma.auction.findUnique({
    where: { id: auctionId },
  });

  if (!auction) {
    return NextResponse.json(
      { error: "Auction not found" },
      { status: 404 }
    );
  }

  // For now just acknowledge request
  // (later you can add email/notification logic)
  return NextResponse.json({
    success: true,
  });
}