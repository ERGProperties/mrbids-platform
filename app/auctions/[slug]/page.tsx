import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { prisma } from "@/lib/db";
import AuctionClient from "./AuctionClient";
import BidHistoryServer from "./BidHistoryServer";
import { getQuestionsForAuction } from "@/lib/repositories/questionRepository";
import AskQuestion from "@/components/auction/AskQuestion";
import AnswerQuestion from "@/components/auction/AnswerQuestion";
import AuctionMessages from "@/components/auction/AuctionMessages";

const SITE_URL = "https://mrbids.com";

function formatCurrency(value: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(value);
}

function getMomentumText(lastBidAt?: Date | null) {
  if (!lastBidAt) return "Be the first to place a bid";

  const diff = (Date.now() - lastBidAt.getTime()) / 1000 / 60;

  if (diff < 5) return "🔥 Bid placed moments ago";
  if (diff < 60) return "⚡ Bidding active right now";
  if (diff < 1440) return "📈 Active bidding today";

  return "Auction gaining attention";
}

function getWatchingCount(bidCount: number) {
  return Math.max(3, Math.min(8, bidCount + 2));
}

function normalizeImages(images: unknown): string[] {
  if (!Array.isArray(images)) return [];

  return images.filter(
    (img): img is string => typeof img === "string"
  );
}

function getAbsoluteUrl(path: string | null | undefined) {
  if (!path) return null;

  try {
    return new URL(path, SITE_URL).toString();
  } catch {
    return null;
  }
}

