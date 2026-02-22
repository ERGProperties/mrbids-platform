import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(
  request: Request,
  { params }: { params: { auctionId: string } }
) {
  try {
    const body = await request.json();

    await prisma.auction.update({
      where: { id: params.auctionId },
      data: {
        startingBid:
          body.startingBid === "" ||
          body.startingBid == null
            ? null
            : Number(body.startingBid),

        bidIncrement:
          body.bidIncrement === "" ||
          body.bidIncrement == null
            ? null
            : Number(body.bidIncrement),

        reserveAmount:
          body.reserveAmount === "" ||
          body.reserveAmount == null
            ? null
            : Number(body.reserveAmount),

        arv:
          body.arv === "" || body.arv == null
            ? null
            : Number(body.arv),

        durationDays:
          body.durationDays == null
            ? 7
            : Number(body.durationDays),
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Step 2 save failed:", error);

    return NextResponse.json(
      { error: "Failed to save Step 2 data" },
      { status: 500 }
    );
  }
}
