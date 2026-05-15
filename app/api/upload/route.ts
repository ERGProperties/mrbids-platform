import { NextResponse } from "next/server";

import { v2 as cloudinary } from "cloudinary";

/* CLOUDINARY CONFIG */

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function POST(req: Request) {

  try {

    const formData = await req.formData();

    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json(
        {
          error: "No file uploaded",
        },
        {
          status: 400,
        }
      );
    }

    const bytes = await file.arrayBuffer();

    const buffer = Buffer.from(bytes);

    const uploaded = await new Promise<any>(
      (resolve, reject) => {

        cloudinary.uploader
          .upload_stream(
            {
              folder: "mrbids",
            },
            (error, result) => {

              if (error) {
                reject(error);
              } else {
                resolve(result);
              }

            }
          )
          .end(buffer);

      }
    );

    return NextResponse.json({
      success: true,
      url: uploaded.secure_url,
    });

  } catch (error) {

    console.error("Upload error:", error);

    return NextResponse.json(
      {
        error: "Upload failed",
      },
      {
        status: 500,
      }
    );
  }
}