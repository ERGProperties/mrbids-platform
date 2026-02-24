import { prisma } from "@/lib/prisma";
import StepProgress from "@/components/sell/StepProgress";
import Step4Client from "./Step4Client";

export const dynamic = "force-dynamic";

interface Props {
  params: { auctionId: string };
}

export default async function Step4Page({ params }: Props) {
  const auction = await prisma.auction.findUnique({
    where: { id: params.auctionId },
  });

  if (!auction) {
    return <div className="p-6">Auction not found.</div>;
  }

  const images =
    Array.isArray(auction.images) && auction.imagesPath
      ? (auction.images as string[]).map(
          (img) => `${auction.imagesPath}/${img}`
        )
      : [];

  return (
    <div className="max-w-3xl mx-auto p-8">
      <StepProgress currentStep={4} totalSteps={5} />

      <h1 className="text-2xl font-semibold mb-6">
        Step 4: Upload Images
      </h1>

      <Step4Client
        auction={auction}
        initialImages={images}
      />
    </div>
  );
}