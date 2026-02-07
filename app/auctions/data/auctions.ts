export type Auction = {
  slug: string;
  title: string;
  address: string;
  cityState: string;
  endTime: string;
  startingBid: string;
  bidIncrement: string;
  arv: string;
  facts: {
    beds: number;
    baths: number;
    sqft: number;
    lot: string;
    year: number;
  };
  photos: string[];
};

export const auctions: Auction[] = [
  {
    slug: "2210-mckenzie-ave-waco",
    title: "2210 McKenzie Ave",
    address: "2210 McKenzie Ave",
    cityState: "Waco, TX 76708",
    endTime: "2026-02-15T17:00:00-06:00",
    startingBid: "$100,000",
    bidIncrement: "$5,000",
    arv: "$230,000",
    facts: {
      beds: 3,
      baths: 2,
      sqft: 1606,
      lot: "0.19 Acres",
      year: 1926,
    },
    photos: [
      "01-curbside.jpg",
      "02-front.jpg",
      "03-family-room.jpg",
      "04-dining-room.jpg",
      "05-kitchen.jpg",
      "06-kitchen-2.jpg",
      "07-bathroom.jpg",
      "08-master-bedroom.jpg",
      "09-bedroom-2.jpg",
      "10-bedroom-office.jpg",
      "11-half-bath.jpg",
      "12-left-side.jpg",
      "13-right-side.jpg",
      "14-back-room.jpg",
      "15-rear.jpg",
    ],
  },
];
