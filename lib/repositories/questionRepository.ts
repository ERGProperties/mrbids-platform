import { prisma } from "@/lib/db";

export async function getQuestionsForAuction(auctionId: string) {
  return prisma.question.findMany({
    where: { auctionId },
    include: {
      user: {
        select: {
          name: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });
}

export async function createQuestion(
  auctionId: string,
  userId: string,
  question: string
) {
  return prisma.question.create({
    data: {
      auctionId,
      userId,
      question,
    },
  });
}

export async function answerQuestion(
  questionId: string,
  answer: string
) {
  return prisma.question.update({
    where: { id: questionId },
    data: {
      answer,
      answeredAt: new Date(),
    },
  });
}