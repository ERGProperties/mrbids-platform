import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";

export async function POST() {
  // ⭐ Require logged-in user
  const session = await getServerSession(authOptions);

  if (!session?.user?.email) {
    return NextResponse.json(
      { error: "Unauthorized" },
      { status: 401 }
    );
  }

  // ⭐ Find user
  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
  });

  if (!user) {
    return NextResponse.json(
      { error: "User not found" },
      { status: 404 }
    );
  }

  // ⭐ Create auction with sellerId
  const auction = await prisma.auction.create({
    data: {
      status: "DRAFT",
      bidCount: 0,
      sellerId: user.id,
    },
  });

  return NextResponse.json({ id: auction.id });
}