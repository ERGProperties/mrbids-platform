import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";

export default async function SellPage() {

  // 🔒 Require authentication
  const session = await getServerSession(authOptions);

  if (!session?.user?.email) {
    redirect("/signin?callbackUrl=/sell");
  }

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
  });

  if (!user) {
    redirect("/signin?callbackUrl=/sell");
  }

  // Find existing draft for THIS seller
  const existingDraft = await prisma.auction.findFirst({
    where: {
      sellerId: user.id,
      status: "DRAFT",
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  if (existingDraft) {
    redirect(`/sell/${existingDraft.id}/step-1`);
  }

  // Create new draft
  const auction = await prisma.auction.create({
    data: {
      title: "",
      slug: `draft-${Date.now()}`,
      status: "DRAFT",
      sellerId: user.id,
    },
  });

  redirect(`/sell/${auction.id}/step-1`);
}