import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";

import { prisma } from "@/lib/prisma";
import { authOptions } from "@/lib/authOptions";

export async function POST(req: Request) {

  try {

    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return NextResponse.json(
        {
          error: "Unauthorized",
        },
        {
          status: 401,
        }
      );
    }

    const body = await req.json();

    const {
      sellerCategory,
      tiktokUsername,
      sellerBio,
    } = body;

    const user = await prisma.user.findUnique({
      where: {
        email: session.user.email,
      },
    });

    if (!user) {
      return NextResponse.json(
        {
          error: "User not found",
        },
        {
          status: 404,
        }
      );
    }

    const updatedUser = await prisma.user.update({
      where: {
        id: user.id,
      },
      data: {
        isMarketplaceSeller: true,
        sellerCategory,
        tiktokUsername,
        sellerBio,
      },
    });

    return NextResponse.json({
      success: true,
      user: updatedUser,
    });

  } catch (error) {

    console.error(
      "Seller onboarding error:",
      error
    );

    return NextResponse.json(
      {
        error: "Failed to complete onboarding",
      },
      {
        status: 500,
      }
    );
  }
}