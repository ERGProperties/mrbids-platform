export const dynamic = "force-dynamic";

import Link from "next/link";
import { getAllAuctions } from "@/lib/repositories/auctionRepository";

/* ---------- IMAGE HELPERS ---------- */

function getPrimaryImage(auction: any) {
  if (
    typeof auction?.coverImage === "string" &&
    auction.coverImage.startsWith("http")
  ) {
    return auction.coverImage;
  }

  if (!Array.isArray(auction?.images)) return null;

  const first = auction.images.find(
    (img: unknown) =>
      typeof img === "string" &&
      img.startsWith("http")
  );

  return first || null;
}

function AuctionImage({ src }: { src: string | null }) {
  return (
    <div className="h-full w-full bg-gray-100 overflow-hidden">
      {src ? (
        <img
          src={src}
          alt=""
          className="h-full w-full object-cover"
          loading="lazy"
          onError={(e) => {
            console.error("Image failed:", src);
            (e.currentTarget as HTMLImageElement).style.display = "none";
          }}
        />
      ) : (
        <div className="h-full w-full flex items-center justify-center text-sm text-gray-400">
          No image available
        </div>
      )}
    </div>
  );
}

/* ---------- TIME HELPERS ---------- */

function getTimeStatus(endAt?: Date | string | null) {
  if (!endAt) return "LIVE NOW";

  const end = new Date(endAt);
  if (isNaN(end.getTime())) return "LIVE NOW";

  const diff = end.getTime() - Date.now();

  if (diff <= 0) return "ENDED";
  if (diff < 1000 * 60 * 60 * 24) return "ENDING SOON";

  return "LIVE NOW";
}

function formatTimeRemaining(endAt?: Date | string | null) {
  if (!endAt) return "—";

  const end = new Date(endAt);
  if (isNaN(end.getTime())) return "—";

  const diff = end.getTime() - Date.now();

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
    <span
      className={`px-3 py-1 rounded-full text-xs font-semibold tracking-wide ${styles}`}
    >
      {status}
    </span>
  );
}

/* ---------- PAGE ---------- */

