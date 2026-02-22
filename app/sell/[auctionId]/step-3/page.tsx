export const dynamic = "force-dynamic";

import { prisma } from "@/lib/prisma";
import StepProgress from "@/components/sell/StepProgress";
import PropertyDetailsForm from "./PropertyDetailsForm";

interface Props {
  params: { auctionId: string };
}

export default async function Step3Page({ params }: Props) {
  const auction = await prisma.auction.findUnique({
    where: { id: params.auctionId },
  });

  if (!auction) {
    return <div className="p-6">Auction not found.</div>;
  }

  return (
    <div className="max-w-2xl mx-auto p-8">
      <StepProgress currentStep={3} totalSteps={5} />

      <h1 className="text-2xl font-semibold mb-6">
        Step 3: Property Details
      </h1>

      <PropertyDetailsForm auction={auction} />
    </div>
  );
}
