export function isAuctionReady(auction: any) {
  return (
    !!auction.title &&
    !!auction.addressLine &&
    !!auction.cityStateZip &&
    !!auction.startingBid &&
    !!auction.bidIncrement &&
    !!auction.durationDays
  );
}
