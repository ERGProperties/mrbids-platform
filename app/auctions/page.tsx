import Link from "next/link";
import { getAllAuctions } from "@/lib/repositories/auctionRepository";
import { autoCloseExpiredAuctions } from "@/lib/auctionLifecycle";

/**
 * Returns the primary (01-*) image URL or null
 */
function getPrimaryImage(
  images: string[],
  imagesPath: string
): string | null {
  if (!images || images.length === 0) return null;

  const primary = images.find((img) => img.startsWith("01-"));
  const file = primary ?? images[0];

  return file ? `${imagesPath}/${file}` : null;
}

function AuctionImage({ src }: { src: string | null }) {
  return (
    <div className="h-56 w-full bg-gray-100 overflow-hidden">
      {src ? (
        <img
          src={src}
          alt=""
          className="h-full w-full object-cover"
        />
      ) : (
        <div className="h-full w-full flex items-center justify-center text-sm text-gray-400">
          No image available
        </div>
      )}
    </div>
  );
}

export default async function AuctionsPage() {
  // 🔒 Auto-close expired auctions before rendering
  await autoCloseExpiredAuctions();

  const auctions = await getAllAuctions();
  const now = Date.now();

  const liveAuctions = auctions.filter(
    (a) => new Date(a.auctionEnd).getTime() > now
  );

  const pastAuctions = auctions.filter(
    (a) => new Date(a.auctionEnd).getTime() <= now
  );

  return (
    <main className="bg-gray-50 min-h-screen">
      <div className="max-w-6xl mx-auto px-6 py-32">
        {/* LIVE AUCTIONS */}
        <section className="mb-24">
          <h1 className="text-3xl font-semibold text-gray-900 mb-10">
            Live Auctions
          </h1>

          {liveAuctions.length === 0 ? (
            <p className="text-sm text-gray-500">
              There are no live auctions.
            </p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {liveAuctions.map((auction) => {
                const image = getPrimaryImage(
                  auction.images,
                  auction.imagesPath
                );

                return (
                  <div
                    key={auction.slug}
                    className="bg-white border border-gray-200 rounded-2xl overflow-hidden"
                  >
                    <AuctionImage src={image} />

                    <div className="p-6">
                      <h2 className="text-lg font-semibold text-gray-900">
                        {auction.title}
                      </h2>

                      <p className="mt-1 text-sm text-gray-600">
                        {auction.cityStateZip}
                      </p>

                      <div className="mt-4 text-sm text-gray-700">
                        <p>
                          <strong>Starting Bid:</strong>{" "}
                          ${auction.startingBid.toLocaleString()}
                        </p>
                        <p>
                          <strong>ARV:</strong>{" "}
                          ${auction.arv?.toLocaleString()}
                        </p>
                      </div>

                      <Link
                        href={`/auctions/${auction.slug}`}
                        className="inline-block mt-6 px-6 py-2 bg-black text-white rounded-full text-sm font-medium"
                      >
                        View Live Auction
                      </Link>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </section>

        {/* PAST AUCTIONS */}
        <section>
          <h2 className="text-3xl font-semibold text-gray-900 mb-10">
            Past Auctions
          </h2>

          {pastAuctions.length === 0 ? (
            <p className="text-sm text-gray-500">
              There are no past auctions.
            </p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {pastAuctions.map((auction) => {
                const image = getPrimaryImage(
                  auction.images,
                  auction.imagesPath
                );

                return (
                  <div
                    key={auction.slug}
                    className="bg-white border border-gray-200 rounded-2xl overflow-hidden"
                  >
                    <AuctionImage src={image} />

                    <div className="p-6">
                      <h2 className="text-lg font-semibold text-gray-900">
                        {auction.title}
                      </h2>

                      <p className="mt-1 text-sm text-gray-600">
                        {auction.cityStateZip}
                      </p>

                      <div className="mt-4 text-sm text-gray-700 space-y-1">
                        <p>
                          <strong>Final Price:</strong>{" "}
                          ${auction.finalPrice?.toLocaleString()}
                        </p>
                        <p>
                          <strong>Total Bids:</strong>{" "}
                          {auction.bidCount}
                        </p>
                        <p>
                          <strong>Duration:</strong>{" "}
                          {auction.durationDays} days
                        </p>
                      </div>

                      <Link
                        href={`/auctions/${auction.slug}/result`}
                        className="inline-block mt-6 px-6 py-2 bg-gray-900 text-white rounded-full text-sm font-medium"
                      >
                        View Auction Results
                      </Link>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </section>
      </div>
    </main>
  );
}
