import Link from "next/link";
import { getAllAuctions } from "@/lib/repositories/auctionRepository";

function getPrimaryImage(auction: any) {
  if (auction.coverImage) return auction.coverImage;
  if (!Array.isArray(auction.images)) return null;
  if (!auction.imagesPath) return null;
  const first = auction.images[0];
  if (!first) return null;
  return `${auction.imagesPath}/${first}`;
}

function AuctionImage({ src }: { src: string | null }) {
  return (
    <div className="h-full w-full bg-gray-100 overflow-hidden">
      {src ? (
        <img src={src} alt="" className="h-full w-full object-cover" />
      ) : (
        <div className="h-full w-full flex items-center justify-center text-sm text-gray-400">
          No image available
        </div>
      )}
    </div>
  );
}

function getTimeStatus(endAt?: Date | null) {
  if (!endAt) return "LIVE";
  const diff = new Date(endAt).getTime() - Date.now();
  if (diff < 1000 * 60 * 60 * 24) return "ENDING SOON";
  return "LIVE";
}

function formatTimeRemaining(endAt?: Date | null) {
  if (!endAt) return "—";
  const diff = new Date(endAt).getTime() - Date.now();
  if (diff <= 0) return "Ended";
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
  return `${days}d ${hours}h`;
}

function StatusBadge({ status }: { status: string }) {
  const styles =
    status === "ENDING SOON"
      ? "bg-red-50 text-red-700"
      : "bg-green-50 text-green-700";

  return (
    <span className={`px-3 py-1 rounded-full text-[11px] font-semibold tracking-wide ${styles}`}>
      {status}
    </span>
  );
}

export default async function HomePage() {
  const auctions = await getAllAuctions();
  const live = auctions.filter((a) => a.status === "LIVE");
  const featured = live[0];

  return (
    <main className="bg-white">

      {/* HERO */}
      <section className="max-w-7xl mx-auto px-6 pt-40 pb-32">
        <div className="max-w-3xl">
          <p className="text-xs uppercase tracking-[0.25em] text-gray-500 mb-8">
            Private Marketplace
          </p>

          <h1 className="text-6xl md:text-7xl font-semibold leading-[1.03] tracking-tight text-gray-900">
            Seller-Direct
            <br />
            Real Estate Auctions
          </h1>

          <p className="mt-10 text-xl text-gray-600 leading-relaxed max-w-2xl">
            A premium auction marketplace designed for serious buyers and motivated sellers.
          </p>

          <div className="mt-14 flex flex-wrap gap-4">
            <Link
              href="/auctions"
              className="px-10 py-5 bg-black text-white rounded-full text-sm font-medium hover:bg-gray-900 transition"
            >
              Browse Auctions
            </Link>

            <Link
              href="/sell"
              className="px-10 py-5 border border-gray-300 rounded-full text-sm font-medium hover:border-gray-400 transition"
            >
              Sell a Property
            </Link>
          </div>
        </div>
      </section>

      {/* LUXURY ACTIVITY STRIP */}
      <section className="border-y border-gray-100 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6 py-5 flex flex-wrap gap-8 text-sm text-gray-600">
          <span>Live auctions active</span>
          <span>Verified buyer participation</span>
          <span>Transparent bidding environment</span>
          <span>New listings added regularly</span>
        </div>
      </section>

      {/* FEATURED */}
      {featured && (
        <section className="bg-white border-b border-gray-100">
          <div className="max-w-7xl mx-auto px-6 py-28">

            <div className="flex items-center gap-3 mb-6">
              <p className="text-xs uppercase tracking-[0.2em] text-gray-500">
                Featured Auction
              </p>
              <StatusBadge status={getTimeStatus(featured.endAt)} />
            </div>

            <div className="grid lg:grid-cols-2 rounded-3xl overflow-hidden border bg-white shadow-sm hover:shadow-md transition">
              <div className="h-[480px]">
                <AuctionImage src={getPrimaryImage(featured)} />
              </div>

              <div className="p-14 flex flex-col justify-center">
                <h2 className="text-4xl font-semibold text-gray-900 leading-tight">
                  {featured.title}
                </h2>

                <p className="mt-5 text-sm text-gray-600">
                  Ends in {formatTimeRemaining(featured.endAt)}
                </p>

                <Link
                  href={`/auctions/${featured.slug}`}
                  className="inline-block mt-10 px-8 py-3 bg-black text-white rounded-full text-sm font-medium hover:bg-gray-900 transition"
                >
                  View Auction
                </Link>
              </div>
            </div>

          </div>
        </section>
      )}

      {/* LIVE AUCTIONS */}
      <section className="bg-white">
        <div className="max-w-7xl mx-auto px-6 py-28">

          <div className="flex justify-between items-center mb-14">
            <h2 className="text-4xl font-semibold text-gray-900">
              Live Auctions
            </h2>

            <Link href="/auctions" className="text-sm text-gray-700 hover:text-black">
              View all →
            </Link>
          </div>

          <div className="grid md:grid-cols-3 gap-10">
            {live.slice(0, 3).map((auction) => (
              <div
                key={auction.id}
                className="border rounded-3xl overflow-hidden bg-white hover:shadow-lg transition"
              >
                <div className="h-60">
                  <AuctionImage src={getPrimaryImage(auction)} />
                </div>

                <div className="p-7">
                  <StatusBadge status={getTimeStatus(auction.endAt)} />

                  <h3 className="mt-4 text-xl font-semibold text-gray-900">
                    {auction.title}
                  </h3>

                  <p className="mt-3 text-sm text-gray-600">
                    Ends in {formatTimeRemaining(auction.endAt)}
                  </p>

                  <Link
                    href={`/auctions/${auction.slug}`}
                    className="inline-block mt-6 px-6 py-2 bg-black text-white rounded-full text-sm"
                  >
                    View Auction
                  </Link>
                </div>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* TRUST */}
      <section className="border-t border-gray-100 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6 py-20 grid md:grid-cols-4 gap-12 text-center">
          <div><h3 className="font-semibold text-gray-900">Licensed Escrow</h3></div>
          <div><h3 className="font-semibold text-gray-900">Verified Participants</h3></div>
          <div><h3 className="font-semibold text-gray-900">Admin Oversight</h3></div>
          <div><h3 className="font-semibold text-gray-900">Audit Trail</h3></div>
        </div>
      </section>

    </main>
  );
}