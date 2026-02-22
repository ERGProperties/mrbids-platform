"use server";

import { prisma } from "@/lib/db";

function assert(condition: any, message: string) {
  if (!condition) throw new Error(message);
}

/**
 * ⭐ Auto cover image builder
 */
function buildCoverImage(
  imagesPath: string,
  images: string[]
) {
  if (!images.length) return null;

  const primary =
    images.find((img) => img.startsWith("01-")) ??
    images[0];

  const cleanPath = imagesPath.startsWith("/")
    ? imagesPath
    : `/${imagesPath}`;

  return `${cleanPath}/${primary}`;
}

export async function createAuction(formData: FormData) {
  const title = String(formData.get("title") || "").trim();
  const slug = String(formData.get("slug") || "").trim();
  const addressLine = String(formData.get("addressLine") || "").trim();
  const cityStateZip = String(formData.get("cityStateZip") || "").trim();

  const startingBid = Number(formData.get("startingBid"));
  const bidIncrement = Number(formData.get("bidIncrement"));
  const arv = Number(formData.get("arv") || 0);

  const startAt = new Date(String(formData.get("startAt")));
  const endAt = new Date(String(formData.get("endAt")));

  // 🔒 VALIDATION
  assert(title, "Title is required");
  assert(slug, "Slug is required");
  assert(addressLine, "Address is required");
  assert(cityStateZip, "City/State/ZIP is required");
  assert(startingBid > 0, "Starting bid must be > 0");
  assert(bidIncrement > 0, "Bid increment must be > 0");
  assert(endAt > startAt, "Auction end must be after start");

  /**
   * ⭐ CORRECT IMAGE PATH
   * matches /public/images/auctions/[slug]
   */
  const imagesPath = `/images/auctions/${slug}`;

  /**
   * ⭐ Primary image convention
   */
  const images = ["01-house-front.jpeg"];

  await prisma.auction.create({
    data: {
      title,
      slug,
      addressLine,
      cityStateZip,

      imagesPath,
      images,

      // ⭐ AUTO COVER IMAGE
      coverImage: buildCoverImage(
        imagesPath,
        images
      ),

      startingBid,
      bidIncrement,
      arv,

      startAt,
      endAt,

      status: "LIVE",
      bidCount: 0,
    },
  });
}
