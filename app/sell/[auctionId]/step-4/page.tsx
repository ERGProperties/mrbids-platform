import { prisma } from "@/lib/prisma";
import StepProgress from "@/components/sell/StepProgress";
import ImageUpload from "./ImageUpload";
import CoverImageGrid from "./CoverImageGrid";
import Link from "next/link";

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

  // ⭐ FIX — build full image URLs
  const images =
    Array.isArray(auction.images) &&
    auction.imagesPath
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

      <ImageUpload auction={auction} />

      {images.length > 0 && (
        <div className="mt-8">
          <h2 className="text-sm font-medium text-gray-700 mb-3">
            Uploaded Images (click to set cover)
          </h2>

          <CoverImageGrid
            auctionId={auction.id}
            images={images}
            coverImage={auction.coverImage}
          />
        </div>
      )}

      <div className="mt-10">
        <Link
          href={`/sell/${auction.id}/step-5`}
          className="inline-block px-6 py-3 bg-black text-white rounded-lg text-sm font-medium hover:bg-gray-900 transition"
        >
          Continue →
        </Link>
      </div>
    </div>
  );
}