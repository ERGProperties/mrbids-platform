import { NextResponse } from "next/server";

import { getServerSession } from "next-auth";

import { authOptions } from "@/lib/authOptions";

import { prisma } from "@/lib/prisma";

export async function GET() {

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

    const watchlist =
      await prisma.watchlist.findMany({
        where: {
          userId:
            user.id,
        },

        include: {
          auction: true,
        },

        orderBy: {
          createdAt:
            "desc",
        },
      });

    return NextResponse.json(
      watchlist
    );

  } catch (error) {

    console.error(
      "[WATCHLIST_GET]",
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

export async function POST(
  req: Request
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

    const body =
      await req.json();

    const {
      auctionId,
    } = body;

    if (!auctionId) {

      return NextResponse.json(
        {
          error:
            "Auction ID is required",
        },
        {
          status: 400,
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

    const existing =
      await prisma.watchlist.findUnique({
        where: {
          userId_auctionId: {
            userId:
              user.id,

            auctionId,
          },
        },
      });

    if (existing) {

      return NextResponse.json(
        {
          error:
            "Already saved",
        },
        {
          status: 400,
        }
      );

    }

    const watchlistItem =
      await prisma.watchlist.create({
        data: {
          userId:
            user.id,

          auctionId,
        },
      });

    return NextResponse.json(
      watchlistItem
    );

  } catch (error) {

    console.error(
      "[WATCHLIST_POST]",
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