import { NextResponse } from "next/server";

import { getServerSession } from "next-auth";

import { authOptions } from "@/lib/authOptions";

import { prisma } from "@/lib/prisma";

export async function DELETE(
  req: Request,

  {
    params,
  }: {
    params: {
      auctionId: string;
    };
  }
) {

  try {

    const session =
      await getServerSession(
        authOptions
      );

    if (!session?.user?.email) {

      return NextResponse.json(
        {
          error:
            "Unauthorized",
        },
        {
          status: 401,
        }
      );

    }

    const user =
      await prisma.user.findUnique({
        where: {
          email:
            session.user.email,
        },
      });

    if (!user) {

      return NextResponse.json(
        {
          error:
            "User not found",
        },
        {
          status: 404,
        }
      );

    }

    await prisma.watchlist.deleteMany({
      where: {
        userId:
          user.id,

        auctionId:
          params.auctionId,
      },
    });

    return NextResponse.json({
      success: true,
    });

  } catch (error) {

    console.error(
      "[WATCHLIST_DELETE]",
      error
    );

    return NextResponse.json(
      {
        error:
          "Internal server error",
      },
      {
        status: 500,
      }
    );

  }

}