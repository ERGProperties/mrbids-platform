import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { prisma } from "@/lib/db";
import { answerQuestion } from "@/lib/repositories/questionRepository";

export async function POST(req: Request) {

  const session = await getServerSession();

  if (!session?.user?.email) {
    return NextResponse.json(
      { error: "Unauthorized" },
      { status: 401 }
    );
  }

  const { questionId, answer } = await req.json();

  if (!questionId || !answer) {
    return NextResponse.json(
      { error: "Invalid request" },
      { status: 400 }
    );
  }

  const question = await prisma.question.findUnique({
    where: { id: questionId },
    include: {
      auction: true,
    },
  });

  if (!question) {
    return NextResponse.json(
      { error: "Question not found" },
      { status: 404 }
    );
  }

  const user = await prisma.user.findUnique({
    where: {
      email: session.user.email,
    },
  });

  if (!user) {
    return NextResponse.json(
      { error: "User not found" },
      { status: 404 }
    );
  }

  // SECURITY CHECK
  if (question.auction.sellerId !== user.id) {
    return NextResponse.json(
      { error: "Only the seller can answer questions." },
      { status: 403 }
    );
  }

  const updated = await answerQuestion(questionId, answer);

  return NextResponse.json(updated);
}