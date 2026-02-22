import { notFound, redirect } from "next/navigation";
import { prisma } from "@/lib/db";
import AuctionClient from "./AuctionClient";
import BidHistoryServer from "./BidHistoryServer";

function buildImageUrl(imagesPath: string | null, file: string) {
  if (!imagesPath) return null;
  if (!imagesPath.startsWith("/")) {
    return `/${imagesPath}/${file}`;
  }
  return `${imagesPath}/${file}`;
}

function getPrimaryImage(images: unknown, imagesPath: string | null): string | null {
  if (!Array.isArray(images) || images.length === 0) return null;

  const files = images as string[];
  const primary = files.find((f) => f.startsWith("01-")) ?? files[0];

  return buildImageUrl(imagesPath, primary);
}

function formatCurrency(value: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(value);
}

function getMomentumText(lastBidAt?: Date | null) {
  if (!lastBidAt) return "No bids yet — opening opportunity";

  const diff = (Date.now() - lastBidAt.getTime()) / 1000 / 60;

  if (diff < 5) return "Momentum: bid placed moments ago";
  if (diff < 60) return "Momentum: bid placed within the hour";
  if (diff < 1440) return "Momentum: bidding active today";

  return "Momentum: bidding activity started";
}

export default async function AuctionPage({
  params,
}: {
  params: { slug: string };
}) {
  const auction = await prisma.auction.findUnique({
    where: { slug: params.slug },
    include: {
      bids: {
        orderBy: { amount: "desc" },
        take: 1,
      },
    },
  });

  if (!auction) notFound();

  const now = new Date();

  if (auction.endAt && now > auction.endAt) {
    redirect(`/auctions/${auction.slug}/result`);
  }

  const highestBid =
    auction.bids[0]?.amount ??
    auction.finalPrice ??
    auction.startingBid ??
    0;

  const minimumBid = highestBid + (auction.bidIncrement ?? 0);

  const image = getPrimaryImage(auction.images, auction.imagesPath);

  const latestBid = await prisma.bid.findFirst({
    where: { auctionId: auction.id },
    orderBy: { createdAt: "desc" },
    select: { createdAt: true },
  });

  return (
    <main className="bg-gray-50 min-h-screen">

      {/* AUTHORITY STRIP */}
      <section className="border-b border-gray-200 bg-white">
        <div className="max-w-6xl mx-auto px-6 py-4 flex flex-wrap gap-4 text-sm text-gray-700">
          <div className="flex items-center gap-2">
            <span className="text-green-600">✔</span>
            Verified Seller
          </div>
          <div className="flex items-center gap-2">
            <span className="text-green-600">✔</span>
            Admin Reviewed Listing
          </div>
          <div className="flex items-center gap-2">
            <span className="text-green-600">✔</span>
            Transparent Bid History
          </div>
        </div>
      </section>

      {/* ENERGY BAR */}
      <section className="bg-black text-white border-b border-black">
        <div className="max-w-6xl mx-auto px-6 py-3 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-sm font-medium">
            <span className="h-2 w-2 rounded-full bg-green-400 animate-pulse" />
            LIVE AUCTION
          </div>

          <div className="text-sm text-gray-200">
            {auction.bidCount > 0 ? (
              <>
                <span className="text-white font-semibold">
                  {auction.bidCount}
                </span>{" "}
                bids placed
              </>
            ) : (
              "No bids yet — be the first to bid"
            )}
          </div>

          <div className="text-sm text-gray-200">
            {getMomentumText(latestBid?.createdAt)}
          </div>

          <div className="text-sm text-gray-200">
            Current Highest Bid:{" "}
            <span className="text-white font-semibold">
              {formatCurrency(highestBid)}
            </span>
          </div>
        </div>
      </section>

      {/* ⭐ PROCESS CONFIDENCE LAYER (NEW) */}
      <section className="bg-white border-b border-gray-200">
        <div className="max-w-6xl mx-auto px-6 py-5 grid md:grid-cols-3 gap-4 text-sm text-gray-700">
          <div>① Highest bid wins (seller approval)</div>
          <div>② Buyer & seller proceed to escrow</div>
          <div>③ Closing handled off-platform</div>
        </div>
      </section>

      {/* AUCTION CONTENT */}
      <AuctionClient
        auction={{
          id: auction.id,
          slug: auction.slug,
          title: auction.title,
          addressLine: auction.addressLine,
          cityStateZip: auction.cityStateZip,
          startingBid: auction.startingBid,
          bidIncrement: auction.bidIncrement,
          highestBid,
          arv: auction.arv,
          endsAt: auction.endAt?.toISOString(),
          image,
          imagesPath: auction.imagesPath || "",
          images: auction.images || [],
          propertyType: auction.propertyType,
          beds: auction.beds,
          baths: auction.baths,
          sqft: auction.sqft,
          description: auction.description,
          leadingBidderId: auction.bids[0]?.bidderId ?? null,
        }}
        minimumBid={minimumBid}
      />

      {auction.bidCount > 0 && (
        <div className="max-w-6xl mx-auto px-6 pb-20">
          <section className="bg-white rounded-2xl border shadow-sm p-6">
            <h2 className="text-lg font-semibold mb-4">
              Bid History
            </h2>
            <BidHistoryServer auctionId={auction.id} />
          </section>
        </div>
      )}
    </main>
  );
}