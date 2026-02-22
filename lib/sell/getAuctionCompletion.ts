export function getAuctionCompletion(auction: any) {
  let total = 6;
  let completed = 0;

  if (auction.title) completed++;
  if (auction.addressLine) completed++;
  if (auction.cityStateZip) completed++;
  if (auction.startingBid) completed++;
  if (auction.bidIncrement) completed++;
  if (auction.durationDays) completed++;

  return Math.round((completed / total) * 100);
}
