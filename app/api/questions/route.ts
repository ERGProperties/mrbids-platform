import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/authOptions";
import { prisma } from "@/lib/db";
import { createQuestion } from "@/lib/repositories/questionRepository";
import { sendQuestionNotification } from "@/lib/email/sendQuestionNotification";

export async function POST(req: Request) {

  const session = await getServerSession(authOptions);

  if (!session?.user?.email) {
    return NextResponse.json(
      { error: "You must be signed in to ask a question." },
      { status: 401 }
    );
  }

  const { auctionId, question } = await req.json();

  if (!auctionId || !question) {
    return NextResponse.json(
      { error: "Invalid request" },
      { status: 400 }
    );
  }

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
  });

  if (!user) {
    return NextResponse.json(
      { error: "User not found." },
      { status: 404 }
    );
  }

  const auction = await prisma.auction.findUnique({
    where: { id: auctionId },
    include: { seller: true },
  });

  if (!auction) {
    return NextResponse.json(
      { error: "Auction not found." },
      { status: 404 }
    );
  }

  const newQuestion = await createQuestion(
    auctionId,
    user.id,
    question
  );

  if (auction.seller?.email) {

    const auctionUrl = `${process.env.NEXTAUTH_URL}/auctions/${auction.slug}`;

    await sendQuestionNotification({
      sellerEmail: auction.seller.email,
      auctionTitle: auction.title ?? "Your Auction",
      question,
      auctionUrl,
    });

  }

  return NextResponse.json(newQuestion);
}