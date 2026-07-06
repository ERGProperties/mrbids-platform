import { NextResponse } from "next/server";

import { getServerSession } from "next-auth";

import { authOptions } from "@/lib/authOptions";

import { prisma } from "@/lib/prisma";

export async function DELETE() {

  try {

    const session =
      await getServerSession(authOptions);

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

    const user =
      await prisma.user.findUnique({
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

    await prisma.notificationLog.deleteMany({
      where: {
        userId: user.id,
      },
    });

    await prisma.bid.deleteMany({
      where: {
        userId: user.id,
      },
    });

    await prisma.session.deleteMany({
      where: {
        userId: user.id,
      },
    });

    await prisma.account.deleteMany({
      where: {
        userId: user.id,
      },
    });

    await prisma.user.delete({
      where: {
        id: user.id,
      },
    });

    return NextResponse.json({
      success: true,
    });

  } catch (err) {

    console.error(
      "DELETE ACCOUNT ERROR:",
      err
    );

    return NextResponse.json(
      {
        error: "Server error",
      },
      {
        status: 500,
      }
    );
  }
}