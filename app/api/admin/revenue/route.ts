import { prisma } from "@/lib/db";
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";

export async function GET() {
  const session = await getServerSession(authOptions);

  if (!session?.user || session.user.role !== "ADMIN") {
    return NextResponse.json(
      { error: "Unauthorized" },
      { status: 403 }
    );
  }

  const paidAuctions = await prisma.auction.findMany({
    where: {
      serviceFeeStatus: "PAID",
      serviceFeeAmount: { not: null },
    },
    select: {
      serviceFeeAmount: true,
    },
  });

  const pendingAuctions = await prisma.auction.count({
    where: {
      serviceFeeStatus: "PENDING",
    },
  });

  const paidCount = paidAuctions.length;

  const totalRevenue = paidAuctions.reduce(
    (sum, a) => sum + (a.serviceFeeAmount || 0),
    0
  );

  return NextResponse.json({
    totalRevenue,
    paidCount,
    pendingCount: pendingAuctions,
  });
}