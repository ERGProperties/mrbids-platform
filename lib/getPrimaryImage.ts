export function getPrimaryImage(auction: any) {
  if (
    typeof auction?.coverImage === "string" &&
    auction.coverImage.startsWith("http")
  ) {
    return auction.coverImage;
  }

  if (!Array.isArray(auction?.images)) return null;

  const first = auction.images.find(
    (img: unknown) =>
      typeof img === "string" &&
      img.startsWith("http")
  );

  return first || null;
}