import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getAuctionMessages } from "@/lib/repositories/messageRepository";

export async function GET(
  req: Request,
  { params }: { params: { auctionId: string } }
) {

  const messages = await getAuctionMessages(params.auctionId);

  return NextResponse.json(messages);
}