import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const {
      fullName,
      email,
      tiktok,
      category,
      inventory,
    } = body;

    // Basic validation
    if (
      !fullName ||
      !email ||
      !category ||
      !inventory
    ) {
      return NextResponse.json(
        {
          error: "Missing required fields",
        },
        {
          status: 400,
        }
      );
    }

    const application = await prisma.sellerApplication.create({
      data: {
        fullName,
        email,
        tiktok,
        category,
        inventory,
      },
    });

    return NextResponse.json({
      success: true,
      application,
    });

  } catch (error) {
    console.error("Seller application error:", error);

    return NextResponse.json(
      {
        error: "Failed to submit application",
      },
      {
        status: 500,
      }
    );
  }
}