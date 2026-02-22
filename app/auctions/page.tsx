import Link from "next/link";
import { getAllAuctions } from "@/lib/repositories/auctionRepository";
import { autoCloseExpiredAuctions } from "@/lib/auctionLifecycle";

function getPrimaryImage(auction: any) {
  // ⭐ ALWAYS prefer coverImage
  if (auction.coverImage) return auction.coverImage;

  if (!Array.isArray(auction.images)) return null;
  if (!auction.imagesPath) return null;

  const first = auction.images[0];
  if (!first) return null;

  return `${auction.imagesPath}/${first}`;
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
  await autoCloseExpiredAuctions();

  const auctions = await getAllAuctions();

  const live = auctions.filter((a) => a.status === "LIVE");
  const past = auctions.filter((a) => a.status === "CLOSED");

  return (
    <main className="bg-gray-50 min-h-screen">
      <div className="max-w-6xl mx-auto px-6 py-32">

        <h1 className="text-3xl font-semibold mb-10">
          Live Auctions
        </h1>

        <div className="grid md:grid-cols-2 gap-8 mb-24">
          {live.map((auction) => (
            <div
              key={auction.id}
              className="bg-white border rounded-2xl overflow-hidden"
            >
              <AuctionImage
                src={getPrimaryImage(auction)}
              />

              <div className="p-6">
                <h2 className="text-lg font-semibold">
                  {auction.title}
                </h2>

                <Link
                  href={`/auctions/${auction.slug}`}
                  className="inline-block mt-6 px-6 py-2 bg-black text-white rounded-full text-sm"
                >
                  View Live Auction
                </Link>
              </div>
            </div>
          ))}
        </div>

        <h2 className="text-3xl font-semibold mb-10">
          Past Auctions
        </h2>

        <div className="grid md:grid-cols-2 gap-8">
          {past.map((auction) => (
            <div
              key={auction.id}
              className="bg-white border rounded-2xl overflow-hidden"
            >
              <AuctionImage
                src={getPrimaryImage(auction)}
              />

              <div className="p-6">
                <h2 className="text-lg font-semibold">
                  {auction.title}
                </h2>

                <Link
                  href={`/auctions/${auction.slug}/result`}
                  className="inline-block mt-6 px-6 py-2 bg-gray-900 text-white rounded-full text-sm"
                >
                  View Auction Results
                </Link>
              </div>
            </div>
          ))}
        </div>

      </div>
    </main>
  );
}