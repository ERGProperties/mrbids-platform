import { prisma } from "@/lib/prisma";
import StepProgress from "@/components/sell/StepProgress";
import PublishButton from "./PublishButton";
import Link from "next/link";

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

      {/* Progress */}
      <StepProgress currentStep={5} totalSteps={5} />

      {/* Completion Pull Header */}
      <h1 className="text-2xl font-semibold mb-2">
        Finalize Your Listing
      </h1>

      <p className="text-sm text-gray-600 mb-6">
        Review your details below and publish when ready.
        Your auction will go live immediately.
      </p>

      {/* Summary Card */}
      <div className="rounded-xl border border-gray-200 bg-white p-6 space-y-3 mb-8 text-sm text-gray-700">

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

      {/* Navigation */}
      <div className="flex justify-between items-center">

        <Link
          href={`/sell/${auction.id}/step-4`}
          className="px-5 py-3 border rounded-lg text-sm font-medium hover:bg-gray-100 transition"
        >
          ← Back
        </Link>

        <PublishButton auctionId={auction.id} />

      </div>

    </div>
  );
}