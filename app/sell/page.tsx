import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";

export default async function SellPage() {
  // Try to find an existing draft first
  const existingDraft = await prisma.auction.findFirst({
    where: {
      status: "DRAFT",
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  // If draft exists → resume it
  if (existingDraft) {
    redirect(`/sell/${existingDraft.id}/step-1`);
  }

  // Otherwise create a new draft
  const auction = await prisma.auction.create({
    data: {
      title: "",
      slug: `draft-${Date.now()}`,
      status: "DRAFT",
    },
  });

  redirect(`/sell/${auction.id}/step-1`);
}