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

    // ⭐ CRITICAL FIX: atomic update
    const updated = await prisma.auction.update({
      where: { id: params.auctionId },
      data: {
        images: {
          push: url,
        },
        coverImage: {
          set: undefined,
        },
      },
    });

    return NextResponse.json({
      success: true,
      images: updated.images,
    });
  } catch (err: any) {
    return NextResponse.json(
      { error: err?.message || "Upload failed" },
      { status: 500 }
    );
  }
}