import { prisma } from "@/lib/prisma";
import Step1Form from "./Step1Form";
import StepProgress from "@/components/sell/StepProgress";

interface Props {
  params: {
    auctionId: string;
  };
}

export default async function Step1Page({ params }: Props) {
  const auction = await prisma.auction.findUnique({
    where: { id: params.auctionId },
  });

  if (!auction) {
    return <div className="p-6">Auction not found.</div>;
  }

  return (
    <section className="w-full relative">

      {/* Inner container */}
      <div className="w-full p-8">

        {/* Progress */}
        <div className="relative z-0">
          <StepProgress currentStep={1} totalSteps={5} />
        </div>

        {/* Confidence Layer */}
        <div className="mb-6 rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-700">
          <p className="font-medium">✔ Your draft is saved automatically</p>
          <p className="text-gray-600 mt-1">
            You can leave anytime and continue later.
          </p>
        </div>

        {/* Header */}
        <h1 className="text-2xl font-semibold mb-6">
          Step 1: Property Basics
        </h1>

        {/* Form */}
        <div className="relative z-0">
          <Step1Form auction={auction} />
        </div>

      </div>

    </section>
  );
}