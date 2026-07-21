export const MARKETPLACE_CATEGORIES = {
  Jewelry: [
    "Rings",
    "Necklaces",
    "Bracelets",
    "Earrings",
    "Watches",
    "Loose Gemstones",
    "Vintage Jewelry",
    "Designer Jewelry",
    "Other",
  ],

  Electronics: [
    "Phones",
    "Tablets",
    "Laptops",
    "Desktop Computers",
    "Gaming Consoles",
    "Video Games",
    "Cameras",
    "Drones",
    "Audio",
    "Smart Home",
    "Wearables",
    "Other",
  ],

  Sneakers: [
    "Nike",
    "Jordan",
    "Adidas",
    "New Balance",
    "Yeezy",
    "Puma",
    "Reebok",
    "Converse",
    "Other",
  ],

  Collectibles: [
    "Sports Cards",
    "Pokémon",
    "Trading Card Games",
    "Comics",
    "Memorabilia",
    "Coins",
    "Currency",
    "Action Figures",
    "Funko Pop!",
    "Toys",
    "Movie Collectibles",
    "Music Collectibles",
    "Autographs",
    "Vintage Collectibles",
    "Other",
  ],

  "Luxury Items": [
    "Luxury Watches",
    "Handbags",
    "Designer Fashion",
    "Designer Shoes",
    "Accessories",
    "Fine Pens",
    "Other",
  ],

  "Storage Finds": [
    "Mystery Boxes",
    "Estate Finds",
    "Storage Unit Finds",
    "Garage Sale Finds",
    "Pallets",
    "Liquidation Lots",
    "Other",
  ],

  Other: [],
} as const;

export type MarketplaceCategory =
  keyof typeof MARKETPLACE_CATEGORIES;

export function getSubcategories(
  category: MarketplaceCategory
) {
  return MARKETPLACE_CATEGORIES[category] ?? [];
}