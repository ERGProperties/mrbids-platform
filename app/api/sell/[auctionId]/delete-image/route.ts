import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(
  req: Request,
  { params }: { params: { auctionId: string } }
) {
  try {
    const { image } = await req.json();

    const auction = await prisma.auction.findUnique({
      where: { id: params.auctionId },
    });

    if (!auction) {
      return NextResponse.json(
        { error: "Auction not found" },
        { status: 404 }
      );
    }

    const images = Array.isArray(auction.images)
      ? (auction.images as string[])
      : [];

    const updatedImages = images.filter(
      (img) => img !== image
    );

    // if deleted image was cover → clear it
    const newCover =
      auction.coverImage === image
        ? null
        : auction.coverImage;

    await prisma.auction.update({
      where: { id: params.auctionId },
      data: {
        images: updatedImages,
        coverImage: newCover,
      },
    });

    return NextResponse.json({
      success: true,
      images: updatedImages,
      coverImage: newCover,
    });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: "Delete failed" },
      { status: 500 }
    );
  }
}