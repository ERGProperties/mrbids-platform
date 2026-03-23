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
  // READY CHECK (Guardrail)
  // =========================
  if (
    !auction.title ||
    !auction.addressLine ||
    !auction.cityStateZip ||
    auction.startingBid == null ||
    auction.bidIncrement == null ||
    !auction.propertyType ||
    !auction.description ||
    !auction.durationDays ||
    auction.durationDays <= 0 || // 🔥 FIX
    !Array.isArray(auction.images) ||
    auction.images.length === 0
  ) {
    return NextResponse.json(
      {
        error:
          "Auction missing required information. Please complete all fields and upload at least one image.",
      },
      { status: 400 }
    );
  }

  // =========================
  // DUPLICATE PROPERTY CHECK
  // =========================
  const existingListing = await prisma.auction.findFirst({
    where: {
      addressLine: auction.addressLine,
      cityStateZip: auction.cityStateZip,
      status: "LIVE",
      id: { not: auction.id },
    },
  });

  if (existingListing) {
    return NextResponse.json(
      {
        error:
          "A live auction already exists for this property.",
      },
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
  // Auto image path
  // =========================
  const imagesPath =
    auction.imagesPath ||
    `/images/auctions/${slug}`;

  const coverImage = buildCoverImage(
    imagesPath,
    auction.images
  );

  // =========================
  // 🔥 FINAL FIX: SAFE DURATION
  // =========================
  const durationDays =
    auction.durationDays && auction.durationDays > 0
      ? auction.durationDays
      : 7;

  const startAt = new Date();

  const endAt = new Date(
    Date.now() + durationDays * 24 * 60 * 60 * 1000
  );

  // =========================
  // Publish auction
  // =========================
  const updated = await prisma.auction.update({
    where: { id: auction.id },
    data: {
      slug,
      status: "LIVE",
      startAt,
      endAt,
      imagesPath,
      coverImage,
    },
  });

  return NextResponse.json({
    success: true,
    slug: updated.slug,
  });
}