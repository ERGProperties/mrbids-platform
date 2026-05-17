import Link from "next/link";

export default function MarketplaceAuctionCard({
  auction,
}: {
  auction: any;
}) {

  const savings =
    auction.retailPrice
      ? Math.max(
          auction.retailPrice -
            auction.currentBid,
          0
        )
      : 0;

  return (
    <Link
      href={`/marketplace-auctions/${auction.id}`}
      className="group border rounded-3xl overflow-hidden hover:shadow-xl transition bg-white flex flex-col"
    >

      {/* IMAGE */}
      <div className="aspect-[4/5] md:aspect-square bg-gray-100 overflow-hidden relative">

        {auction.coverImage ? (

          <img
            src={auction.coverImage}
            alt={auction.title}
            className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
          />

        ) : (

          <div className="w-full h-full bg-gray-100" />

        )}

        {/* STATUS BADGE */}
        <div className="absolute top-4 right-4">

          {auction.status === "LIVE" && (

            <span className="px-3 py-1 rounded-full bg-red-500 text-white text-xs font-semibold animate-pulse">
              LIVE
            </span>

          )}

          {auction.status === "SCHEDULED" && (

            <span className="px-3 py-1 rounded-full bg-yellow-500 text-white text-xs font-semibold">
              SCHEDULED
            </span>

          )}

          {auction.status === "ENDED" && (

            <span className="px-3 py-1 rounded-full bg-gray-700 text-white text-xs font-semibold">
              ENDED
            </span>

          )}

        </div>

      </div>

      {/* CONTENT */}
      <div className="p-5 md:p-6 flex flex-col flex-1">

        {/* CATEGORY */}
        <div className="mb-4">

          <span className="px-3 py-1 rounded-full bg-black text-white text-xs font-medium">
            {auction.category}
          </span>

        </div>

        {/* TITLE */}
        <h2 className="text-xl md:text-2xl font-semibold leading-snug min-h-[72px]">
          {auction.title}
        </h2>

        {/* SELLER */}
        <div className="mt-5 flex items-center gap-3">

          {auction.seller?.avatarUrl ? (

            <img
              src={
                auction.seller.avatarUrl
              }
              alt={
                auction.seller.name ||
                "Seller"
              }
              className="w-10 h-10 rounded-full object-cover border"
            />

          ) : (

            <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-sm font-semibold text-gray-500">
              {auction.seller?.name?.charAt(0) ||
                "M"}
            </div>

          )}

          <div>

            <p className="font-medium text-sm md:text-base">
              {auction.seller?.name ||
                "Marketplace Seller"}
            </p>

            {auction.seller
              ?.tiktokUsername && (

              <p className="text-xs md:text-sm text-gray-500">
                {
                  auction.seller
                    .tiktokUsername
                }
              </p>

            )}

          </div>

        </div>

        {/* CURRENT BID */}
        <div className="mt-6">

          <p className="text-sm text-gray-500 mb-1">
            Current Bid
          </p>

          <p className="text-2xl md:text-3xl font-semibold">
            $
            {auction.currentBid?.toLocaleString()}
          </p>

        </div>

        {/* RETAIL PRICE */}
        <div className="mt-5 border rounded-2xl p-4 bg-green-50 border-green-200 min-h-[102px] flex items-center">

          {auction.retailPrice ? (

            <div className="flex items-center justify-between gap-4 w-full">

              <div>

                <p className="text-xs text-green-700 mb-1 font-medium">
                  Retail
                </p>

                <p className="text-lg md:text-xl font-semibold text-green-900">
                  $
                  {auction.retailPrice.toLocaleString()}
                </p>

              </div>

              <div className="text-right">

                <p className="text-xs text-green-700 mb-1 font-medium">
                  Savings
                </p>

                <p className="text-lg md:text-xl font-semibold text-green-900">

                  $
                  {savings.toLocaleString()}

                </p>

              </div>

            </div>

          ) : (

            <div className="w-full flex items-center justify-center">

              <p className="text-sm text-green-700 font-medium text-center">
                Retail price unavailable
              </p>

            </div>

          )}

        </div>

      </div>

    </Link>
  );
}