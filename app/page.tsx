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
  if (!endAt) return "LIVE NOW";
  const diff = new Date(endAt).getTime() - Date.now();
  if (diff <= 0) return "ENDED";
  if (diff < 1000 * 60 * 60 * 24) return "ENDING SOON";
  return "LIVE NOW";
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
      ? "bg-red-100 text-red-700"
      : "bg-green-100 text-green-700";

  return (
    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${styles}`}>
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
      <section className="max-w-7xl mx-auto px-6 pt-32 pb-20">
        <div className="max-w-3xl">
          <p className="text-sm font-medium text-gray-500 mb-6 tracking-wide">
            Private Marketplace for Real Assets
          </p>

          <h1 className="text-6xl font-semibold tracking-tight text-gray-900 leading-tight">
            Seller-Direct
            <br />
            Real Estate Auctions
          </h1>

          <p className="mt-8 text-xl text-gray-600 leading-relaxed">
            Verified buyers compete transparently while sellers retain full control.
          </p>

          <div className="mt-14 flex flex-wrap gap-4">
            <Link
              href="/auctions"
              className="px-10 py-5 bg-black text-white rounded-full text-base font-medium hover:bg-gray-900 transition"
            >
              Browse Auctions
            </Link>

            <Link
              href="/sell"
              className="px-10 py-5 border border-gray-300 rounded-full text-base font-medium bg-white hover:border-gray-400 transition"
            >
              Sell a Property
            </Link>
          </div>
        </div>
      </section>

      {/* 🔥 MARKETPLACE ACTIVITY BAR */}
      <section className="border-y border-gray-100 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex flex-wrap gap-6 text-sm text-gray-700">
          <span>● Multiple auctions live now</span>
          <span>● Bidding activity in progress</span>
          <span>● Verified buyers participating</span>
          <span>● New listings added weekly</span>
        </div>
      </section>

      {/* AUTHORITY */}
      <section className="bg-white">
        <div className="max-w-7xl mx-auto px-6 py-14 grid md:grid-cols-3 gap-10">
          <div>
            <h3 className="text-xl font-semibold text-gray-900">Live Marketplace</h3>
            <p className="mt-3 text-sm text-gray-600">
              Auctions operate in real time with active bidder participation.
            </p>
          </div>
          <div>
            <h3 className="text-xl font-semibold text-gray-900">Transparent Bidding</h3>
            <p className="mt-3 text-sm text-gray-600">
              Every bid is visible, time-stamped, and auditable.
            </p>
          </div>
          <div>
            <h3 className="text-xl font-semibold text-gray-900">Seller Authority</h3>
            <p className="mt-3 text-sm text-gray-600">
              Sellers maintain reserve pricing and acceptance control.
            </p>
          </div>
        </div>
      </section>

      {/* FEATURED */}
      {featured && (
        <section className="border-t border-b border-gray-100 bg-gray-50">
          <div className="max-w-7xl mx-auto px-6 py-20">

            <div className="flex items-center gap-3 mb-4">
              <p className="text-xs uppercase tracking-widest text-gray-500">
                Featured Auction
              </p>
              <StatusBadge status={getTimeStatus(featured.endAt)} />
            </div>

            <div className="grid lg:grid-cols-2 bg-white border rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition">
              <div className="h-[420px]">
                <AuctionImage src={getPrimaryImage(featured)} />
              </div>

              <div className="p-10 flex flex-col justify-center">
                <h2 className="text-3xl font-semibold text-gray-900">
                  {featured.title}
                </h2>

                <p className="mt-4 text-sm text-gray-600">
                  Ends in {formatTimeRemaining(featured.endAt)}
                </p>

                <p className="mt-4 text-sm text-gray-500">
                  Active bidding • Market-driven pricing
                </p>

                <Link
                  href={`/auctions/${featured.slug}`}
                  className="inline-block mt-8 px-8 py-3 bg-black text-white rounded-full text-sm font-medium hover:bg-gray-900 transition"
                >
                  View Featured Auction
                </Link>
              </div>
            </div>

          </div>
        </section>
      )}

      {/* LIVE GRID */}
      <section className="bg-white">
        <div className="max-w-7xl mx-auto px-6 py-20">

          <div className="flex items-center justify-between mb-10">
            <h2 className="text-3xl font-semibold text-gray-900">
              Live Auctions
            </h2>
            <Link href="/auctions" className="text-sm font-medium text-gray-700 hover:text-black">
              View all →
            </Link>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {live.slice(0, 3).map((auction) => (
              <div
                key={auction.id}
                className="bg-white border rounded-2xl overflow-hidden hover:shadow-xl transition"
              >
                <div className="h-56">
                  <AuctionImage src={getPrimaryImage(auction)} />
                </div>

                <div className="p-6">
                  <StatusBadge status={getTimeStatus(auction.endAt)} />

                  <h3 className="mt-3 text-lg font-semibold text-gray-900">
                    {auction.title}
                  </h3>

                  <p className="mt-2 text-sm text-gray-600">
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
        <div className="max-w-7xl mx-auto px-6 py-16 grid md:grid-cols-4 gap-10 text-center">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Licensed Escrow</h3>
            <p className="mt-3 text-sm text-gray-600">Funds handled via third-party escrow.</p>
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Verified Participants</h3>
            <p className="mt-3 text-sm text-gray-600">Identity and access reviewed.</p>
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Admin Oversight</h3>
            <p className="mt-3 text-sm text-gray-600">Auctions monitored for fairness.</p>
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Audit Trail</h3>
            <p className="mt-3 text-sm text-gray-600">Every action is recorded.</p>
          </div>
        </div>
      </section>

    </main>
  );
}