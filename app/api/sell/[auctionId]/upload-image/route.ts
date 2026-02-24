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
    // Existing images
    // =========================
    const existingImages = Array.isArray(auction.images)
      ? auction.images.filter(
          (img): img is string =>
            typeof img === "string"
        )
      : [];

    // =========================
    // UNIQUE filename
    // =========================
    const ext = getExtension(file.name);
    const fileName = `${Date.now()}-${crypto.randomUUID()}.${ext}`;

    // =========================
    // Upload to Vercel Blob
    // =========================
    const blob = await put(
      `auctions/${auction.slug || params.auctionId}/${fileName}`,
      file,
      {
        access: "public",
        addRandomSuffix: false,
      }
    );

    // =========================
    // Save DB
    // =========================
    const images = [...existingImages, blob.url];

    const coverImage =
      images.length === 1
        ? blob.url
        : auction.coverImage;

    const updated = await prisma.auction.update({
      where: { id: params.auctionId },
      data: {
        imagesPath: "",
        images,
        coverImage,
      },
    });

    // ⭐ DEBUG LOG
    console.log("UPDATED IMAGES:", updated.images);

    // =========================
    // SAFE RESPONSE (production fix)
    // =========================
    const safeImages =
      Array.isArray(updated.images)
        ? updated.images.filter(
            (img): img is string =>
              typeof img === "string"
          )
        : [];

    return NextResponse.json({
      success: true,
      images: safeImages,
    });
  } catch (err) {
    console.error(err);

    return NextResponse.json(
      { error: "Upload failed" },
      { status: 500 }
    );
  }
}