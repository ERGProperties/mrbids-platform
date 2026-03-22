import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { prisma } from "@/lib/db";
import AuctionClient from "./AuctionClient";
import BidHistoryServer from "./BidHistoryServer";
import { getQuestionsForAuction } from "@/lib/repositories/questionRepository";
import AskQuestion from "@/components/auction/AskQuestion";
import AnswerQuestion from "@/components/auction/AnswerQuestion";
import AuctionMessages from "@/components/auction/AuctionMessages";

function formatCurrency(value: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(value);
}

/* 🔥 IMPROVED MOMENTUM (MORE EXCITING) */
function getMomentumText(lastBidAt?: Date | null) {
  if (!lastBidAt) return "Be the first to place a bid";

  const diff = (Date.now() - lastBidAt.getTime()) / 1000 / 60;

  if (diff < 5) return "🔥 Bid placed moments ago";
  if (diff < 60) return "⚡ Bidding active right now";
  if (diff < 1440) return "📈 Active bidding today";

  return "Auction gaining attention";
}

/* 🔥 WATCHING COUNT (SMART FAKE UNTIL SCALE) */
function getWatchingCount(bidCount: number) {
  return Math.max(3, Math.min(8, bidCount + 2));
}

function normalizeImages(images: unknown): string[] {
  if (!Array.isArray(images)) return [];
  return images.filter((img): img is string => typeof img === "string");
}

function buildStructuredData(
  auction: any,
  highestBid: number,
  image: string | null
) {
  return {
    "@context": "https://schema.org",
    "@type": "RealEstateListing",
    name: auction.title,
    description: auction.description,
    image: image ? [image] : [],
    address: {
      "@type": "PostalAddress",
      streetAddress: auction.addressLine,
      addressLocality: auction.cityStateZip,
      addressCountry: "US",
    },
    offers: {
      "@type": "Offer",
      priceCurrency: "USD",
      price: highestBid,
      availability: "https://schema.org/InStock",
    },
  };
}

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Promise<Metadata> {
  const auction = await prisma.auction.findUnique({
    where: { slug: params.slug },
    select: {
      title: true,
      addressLine: true,
      cityStateZip: true,
      description: true,
      coverImage: true,
    },
  });

  if (!auction) {
    return { title: "Auction Not Found | MrBids" };
  }

  const title =
    auction.title ||
    `${auction.addressLine ?? ""} ${auction.cityStateZip ?? ""}`.trim();

  const description =
    auction.description?.slice(0, 160) ||
    "Live real estate auction with transparent bidding and soft-close protection.";

  return {
    title: `${title} | Live Real Estate Auction | MrBids`,
    description,
    openGraph: {
      title: `${title} | MrBids`,
      description,
      images: auction.coverImage ? [auction.coverImage] : [],
    },
    twitter: {
      card: "summary_large_image",
      title: `${title} | MrBids`,
      description,
      images: auction.coverImage ? [auction.coverImage] : [],
    },
  };
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

  const questions = await getQuestionsForAuction(auction.id);

  const hasBids = auction.bidCount > 0;

  const highestBid =
    auction.bids[0]?.amount ??
    auction.finalPrice ??
    auction.startingBid ??
    0;

  const minimumBid = highestBid + (auction.bidIncrement ?? 0);

  const images = normalizeImages(auction.images);
  const image = auction.coverImage || images[0] || null;

  const structuredData = buildStructuredData(
    auction,
    highestBid,
    image
  );

  const latestBid = await prisma.bid.findFirst({
    where: { auctionId: auction.id },
    orderBy: { createdAt: "desc" },
    select: { createdAt: true },
  });

  /* 🔥 NEW WATCHING COUNT */
  const watchingCount = getWatchingCount(auction.bidCount);

  return (
    <main className="bg-gray-50 min-h-screen">

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(structuredData),
        }}
      />

      {/* 🔥 UPGRADED ENERGY BAR */}
      <section className="bg-black text-white border-b border-black">
        <div className="max-w-6xl mx-auto px-6 py-3 flex flex-wrap items-center justify-between gap-4">

          {/* LIVE */}
          <div className="flex items-center gap-2 text-sm font-medium">
            <span className="h-2 w-2 rounded-full bg-green-400 animate-pulse" />
            LIVE AUCTION
          </div>

          {/* 🔥 WATCHING */}
          <div className="text-sm text-orange-400 font-medium">
            🔥 {watchingCount} people watching
          </div>

          {/* ⚡ BIDS */}
          <div className="text-sm text-gray-200">
            ⚡ {auction.bidCount} bids placed
          </div>

          {/* 📈 MOMENTUM */}
          <div className="text-sm text-gray-200">
            {getMomentumText(latestBid?.createdAt)}
          </div>

          {/* 💰 ARV */}
          <div className="text-sm text-gray-200">
            ARV:{" "}
            <span className="text-white font-semibold">
              {auction.arv ? formatCurrency(auction.arv) : "Not provided"}
            </span>
          </div>

        </div>
      </section>

      <AuctionClient
        auction={{
          id: auction.id,
          slug: auction.slug,
          title: auction.title,
          addressLine: auction.addressLine,
          cityStateZip: auction.cityStateZip,
          description: auction.description,
          propertyType: auction.propertyType,
          beds: auction.beds,
          baths: auction.baths,
          sqft: auction.sqft,
          arv: auction.arv,
          images,
          image,
          highestBid,
          bidCount: auction.bidCount,
          endAt: auction.endAt
            ? auction.endAt.toISOString()
            : null,
          bidIncrement: auction.bidIncrement,
          startingBid: auction.startingBid,

          leadingBidderId:
            auction.bids[0]?.bidderId ?? null,

          winnerId: auction.result ?? null,
          status: auction.status,
        }}
        minimumBid={minimumBid}
      />

      {auction.bidCount > 0 && (
        <div className="max-w-6xl mx-auto px-6 pb-10">
          <section className="bg-white rounded-2xl border shadow-sm p-6">
            <h2 className="text-lg font-semibold mb-4">
              Bid History
            </h2>
            <BidHistoryServer auctionId={auction.id} />
          </section>
        </div>
      )}

      <div className="max-w-6xl mx-auto px-6 pb-20">
        <section className="bg-white rounded-2xl border shadow-sm p-6 mt-6">

          <h2 className="text-lg font-semibold mb-4">
            Questions & Answers
          </h2>

          {questions.length === 0 && (
            <p className="text-gray-500 mb-4">
              No questions yet. Be the first to ask!
            </p>
          )}

          {questions.map((q) => (
            <div key={q.id} className="border-b py-3">

              <p className="font-medium">
                Q: {q.question}
              </p>

              {q.answer ? (
                <p className="text-gray-600 mt-1">
                  A: {q.answer}
                </p>
              ) : (
                <AnswerQuestion questionId={q.id} />
              )}

            </div>
          ))}

          <AskQuestion auctionId={auction.id} />

        </section>
      </div>

      {auction.status === "CLOSED" && (
        <div className="max-w-6xl mx-auto px-6 pb-20">
          <section
            id="auction-messages"
            className="bg-white rounded-2xl border shadow-sm p-6 mt-6"
          >
            <AuctionMessages auctionId={auction.id} />
          </section>
        </div>
      )}

    </main>
  );
}