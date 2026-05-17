import { redirect } from "next/navigation";

import { prisma } from "@/lib/prisma";

import { getServerSession } from "next-auth";

import { authOptions } from "@/lib/authOptions";

export default async function SellPage() {

  // REQUIRE AUTH
  const session =
    await getServerSession(
      authOptions
    );

  if (!session?.user?.email) {
    redirect(
      "/signin?callbackUrl=/sell"
    );
  }

  // FIND USER
  const user =
    await prisma.user.findUnique({
      where: {
        email:
          session.user.email,
      },
    });

  if (!user) {
    redirect(
      "/signin?callbackUrl=/sell"
    );
  }

  // FIND EXISTING DRAFT
  const existingDraft =
    await prisma.auction.findFirst({
      where: {
        sellerId:
          user.id,

        status:
          "DRAFT",
      },

      orderBy: {
        createdAt:
          "desc",
      },
    });

  // REDIRECT TO EXISTING DRAFT
  if (existingDraft) {
    redirect(
      `/sell/${existingDraft.id}/step-1`
    );
  }

  // CREATE NEW DRAFT
  const auction =
    await prisma.auction.create({
      data: {
        title: "",

        slug:
          `draft-${Date.now()}`,

        status:
          "DRAFT",

        sellerId:
          user.id,
      },
    });

  // REDIRECT TO NEW DRAFT
  redirect(
    `/sell/${auction.id}/step-1`
  );
}