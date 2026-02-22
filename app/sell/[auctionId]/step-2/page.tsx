import { prisma } from "@/lib/prisma";
import StepProgress from "@/components/sell/StepProgress";
import Step2Form from "./Step2Form";

interface Props {
  params: { auctionId: string };
}

export default async function Step2Page({ params }: Props) {
  const auction = await prisma.auction.findUnique({
    where: { id: params.auctionId },
  });

  if (!auction) {
    return <div className="p-6">Auction not found.</div>;
  }

  return (
    <div className="max-w-2xl mx-auto p-8">
      <StepProgress currentStep={2} totalSteps={5} />

      <div className="mb-6 rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-700">
        <p className="font-medium">✔ Your draft is saved automatically</p>
      </div>

      <h1 className="text-2xl font-semibold mb-6">
        Step 2: Auction Settings
      </h1>

      <Step2Form auction={auction} />
    </div>
  );
}
