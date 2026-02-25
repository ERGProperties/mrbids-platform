export const runtime = "nodejs";

import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { writeFile, mkdir } from "fs/promises";
import path from "path";

export async function POST(
  request: Request,
  { params }: { params: { auctionId: string } }
) {
  try {
    const formData = await request.formData();
    const file = formData.get("file");

    if (!file || !(file instanceof File)) {
      return NextResponse.json(
        { error: "Missing file" },
        { status: 400 }
      );
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const uploadDir = path.join(
      process.cwd(),
      "public",
      "uploads"
    );

    await mkdir(uploadDir, { recursive: true });

    // ⭐ SAFE UNIQUE NAME (NEW)
    const safeName = `${params.auctionId}-${Date.now()}-${file.name.replace(/\s+/g, "-")}`;

    const filePath = path.join(uploadDir, safeName);
    await writeFile(filePath, buffer);

    const url = `/uploads/${safeName}`;

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