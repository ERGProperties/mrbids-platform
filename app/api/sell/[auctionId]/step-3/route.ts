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
        propertyType:
          body.propertyType?.trim() || null,

        beds:
          body.beds === "" || body.beds == null
            ? null
            : Number(body.beds),

        baths:
          body.baths === "" || body.baths == null
            ? null
            : Number(body.baths),

        sqft:
          body.sqft === "" || body.sqft == null
            ? null
            : Number(body.sqft),

        condition:
          body.condition?.trim() || null,

        description:
          body.description?.trim() || null,
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Step 3 save failed:", error);

    return NextResponse.json(
      { error: "Failed to save Step 3 data" },
      { status: 500 }
    );
  }
}
