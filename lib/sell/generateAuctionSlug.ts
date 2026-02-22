export function generateAuctionSlug(
  addressLine: string,
  cityStateZip: string
) {
  const base = `${addressLine} ${cityStateZip}`
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-");

  return base;
}
