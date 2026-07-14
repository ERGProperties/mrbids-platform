import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import { prisma } from "@/lib/prisma";
import {
  normalizeUsername,
  validateUsername,
} from "@/lib/usernames";

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return Response.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const {
      username,
      name,
      sellerBio,
      sellerCategory,
      avatarUrl,
    } = await req.json();

    // Basic validation
    if (
      !username ||
      !name ||
      !sellerBio ||
      !sellerCategory
    ) {
      return Response.json(
        {
          error:
            "Username, name, seller bio and seller category are required.",
        },
        { status: 400 }
      );
    }

    const normalizedUsername =
      normalizeUsername(username);

    const validation =
      validateUsername(normalizedUsername);

    if (!validation.valid) {
      return Response.json(
        { error: validation.message },
        { status: 400 }
      );
    }

    const existing =
      await prisma.user.findUnique({
        where: {
          username: normalizedUsername,
        },
      });

    if (
      existing &&
      existing.email !== session.user.email
    ) {
      return Response.json(
        {
          error:
            "That username is already taken.",
        },
        { status: 400 }
      );
    }

    await prisma.user.update({
      where: {
        email: session.user.email,
      },
      data: {
        username: normalizedUsername,
        name,
        sellerBio,
        sellerCategory,
        avatarUrl,
      },
    });

    return Response.json({
      success: true,
    });

  } catch (err) {
    console.error(
      "PROFILE UPDATE ERROR:",
      err
    );

    return Response.json(
      {
        error:
          "Failed to update profile",
      },
      { status: 500 }
    );
  }
}