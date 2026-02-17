import { prisma } from "@/lib/db"
import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/authOptions"

export async function POST(req: Request) {
  const session = await getServerSession(authOptions)

  if (!session) {
    return NextResponse.json(
      { error: "Unauthorized" },
      { status: 401 }
    )
  }

  const { auctionId, escrowStatus } = await req.json()

  if (!["RECEIVED", "FAILED"].includes(escrowStatus)) {
    return NextResponse.json(
      { error: "Invalid escrow status" },
      { status: 400 }
    )
  }

  await prisma.auction.update({
    where: { id: auctionId },
    data: {
      escrowStatus,
    },
  })

  return NextResponse.json({ success: true })
}
