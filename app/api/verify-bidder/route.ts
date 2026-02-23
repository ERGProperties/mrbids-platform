import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    return NextResponse.json(
      { error: "Unauthorized" },
      { status: 401 }
    );
  }

  const body = await req.json();
  const { verified } = body;

  if (typeof verified !== "boolean") {
    return NextResponse.json(
      { error: "Invalid verification value" },
      { status: 400 }
    );
  }

  await prisma.user.update({
    where: { id: session.user.id },
    data: {
      isVerifiedBidder: verified,
    },
  });

  return NextResponse.json({
    success: true,
    isVerifiedBidder: verified,
  });
}