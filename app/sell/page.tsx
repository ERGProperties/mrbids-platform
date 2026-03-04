import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";

export default async function SellPage() {
  const session = await getServerSession(authOptions);

  // Not logged in → NextAuth signin
  if (!session?.user?.id) {
    redirect("/api/auth/signin?callbackUrl=/sell");
  }

  const userId = session.user.id;

  const existingDraft = await prisma.auction.findFirst({
    where: {
      status: "DRAFT",
      sellerId: userId,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  if (existingDraft) {
    redirect(`/sell/${existingDraft.id}/step-1`);
  }

  const auction = await prisma.auction.create({
    data: {
      title: "",
      slug: null,
      status: "DRAFT",
      sellerId: userId,
    },
  });

  redirect(`/sell/${auction.id}/step-1`);
}