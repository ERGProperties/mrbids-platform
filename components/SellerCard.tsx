import Link from "next/link";

type Props = {
  seller: {
    username: string | null;
    name: string | null;
    avatarUrl: string | null;
    sellerCategory?: string | null;
    marketplaceAuctions?: {
      id: string;
    }[];
  };
};

export default function SellerCard({
  seller,
}: Props) {
  const liveAuctionCount =
    seller.marketplaceAuctions?.length || 0;

  return (
    <div className="rounded-3xl border bg-gray-50 p-6">

      <p className="text-sm text-gray-500 mb-4">
        Seller
      </p>

      <div className="flex items-center gap-4">

        {seller.avatarUrl ? (
          <img
            src={seller.avatarUrl}
            alt={seller.name || "Seller"}
            className="w-16 h-16 rounded-full object-cover border"
          />
        ) : (
          <div className="w-16 h-16 rounded-full bg-gray-200 flex items-center justify-center font-semibold">
            {(seller.name || "S")
              .charAt(0)
              .toUpperCase()}
          </div>
        )}

        <div className="flex-1">

          <div className="flex items-center gap-2 flex-wrap">

            <h3 className="font-semibold text-lg">
              {seller.name || "Marketplace Seller"}
            </h3>

            {seller.username === "mrbids" && (
              <span className="rounded-full bg-blue-600 px-2 py-1 text-xs font-semibold text-white">
                OFFICIAL
              </span>
            )}

          </div>

          {seller.username && (
            <p className="text-gray-500">
              @{seller.username}
            </p>
          )}

          {seller.sellerCategory && (
            <p className="text-sm text-gray-500 mt-1">
              {seller.sellerCategory}
            </p>
          )}

          <p className="text-sm text-gray-500 mt-2">
            {liveAuctionCount} Live Auction
            {liveAuctionCount === 1 ? "" : "s"}
          </p>

        </div>

      </div>

      {seller.username && (
        <Link
          href={`/seller/${seller.username}`}
          className="mt-6 block w-full rounded-xl bg-black text-white py-3 text-center font-medium hover:opacity-90 transition"
        >
          View Storefront
        </Link>
      )}

    </div>
  );
}