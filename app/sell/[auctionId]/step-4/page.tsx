export const dynamic = "force-dynamic";
export const revalidate = 0;

import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import Step4Client from "./Step4Client";

interface Props {
  params: {
    auctionId: string;
  };
}

export default async function Step4Page({ params }: Props) {
  const auction = await prisma.auction.findUnique({
    where: { id: params.auctionId },
  });

  if (!auction) {
    return notFound();
  }

  // ⭐ SAFE IMAGE ARRAY
  const initialImages: string[] = Array.isArray(auction.images)
    ? auction.images.filter(
        (img): img is string => typeof img === "string"
      )
    : [];

  // ⭐ SERIALIZABLE SAFE OBJECT (IMPORTANT)
  const safeAuction = {
    id: auction.id,
    coverImage: auction.coverImage ?? null,
  };

  return (
    <Step4Client
      auction={safeAuction}
      initialImages={initialImages}
    />
  );
}