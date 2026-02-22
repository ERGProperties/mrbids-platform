import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

function getExtension(name: string) {
  return name.split(".").pop() || "jpg";
}

export async function POST(
  request: Request,
  { params }: { params: { auctionId: string } }
) {
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
  // Build slug folder
  // =========================
  const slug =
    auction.slug || params.auctionId;

  const imagesPath = `/images/auctions/${slug}`;

  const uploadDir = path.join(
    process.cwd(),
    "public",
    "images",
    "auctions",
    slug
  );

  if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
  }

  // =========================
  // Numbered filename
  // =========================
  const existingImages = Array.isArray(
    auction.images
  )
    ? (auction.images as string[])
    : [];

  const nextNumber = existingImages.length + 1;
  const ext = getExtension(file.name);

  const fileName = `${String(nextNumber).padStart(
    2,
    "0"
  )}-image.${ext}`;

  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);

  fs.writeFileSync(
    path.join(uploadDir, fileName),
    buffer
  );

  // =========================
  // Save DB (FILENAMES ONLY)
  // =========================
  const images = [...existingImages, fileName];

  const coverImage =
    images.length === 1
      ? `${imagesPath}/${fileName}`
      : auction.coverImage;

  await prisma.auction.update({
    where: { id: params.auctionId },
    data: {
      imagesPath,
      images,
      coverImage,
    },
  });

  return NextResponse.json({ success: true });
}