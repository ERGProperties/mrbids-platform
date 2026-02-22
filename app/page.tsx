import Link from "next/link";
import { getAllAuctions } from "@/lib/repositories/auctionRepository";
import AuctionCountdown from "@/components/auction/AuctionCountdown";

function getPrimaryImage(auction: any) {
  if (auction.coverImage) return auction.coverImage;
  if (!Array.isArray(auction.images)) return null;
  if (!auction.imagesPath) return null;

  const first = auction.images[0];
  if (!first) return null;

  return `${auction.imagesPath}/${first}`;
}

function getLocation(auction: any) {
  return auction.cityStateZip || auction.addressLine || "";
}

function getCurrentBid(auction: any) {
  return auction.highestBid ?? auction.startingBid ?? 0;
}

function AuctionImage({ src }: { src: string | null }) {
  return (
    <div className="h-56 w-full bg-gray-100 overflow-hidden">
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

export default async function HomePage() {
  const auctions = await getAllAuctions();

  const live = auctions.filter(
    (a) => a.status === "LIVE" && a.endAt
  );

  return (
    <main className="bg-gradient-to-b from-gray-50 to-white">

      {/* HERO */}
      <section className="max-w-7xl mx-auto px-6 pt-36 pb-28">
        <div className="max-w-3xl">
          <p className="text-sm font-medium text-gray-500 mb-6 tracking-wide">
            A Private Marketplace for Real Assets
          </p>

          <h1 className="text-6xl font-semibold tracking-tight text-gray-900">
            Seller-Direct
            <br />
            Real Estate Auctions
          </h1>

          <p className="mt-8 text-xl text-gray-600 leading-relaxed">
            MrBids is a private, seller-direct auction marketplace designed
            for verified buyers and institutional-grade transactions.
          </p>

          <div className="mt-14 flex items-center gap-10">
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

          <p className="mt-10 text-xs text-gray-400">
            Private platform • Limited access • Admin-reviewed auctions
          </p>
        </div>
      </section>

      {/* LIVE AUCTIONS */}
      <section className="bg-white border-t border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-6 py-24">
          <h2 className="text-3xl font-semibold mb-10">
            Live Auctions
          </h2>

          {live.length === 0 ? (
            <div className="border rounded-2xl bg-gray-50 p-12 text-center">
              <h3 className="text-2xl font-semibold text-gray-900">
                Auctions Coming Soon
              </h3>

              <p className="mt-4 text-gray-600 max-w-xl mx-auto">
                New listings are being added. Check back shortly or start
                your own seller-direct auction.
              </p>
            </div>
          ) : (
            <div className="grid md:grid-cols-3 gap-8">
              {live.slice(0, 3).map((auction) => (
                <div
                  key={auction.id}
                  className="bg-white border rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition"
                >
                  <div className="relative">
                    <AuctionImage src={getPrimaryImage(auction)} />

                    <div className="absolute top-4 left-4 px-3 py-1 bg-black text-white text-xs font-medium rounded-full">
                      ● LIVE
                    </div>
                  </div>

                  <div className="p-6">
                    <h3 className="text-xl font-semibold text-gray-900">
                      {auction.title}
                    </h3>

                    <p className="mt-1 text-sm text-gray-500">
                      {getLocation(auction)}
                    </p>

                    {/* ⭐ PREMIUM BID ANCHOR */}
                    <div className="mt-4 inline-block rounded-xl bg-gray-50 border border-gray-200 px-4 py-2">
                      <p className="text-[11px] uppercase tracking-wide text-gray-500">
                        Current Bid
                      </p>
                      <p className="text-lg font-semibold text-gray-900 leading-tight">
                        ${getCurrentBid(auction).toLocaleString()}
                      </p>
                    </div>

                    <div className="mt-4">
                      <AuctionCountdown endsAt={auction.endAt} />
                    </div>

                    <Link
                      href={`/auctions/${auction.slug}`}
                      className="inline-block mt-6 px-6 py-3 bg-black text-white rounded-full text-sm font-medium hover:bg-gray-900 transition"
                    >
                      View Auction
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* TRUST STRIP */}
      <section className="border-t border-b border-gray-100 bg-white">
        <div className="max-w-7xl mx-auto px-6 py-12 grid grid-cols-1 md:grid-cols-4 gap-10 text-center">
          <div>
            <p className="text-sm font-semibold text-gray-900">
              Licensed Escrow
            </p>
            <p className="mt-2 text-xs text-gray-500">
              Funds flow through third-party licensed escrow providers.
            </p>
          </div>

          <div>
            <p className="text-sm font-semibold text-gray-900">
              Verified Participants
            </p>
            <p className="mt-2 text-xs text-gray-500">
              Buyers and sellers are reviewed prior to participation.
            </p>
          </div>

          <div>
            <p className="text-sm font-semibold text-gray-900">
              Admin Oversight
            </p>
            <p className="mt-2 text-xs text-gray-500">
              Auctions are monitored to ensure compliance and fairness.
            </p>
          </div>

          <div>
            <p className="text-sm font-semibold text-gray-900">
              Audit Trail
            </p>
            <p className="mt-2 text-xs text-gray-500">
              Every bid and action is recorded and preserved.
            </p>
          </div>
        </div>
      </section>

      {/* TRUST GRID */}
      <section className="bg-white">
        <div className="max-w-7xl mx-auto px-6 py-28 grid grid-cols-1 md:grid-cols-4 gap-20">
          {[
            {
              title: "Verified Buyers",
              desc: "All buyers undergo identity and access review prior to bidding.",
            },
            {
              title: "Seller Control",
              desc: "Sellers define reserve pricing and retain acceptance authority.",
            },
            {
              title: "Transparent Auctions",
              desc: "Bids are visible, time-stamped, and auditable.",
            },
            {
              title: "Human Oversight",
              desc: "Every auction is actively monitored by platform administrators.",
            },
          ].map((item) => (
            <div key={item.title}>
              <h3 className="text-base font-semibold text-gray-900">
                {item.title}
              </h3>
              <p className="mt-5 text-sm text-gray-600 leading-relaxed">
                {item.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

    </main>
  );
}