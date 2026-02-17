"use server";

import { prisma } from "@/lib/db";

function assert(condition: any, message: string) {
  if (!condition) throw new Error(message);
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

  // ✅ AUTO-GENERATED (NO ADMIN INPUT)
  const imagesPath = `/auctions/${slug}`;

  // ✅ Primary image convention
  const primaryImage = "01-house-front.jpeg";

  await prisma.auction.create({
    data: {
      title,
      slug,
      addressLine,
      cityStateZip,

      imagesPath,
      images: [primaryImage],

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
