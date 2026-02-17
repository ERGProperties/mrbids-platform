import { NextResponse } from "next/server"
import { closeExpiredAuctions } from "@/lib/auctions/closeExpiredAuctions"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/authOptions"

export async function POST() {
  const session = await getServerSession(authOptions)

  if (!session) {
    return NextResponse.json(
      { error: "Unauthorized" },
      { status: 401 }
    )
  }

  const closedCount = await closeExpiredAuctions()

  return NextResponse.json({ closedCount })
}
