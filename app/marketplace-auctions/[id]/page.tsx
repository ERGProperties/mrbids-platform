import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import AuctionClient from "./AuctionClient";

const SITE_URL = "https://mrbids.com";

function formatCurrency(value: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 2,
  }).format(value);
}

function normalizeImages(images: unknown): string[] {
  if (!Array.isArray(images)) return [];

  return images.filter(
    (img): img is string => typeof img === "string"
  );
}

function getAbsoluteUrl(
  path: string | null | undefined
) {
  if (!path) return null;

  try {
    return new URL(path, SITE_URL).toString();
  } catch {
    return null;
  }
}

function buildStructuredData(
  auction: any,
  image: string | null
) {
  const auctionUrl =
    `${SITE_URL}/marketplace-auctions/${auction.id}`;

  const currentPrice =
    auction.currentBid ??
    auction.startingBid ??
    0;

  const isLive =
    auction.status === "LIVE";

  return {
    "@context": "https://schema.org",
    "@type": "Product",
    name: auction.title,
    description:
      auction.description ||
      "Marketplace auction on MrBids.",
    url: auctionUrl,
    image: image ? [image] : [],
    category: auction.category || undefined,
    offers: {
      "@type": "Offer",
      url: auctionUrl,
      priceCurrency: "USD",
      price: currentPrice,
      availability: isLive
        ? "https://schema.org/InStock"
        : "https://schema.org/OutOfStock",
    },
  };
}

export async function generateMetadata({
  params,
}: {
  params: {
    id: string;
  };
}): Promise<Metadata> {
  const auction =
    await prisma.marketplaceAuction.findUnique({
      where: {
        id: params.id,
      },
      select: {
        id: true,
        title: true,
        description: true,
        category: true,
        subcategory: true,
        coverImage: true,
        images: true,
        startingBid: true,
        currentBid: true,
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

  /*
   * Draft auctions should not appear in search engines.
   */
  if (auction.status === "DRAFT") {
    return {
      title: `${auction.title || "Marketplace Auction"} | MrBids`,
      robots: {
        index: false,
        follow: false,
      },
    };
  }

  const title =
    auction.title ||
    "Marketplace Auction";

  const locationText = [
    auction.category,
    auction.subcategory,
  ]
    .filter(Boolean)
    .join(" • ");

  const currentBid =
    auction.currentBid ??
    auction.startingBid ??
    null;

  const bidText =
    currentBid != null
      ? `Current bid: ${formatCurrency(
          currentBid
        )}.`
      : "";

  const baseDescription =
    auction.description
      ?.replace(/\s+/g, " ")
      .trim() ||
    "Shop live marketplace auctions on MrBids with transparent bidding and secure online auctions.";

  const auctionDescription = [
    baseDescription,
    locationText,
    bidText,
  ]
    .filter(Boolean)
    .join(" ");

  const description =
    auctionDescription.length > 160
      ? `${auctionDescription
          .slice(0, 157)
          .trimEnd()}...`
      : auctionDescription;

  const canonicalUrl =
    `${SITE_URL}/marketplace-auctions/${auction.id}`;

  const images = normalizeImages(
    auction.images
  );

  const imageUrl =
    getAbsoluteUrl(
      auction.coverImage ||
        images[0] ||
        null
    );

  const pageTitle =
    `${title} | Live Marketplace Auction | MrBids`;

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
                alt: `${title} - MrBids marketplace auction`,
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

export default async function MarketplaceAuctionPage({
  params,
}: {
  params: {
    id: string;
  };
}) {
  const session =
    await getServerSession(
      authOptions
    );

  const auction =
    await prisma.marketplaceAuction.findUnique({
      where: {
        id: params.id,
      },

      include: {
        seller: {
          include: {
            marketplaceAuctions: {
              where: {
                status: "LIVE",
              },
              select: {
                id: true,
              },
            },
          },
        },

        winner: true,

        bids: {
          include: {
            bidder: true,
          },
          orderBy: {
            createdAt: "desc",
          },
          take: 10,
        },
      },
    });

  if (!auction) {
    notFound();
  }

  const images =
    normalizeImages(
      auction.images
    );

  const image =
    auction.coverImage ||
    images[0] ||
    null;

  const absoluteImage =
    getAbsoluteUrl(image);

  const structuredData =
    buildStructuredData(
      auction,
      absoluteImage
    );

  return (
    <main className="min-h-screen bg-white">

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(
            structuredData
          ).replace(/</g, "\\u003c"),
        }}
      />

      <section className="max-w-7xl mx-auto px-6 pt-24 pb-24">

        <AuctionClient
          initialAuction={auction}
          isSeller={
            session?.user?.email ===
            auction.seller.email
          }
        />

      </section>

    </main>
  );
}