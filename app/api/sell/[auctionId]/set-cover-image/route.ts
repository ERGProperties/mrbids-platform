import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(
  req: Request,
  { params }: { params: { auctionId: string } }
) {
  try {
    const { coverImage } = await req.json();

    if (!coverImage) {
      return NextResponse.json(
        { error: "Missing cover image" },
        { status: 400 }
      );
    }

    await prisma.auction.update({
      where: { id: params.auctionId },
      data: {
        coverImage,
      },
    });

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error(err);

    return NextResponse.json(
      { error: "Failed to update cover image" },
      { status: 500 }
    );
  }
}