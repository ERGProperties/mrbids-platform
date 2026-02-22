import { prisma } from "@/lib/prisma";
import StepProgress from "@/components/sell/StepProgress";
import PublishButton from "./PublishButton";

export const dynamic = "force-dynamic";

interface Props {
  params: { auctionId: string };
}

export default async function Step5Page({
  params,
}: Props) {
  const auction = await prisma.auction.findUnique({
    where: { id: params.auctionId },
  });

  if (!auction) {
    return <div className="p-6">Auction not found.</div>;
  }

  return (
    <div className="max-w-2xl mx-auto p-8">
      <StepProgress currentStep={5} totalSteps={5} />

      <h1 className="text-2xl font-semibold mb-6">
        Step 5: Publish Auction
      </h1>

      <div className="space-y-3 mb-8 text-sm text-gray-700">
        <p>
          <strong>Title:</strong>{" "}
          {auction.title || "Missing"}
        </p>
        <p>
          <strong>Address:</strong>{" "}
          {auction.addressLine || "Missing"}
        </p>
        <p>
          <strong>Starting Bid:</strong>{" "}
          {auction.startingBid ?? "Missing"}
        </p>
        <p>
          <strong>Bid Increment:</strong>{" "}
          {auction.bidIncrement ?? "Missing"}
        </p>
      </div>

      <PublishButton auctionId={auction.id} />
    </div>
  );
}
