export function getAuctionReadiness(auction: any) {
  const missing: string[] = [];

  if (!auction.title) missing.push("Title");
  if (!auction.addressLine) missing.push("Address");
  if (!auction.startingBid) missing.push("Starting Bid");
  if (!auction.bidIncrement) missing.push("Bid Increment");

  if (!auction.propertyType) missing.push("Property Details");
  if (!auction.description) missing.push("Description");

  if (!auction.images || auction.images.length === 0) {
    missing.push("Images");
  }

  const total = 7;
  const completed = total - missing.length;
  const percent = Math.round((completed / total) * 100);

  return {
    percent,
    missing,
    ready: missing.length === 0,
  };
}
