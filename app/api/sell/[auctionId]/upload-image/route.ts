export const runtime = "nodejs";

import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { put } from "@vercel/blob";

function getExtension(name: string) {
  return name.split(".").pop() || "jpg";
}

export async function POST(
  request: Request,
  { params }: { params: { auctionId: string } }
) {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json(
        { error: "No file uploaded" },
        { status: 400 }
      );
    }

    // =========================
    // Load auction
    // =========================
    const auction = await prisma.auction.findUnique({
      where: { id: params.auctionId },
    });

    if (!auction) {
      return NextResponse.json(
        { error: "Auction not found" },
        { status: 404 }
      );
    }

    // =========================
    // Numbered filename
    // =========================
    const existingImages = Array.isArray(auction.images)
      ? (auction.images as string[])
      : [];

    const nextNumber = existingImages.length + 1;
    const ext = getExtension(file.name);

    const fileName = `${String(nextNumber).padStart(
      2,
      "0"
    )}-image.${ext}`;

    // =========================
    // Upload to Vercel Blob
    // =========================
    const blob = await put(
      `auctions/${auction.slug || params.auctionId}/${fileName}`,
      file,
      {
        access: "public",
      }
    );

    // =========================
    // Save DB (FULL URL)
    // =========================
    const images = [...existingImages, blob.url];

    const coverImage =
      images.length === 1
        ? blob.url
        : auction.coverImage;

    await prisma.auction.update({
      where: { id: params.auctionId },
      data: {
        imagesPath: "", // legacy field safe to keep
        images,
        coverImage,
      },
    });

    return NextResponse.json({
      success: true,
      images,
    });
  } catch (err) {
    console.error(err);

    return NextResponse.json(
      { error: "Upload failed" },
      { status: 500 }
    );
  }
}