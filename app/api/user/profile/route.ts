import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return Response.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const { name, bio, avatarUrl } = await req.json();

    // 🚨 Basic validation
    if (!name || !bio) {
      return Response.json(
        { error: "Name and bio are required" },
        { status: 400 }
      );
    }

    await prisma.user.update({
      where: { email: session.user.email },
      data: {
        name,
        bio,
        avatarUrl,
      },
    });

    return Response.json({
      success: true,
    });

  } catch (err) {
    console.error("PROFILE UPDATE ERROR:", err);

    return Response.json(
      { error: "Failed to update profile" },
      { status: 500 }
    );
  }
}