export default async function HomePage() {
  const auctions = (await getAllAuctions()) ?? [];

  const live = Array.isArray(auctions)
    ? auctions.filter((a) => a?.status === "LIVE")
    : [];

  const featured = live.length > 0 ? live[0] : null;

  return (
    <main className="bg-white">

      {/* HERO */}
      <section className="max-w-7xl mx-auto px-6 pt-36 pb-28">
        <div className="max-w-3xl">
          <p className="text-sm font-medium text-gray-500 mb-6 uppercase tracking-[0.18em]">
            Private Marketplace for Real Assets
          </p>

          <h1 className="text-6xl md:text-7xl font-semibold leading-[1.05]">
            Seller-Direct
            <br />
            Real Estate Auctions
          </h1>

          <p className="mt-10 text-xl text-gray-600">
            Verified buyers compete transparently while sellers retain full control.
          </p>

          <div className="mt-14 flex gap-4">
            <Link href="/auctions" className="px-10 py-5 bg-black text-white rounded-full">
              Browse Auctions
            </Link>

            <Link href="/sell" className="px-10 py-5 border rounded-full">
              Sell a Property
            </Link>
          </div>
        </div>
      </section>

      {/* MARKETPLACE STRIP */}
      <section className="border-y bg-gray-50">
        <div className="max-w-7xl mx-auto px-6 py-5 flex flex-wrap gap-8 text-sm text-gray-700">
          <span>● Multiple auctions live now</span>
          <span>● Bidding activity in progress</span>
          <span>● Verified buyers participating</span>
          <span>● New listings added weekly</span>
        </div>
      </section>

      {/* AUTHORITY */}
      <section className="bg-white">
        <div className="max-w-7xl mx-auto px-6 py-20 grid md:grid-cols-3 gap-14">
          <div>
            <h3 className="text-2xl font-semibold">Live Marketplace</h3>
            <p className="mt-4 text-sm text-gray-600">
              Auctions operate in real time with active bidder participation.
            </p>
          </div>

          <div>
            <h3 className="text-2xl font-semibold">Transparent Bidding</h3>
            <p className="mt-4 text-sm text-gray-600">
              Every bid is visible, time-stamped, and auditable.
            </p>
          </div>

          <div>
            <h3 className="text-2xl font-semibold">Seller Authority</h3>
            <p className="mt-4 text-sm text-gray-600">
              Sellers maintain reserve pricing and acceptance control.
            </p>
          </div>
        </div>
      </section>

      {/* FEATURED */}
      {featured && (
        <section className="border-y bg-gray-50">
          <div className="max-w-7xl mx-auto px-6 py-24">

            <div className="flex items-center gap-3 mb-5">
              <p className="text-xs uppercase tracking-[0.2em] text-gray-500">
                Featured Auction
              </p>
              <StatusBadge status={getTimeStatus(featured.endAt)} />
            </div>

            <div className="grid lg:grid-cols-2 bg-white border rounded-3xl overflow-hidden">
              <div className="h-[460px]">
                <AuctionImage src={getPrimaryImage(featured)} />
              </div>

              <div className="p-12 flex flex-col justify-center">
                <h2 className="text-4xl font-semibold">{featured.title}</h2>

                <p className="mt-4 text-sm text-gray-600">
                  {featured.addressLine}
                  <br />
                  {featured.cityStateZip}
                </p>

                <p className="mt-5 text-sm text-gray-600">
                  Ends in {formatTimeRemaining(featured.endAt)}
                </p>

                <Link
                  href={`/auctions/${featured.slug}`}
                  className="inline-block mt-10 px-8 py-3 bg-black text-white rounded-full"
                >
                  View Featured Auction
                </Link>
              </div>
            </div>

          </div>
        </section>
      )}

      {/* LIVE AUCTIONS */}
      <section className="bg-white">
        <div className="max-w-7xl mx-auto px-6 py-24">

          <div className="flex items-center justify-between mb-12">
            <h2 className="text-4xl font-semibold">Live Auctions</h2>
            <Link href="/auctions" className="text-sm font-medium">
              View all →
            </Link>
          </div>

          <div className="grid md:grid-cols-3 gap-10">
            {live.slice(0, 3).map((auction) => (
              <div key={auction.id} className="border rounded-3xl overflow-hidden">
                <div className="h-60">
                  <AuctionImage src={getPrimaryImage(auction)} />
                </div>

                <div className="p-7">
                  <StatusBadge status={getTimeStatus(auction.endAt)} />

                  <h3 className="mt-4 text-xl font-semibold">
                    {auction.title}
                  </h3>

                  <p className="mt-2 text-sm text-gray-600">
                    {auction.addressLine}
                    <br />
                    {auction.cityStateZip}
                  </p>

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
      <section className="border-t bg-gray-50">
        <div className="max-w-7xl mx-auto px-6 py-20 grid md:grid-cols-4 gap-12 text-center">
          <div>
            <h3 className="font-semibold">Licensed Escrow</h3>
            <p className="mt-3 text-sm text-gray-600">Funds handled via third-party escrow.</p>
          </div>
          <div>
            <h3 className="font-semibold">Verified Participants</h3>
            <p className="mt-3 text-sm text-gray-600">Identity and access reviewed.</p>
          </div>
          <div>
            <h3 className="font-semibold">Admin Oversight</h3>
            <p className="mt-3 text-sm text-gray-600">Auctions monitored for fairness.</p>
          </div>
          <div>
            <h3 className="font-semibold">Audit Trail</h3>
            <p className="mt-3 text-sm text-gray-600">Every action is recorded.</p>
          </div>
        </div>
      </section>

    </main>
  );
}