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

  // ⭐ SAFE JSON → string[] conversion
  const initialImages: string[] = Array.isArray(
    auction.images
  )
    ? (auction.images as string[])
    : [];

  return (
    <Step4Client
      auction={auction}
      initialImages={initialImages}
    />
  );
}