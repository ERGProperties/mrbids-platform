import { AuctionConfig } from "@/lib/auctionTypes";

export const auction1604Parkdale: AuctionConfig = {
  slug: "1604-parkdale-dr-wichita-falls",
  title: "1604 Parkdale Dr",
  addressLine: "1604 Parkdale Dr",
  cityStateZip: "Wichita Falls, TX",

  auctionEnd: "2026-02-21T17:00:00-06:00",
  startingBid: 50000,
  bidIncrement: 2500,
  arv: 195000,

  imagesPath: "/auctions/1604-parkdale-dr-wichita-falls",
  images: [
    "01-house-front.jpeg",
    "02-dining-room.jpeg",
    "03-foyer.jpeg",
    "04-family-room.jpeg",
    "05-kitchen.jpeg",
    "06-hallway.jpeg",
    "07-bedroom-1.jpeg",
    "08-bedroom-2.jpeg",
    "09-bedroom-3.jpeg",
    "10-bedroom-4.jpeg",
    "11-bathroom-1.jpeg",
    "12-bathroom-2.jpeg",
    "13-laundry-room.jpeg",
    "14-back-patio.jpeg",
    "15-house-back.jpeg",
  ],

  description: [
    "1604 Parkdale Dr is a single-family residential property located in Wichita Falls, Texas.",
    "The property is offered through a seller-direct auction on MrBids.",
    "The seller has provided an estimated after-repair value (ARV) of $195,000 for reference only.",
    "The property is being sold as-is and the seller retains full discretion over bid acceptance.",
  ],

  propertyFacts: [
    "Property Type: Single-Family",
    "Bedrooms: 4",
    "Bathrooms: 2",
    "Occupancy: Vacant",
  ],

  auctionTerms: [
    "Property sold as-is",
    "Minimum bid increments of $2,500",
    "Seller retains bid acceptance control",
    "Buyer approval required prior to bidding",
  ],
};
