export const runtime = "nodejs";

import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(
  request: Request,
  { params }: { params: { auctionId: string } }
) {
  try {
    const { url } = await request.json();

    if (!url) {
      return NextResponse.json(
        { error: "Missing URL" },
        { status: 400 }
      );
    }

    const auction = await prisma.auction.findUnique({
      where: { id: params.auctionId },
    });

    if (!auction) {
      return NextResponse.json(
        { error: "Auction not found" },
        { status: 404 }
      );
    }

    const existingImages = Array.isArray(auction.images)
      ? auction.images.filter(
          (img): img is string =>
            typeof img === "string"
        )
      : [];

    const images = [...existingImages, url];

    const updated = await prisma.auction.update({
      where: { id: params.auctionId },
      data: {
        images,
        coverImage:
          existingImages.length === 0
            ? url
            : auction.coverImage,
      },
    });

    return NextResponse.json({
      success: true,
      images: updated.images,
    });
  } catch (err) {
    console.error(err);

    return NextResponse.json(
      { error: "Upload failed" },
      { status: 500 }
    );
  }
}