import { getServerSession } from "next-auth";

import { authOptions } from "@/lib/authOptions";

import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {

  try {

    const session =
      await getServerSession(authOptions);

    if (!session?.user?.email) {

      return Response.json(
        {
          error: "Unauthorized",
        },
        {
          status: 401,
        }
      );
    }

const {
  token,
  platform,
} = await req.json();

if (!token) {

  return Response.json(
    {
      error: "Token required",
    },
    {
      status: 400,
    }
  );
}

const pushPlatform =
  platform === "FCM"
    ? "FCM"
    : "WEB";

    const user =
      await prisma.user.findUnique({
        where: {
          email: session.user.email,
        },
      });

    if (!user) {

      return Response.json(
        {
          error: "User not found",
        },
        {
          status: 404,
        }
      );
    }

    await prisma.pushSubscription.upsert({
      where: {
        endpoint: token,
      },

      update: {
        userId: user.id,
        platform: pushPlatform,
      },

      create: {
        userId: user.id,
        endpoint: token,
        platform: pushPlatform,
        p256dh:
          pushPlatform === "WEB"
            ? ""
            : null,
        auth:
          pushPlatform === "WEB"
            ? ""
            : null,
      },
    });

    return Response.json({
      success: true,
    });

  } catch (err) {

    console.error(
      "PUSH REGISTER ERROR:",
      err
    );

    return Response.json(
      {
        error:
          "Failed to register push token",
      },
      {
        status: 500,
      }
    );
  }
}