import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { generateAuctionSlug } from "@/lib/sell/generateAuctionSlug";

/**
 * ⭐ Auto cover image builder
 */
function buildCoverImage(
  imagesPath?: string | null,
  images?: unknown
) {
  if (!imagesPath) return null;
  if (!Array.isArray(images)) return null;

  const files = images as string[];
  if (!files.length) return null;

  const primary =
    files.find((img) => img.startsWith("01-")) ??
    files[0];

  const cleanPath = imagesPath.startsWith("/")
    ? imagesPath
    : `/${imagesPath}`;

  return `${cleanPath}/${primary}`;
}

export async function POST(
  request: Request,
  { params }: { params: { auctionId: string } }
) {
  const auction = await prisma.auction.findUnique({
    where: { id: params.auctionId },
  });

  if (!auction) {
    return NextResponse.json(
      { error: "Auction not found" },
      { status: 404 }
    );
  }

  // =========================
  // READY CHECK
  // =========================
  if (
    !auction.title ||
    !auction.addressLine ||
    !auction.cityStateZip ||
    auction.startingBid == null ||
    auction.bidIncrement == null ||
    !auction.propertyType ||
    !auction.description
  ) {
    return NextResponse.json(
      { error: "Auction not ready to publish" },
      { status: 400 }
    );
  }

  // =========================
  // Generate slug
  // =========================
  const slug = generateAuctionSlug(
    auction.addressLine,
    auction.cityStateZip
  );

  // =========================
  // ⭐ AUTO IMAGE PATH
  // (matches /public/images/auctions/[slug])
  // =========================
  const imagesPath =
    auction.imagesPath ||
    `/images/auctions/${slug}`;

  const coverImage = buildCoverImage(
    imagesPath,
    auction.images
  );

  // =========================
  // Publish
  // =========================
  const startAt = new Date();

  const endAt = new Date();
  endAt.setDate(
    endAt.getDate() + (auction.durationDays || 7)
  );

  const updated = await prisma.auction.update({
    where: { id: auction.id },
    data: {
      slug,
      status: "LIVE",
      startAt,
      endAt,

      imagesPath,
      coverImage, // ⭐ AUTO SET
    },
  });

  return NextResponse.json({
    success: true,
    slug: updated.slug,
  });
}