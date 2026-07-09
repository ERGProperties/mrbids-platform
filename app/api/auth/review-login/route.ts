import { NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";

import { encode } from "next-auth/jwt";

export async function POST(request: Request) {

  const { email } =
    await request.json();

  if (
    email !== "apple-review@mrbids.com"
  ) {

    return NextResponse.json(
      {
        error: "Invalid review account.",
      },
      {
        status: 401,
      }
    );
  }

  let user =
    await prisma.user.findUnique({

      where: {
        email,
      },

    });

  if (!user) {

    user =
      await prisma.user.create({

        data: {

          email,

          name:
            "Apple Review",

          emailVerified:
            new Date(),

        },

      });
  }

  const token =
    await encode({

      token: {

        sub: user.id,

        email:
          user.email,

      },

      secret:
        process.env.NEXTAUTH_SECRET!,

    });

  const response =
    NextResponse.json({

      success: true,

    });

  response.cookies.set({

    name:
      "next-auth.session-token",

    value:
      token,

    httpOnly: true,

    secure:
      process.env.NODE_ENV === "production",

    sameSite:
      "lax",

    path:
      "/",

  });

  return response;
}