function buildStructuredData(
  auction: any,
  highestBid: number,
  image: string | null
) {
  const auctionUrl = `${SITE_URL}/auctions/${auction.slug}`;

  const isLive = auction.status === "LIVE";

  return {
    "@context": "https://schema.org",
    "@type": "RealEstateListing",
    name: auction.title,
    description:
      auction.description ||
      "Real estate auction on MrBids.",
    url: auctionUrl,
    image: image ? [image] : [],
    address: {
      "@type": "PostalAddress",
      streetAddress: auction.addressLine,
      addressLocality: auction.cityStateZip,
      addressCountry: "US",
    },
    offers: {
      "@type": "Offer",
      url: auctionUrl,
      priceCurrency: "USD",
      price: highestBid,
      availability: isLive
        ? "https://schema.org/InStock"
        : "https://schema.org/OutOfStock",
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
      startingBid: true,
      status: true,
    },
  });

  if (!auction) {
    return {
      title: "Auction Not Found | MrBids",
      robots: {
        index: false,
        follow: false,
      },
    };
  }

  const title =
    auction.title ||
    `${auction.addressLine ?? ""} ${auction.cityStateZip ?? ""}`.trim();

  const location = [
    auction.addressLine,
    auction.cityStateZip,
  ]
    .filter(Boolean)
    .join(", ");

  const startingBid =
    auction.startingBid != null
      ? formatCurrency(auction.startingBid)
      : null;

  const baseDescription =
    auction.description?.replace(/\s+/g, " ").trim() ||
    "Live real estate auction with transparent bidding and soft-close protection.";

  const auctionDescription = [
    baseDescription,
    location ? `Located at ${location}.` : "",
    startingBid
      ? `Starting bid: ${startingBid}.`
      : "",
  ]
    .filter(Boolean)
    .join(" ");

  const description =
    auctionDescription.length > 160
      ? `${auctionDescription.slice(0, 157).trimEnd()}...`
      : auctionDescription;

  const canonicalUrl =
    `${SITE_URL}/auctions/${params.slug}`;

  const imageUrl =
    getAbsoluteUrl(auction.coverImage);

  const pageTitle =
    `${title} | Live Real Estate Auction | MrBids`;

  return {
    title: pageTitle,
    description,

    alternates: {
      canonical: canonicalUrl,
    },

    robots: {
      index: true,
      follow: true,
    },

    openGraph: {
      type: "website",
      url: canonicalUrl,
      siteName: "MrBids",
      title: pageTitle,
      description,
      ...(imageUrl
        ? {
            images: [
              {
                url: imageUrl,
                alt: `${title} - MrBids real estate auction`,
              },
            ],
          }
        : {}),
    },

    twitter: {
      card: "summary_large_image",
      title: pageTitle,
      description,
      ...(imageUrl
        ? {
            images: [imageUrl],
          }
        : {}),
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
      seller: true,
      winner: true,
      bids: {
        orderBy: { amount: "desc" },
        take: 1,
      },
    },
  });

  if (!auction) notFound();

  const questions = await getQuestionsForAuction(
    auction.id
  );

  const highestBid =
    auction.bids[0]?.amount ??
    auction.finalPrice ??
    auction.startingBid ??
    0;

  const minimumBid =
    highestBid + (auction.bidIncrement ?? 0);

  const images = normalizeImages(auction.images);

  const image =
    auction.coverImage ||
    images[0] ||
    null;

  const absoluteImage =
    getAbsoluteUrl(image);

  const structuredData =
    buildStructuredData(
      auction,
      highestBid,
      absoluteImage
    );

  const latestBid =
    await prisma.bid.findFirst({
      where: {
        auctionId: auction.id,
      },
      orderBy: {
        createdAt: "desc",
      },
      select: {
        createdAt: true,
      },
    });

  const watchingCount =
    getWatchingCount(
      auction.bidCount
    );

  return (
    <main className="bg-gray-50 min-h-screen">

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(
            structuredData
          ).replace(/</g, "\\u003c"),
        }}
      />

      {/* TOP BAR */}
      <section className="bg-black text-white border-b border-black">
        <div className="max-w-6xl mx-auto px-6 py-3 flex flex-wrap items-center justify-between gap-4">

          <div className="flex items-center gap-2 text-sm font-medium">
            <span className="h-2 w-2 rounded-full bg-green-400 animate-pulse" />
            LIVE AUCTION
          </div>

          <div className="text-sm text-orange-400 font-medium">
            🔥 {watchingCount} people watching
          </div>

          <div className="text-sm text-gray-200">
            ⚡ {auction.bidCount} bids placed
          </div>

          <div className="text-sm text-gray-200">
            {getMomentumText(
              latestBid?.createdAt
            )}
          </div>

          <div className="text-sm text-gray-200">
            ARV:{" "}
            <span className="text-white font-semibold">
              {auction.arv
                ? formatCurrency(
                    auction.arv
                  )
                : "Not provided"}
            </span>
          </div>

        </div>
      </section>

      {/* MAIN AUCTION */}
      <AuctionClient
        auction={{
          id: auction.id,
          slug: auction.slug,
          title: auction.title,
          addressLine: auction.addressLine,
          cityStateZip:
            auction.cityStateZip,
          description:
            auction.description,
          propertyType:
            auction.propertyType,
          beds: auction.beds,
          baths: auction.baths,
          sqft: auction.sqft,
          yearBuilt:
            auction.yearBuilt,
          arv: auction.arv,
          images,
          image,
          highestBid,
          bidCount:
            auction.bidCount,
          endAt:
            auction.endAt
              ? auction.endAt.toISOString()
              : null,
          bidIncrement:
            auction.bidIncrement,
          startingBid:
            auction.startingBid,
          leadingBidderId:
            auction.bids[0]
              ?.bidderId ?? null,
          winnerId:
            auction.winnerId,
          sellerId:
            auction.sellerId,
          status:
            auction.status,
          seller:
            auction.seller,
          winner:
            auction.winner,
        }}
        minimumBid={minimumBid}
      />

      {/* BID HISTORY */}
      {auction.bidCount > 0 && (
        <div className="max-w-6xl mx-auto px-6 pb-10">
          <section className="bg-white rounded-2xl border shadow-sm p-6">

            <h2 className="text-lg font-semibold mb-4">
              Bid History
            </h2>

            <BidHistoryServer
              auctionId={auction.id}
            />

          </section>
        </div>
      )}

      {/* Q&A */}
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
            <div
              key={q.id}
              className="border-b py-3"
            >
              <p className="font-medium">
                Q: {q.question}
              </p>

              {q.answer ? (
                <p className="text-gray-600 mt-1">
                  A: {q.answer}
                </p>
              ) : (
                <AnswerQuestion
                  questionId={q.id}
                />
              )}
            </div>
          ))}

          <AskQuestion
            auctionId={auction.id}
          />

        </section>
      </div>

      {/* MESSAGES */}
      {auction.status === "CLOSED" && (
        <div className="max-w-6xl mx-auto px-6 pb-20">
          <section
            id="auction-messages"
            className="bg-white rounded-2xl border shadow-sm p-6 mt-6"
          >
            <AuctionMessages
              auctionId={auction.id}
            />
          </section>
        </div>
      )}

    </main>
  );
}