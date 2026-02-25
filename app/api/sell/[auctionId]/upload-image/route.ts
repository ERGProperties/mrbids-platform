export const runtime = "nodejs";

import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  secure: true,
});

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

    const uploadResult: any = await new Promise(
      (resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          {
            folder: "mrbids",
            public_id: `${params.auctionId}-${Date.now()}`,
            format: "jpg",
          },
          (error, result) => {
            if (error) reject(error);
            else resolve(result);
          }
        );

        stream.end(buffer);
      }
    );

    const url = uploadResult.secure_url;

    const updated = await prisma.$transaction(async (tx) => {
      const auction = await tx.auction.findUnique({
        where: { id: params.auctionId },
      });

      if (!auction) throw new Error("Auction not found");

      const existingImages = Array.isArray(auction.images)
        ? auction.images.filter(
            (img): img is string => typeof img === "string"
          )
        : [];

      const images = [...existingImages, url];

      return tx.auction.update({
        where: { id: params.auctionId },
        data: {
          images,
          coverImage:
            existingImages.length === 0
              ? url
              : auction.coverImage,
        },
      });
    });

    // ⭐ RETURN IMAGES AGAIN (important)
    return NextResponse.json({
      success: true,
      images: updated.images,
    });
  } catch (err: any) {
    console.error("UPLOAD ERROR:", err);

    return NextResponse.json(
      { error: err?.message || "Upload failed" },
      { status: 500 }
    );
  }
}