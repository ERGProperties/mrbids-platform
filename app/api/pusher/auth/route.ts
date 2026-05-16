import { NextResponse } from "next/server";

import { getServerSession } from "next-auth";

import { authOptions } from "@/lib/authOptions";

import { pusherServer } from "@/lib/pusher";

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
      await req.formData();

    const socketId =
      body.get("socket_id");

    const channel =
      body.get("channel_name");

    const authResponse =
      pusherServer.authorizeChannel(
        socketId as string,
        channel as string,
        {
          user_id:
            session.user.email,
        }
      );

    return NextResponse.json(
      authResponse
    );

  } catch (error) {

    console.error(error);

    return NextResponse.json(
      {
        error:
          "Something went wrong",
      },
      {
        status: 500,
      }
    );

  }
}