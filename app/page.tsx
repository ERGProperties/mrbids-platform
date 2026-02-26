export const dynamic = "force-dynamic";

import Link from "next/link";
import { getAllAuctions } from "@/lib/repositories/auctionRepository";

/* ---------- IMAGE HELPERS ---------- */
function normalizeImages(images: unknown): string[] {
  if (!Array.isArray(images)) return [];
  return images.filter(
    (img): img is string =>
      typeof img === "string" && img.startsWith("http")
  );
}

function getPrimaryImage(auction: any) {
  if (auction.coverImage) return auction.coverImage;
  return normalizeImages(auction.images)[0] || null;
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

/* ---------- PAGE ---------- */

export default async function HomePage() {
  const auctions = await getAllAuctions();
  const live = auctions.filter((a) => a.status === "LIVE");
  const featured = live[0];

  return (
    <main className="bg-white">

      {/* HERO */}
      <section className="max-w-7xl mx-auto px-6 pt-36 pb-28">
        <div className="max-w-3xl">
          <p className="text-sm font-medium text-gray-500 mb-6 uppercase">
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

      {/* FEATURED */}
      {featured && (
        <section className="border-y bg-gray-50">
          <div className="max-w-7xl mx-auto px-6 py-24">

            <div className="grid lg:grid-cols-2 bg-white border rounded-3xl overflow-hidden">
              <div className="h-[460px]">
                <AuctionImage src={getPrimaryImage(featured)} />
              </div>

              <div className="p-12 flex flex-col justify-center">
                <h2 className="text-4xl font-semibold">{featured.title}</h2>

                <p className="mt-4 text-sm text-gray-600">
                  {featured.addressLine}<br />
                  {featured.cityStateZip}
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

          <h2 className="text-4xl font-semibold mb-12">
            Live Auctions
          </h2>

          <div className="grid md:grid-cols-3 gap-10">
            {live.slice(0, 3).map((auction) => (
              <div key={auction.id} className="border rounded-3xl overflow-hidden">
                <div className="h-60">
                  <AuctionImage src={getPrimaryImage(auction)} />
                </div>

                <div className="p-7">
                  <h3 className="text-xl font-semibold">{auction.title}</h3>

                  <p className="mt-3 text-sm text-gray-600">
                    {auction.addressLine}<br />
                    {auction.cityStateZip}
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

      {/* TRUST SECTION (RESTORED) */}
      <section className="border-t bg-gray-50">
        <div className="max-w-7xl mx-auto px-6 py-20 grid md:grid-cols-4 gap-12 text-center">
          <div><h3 className="font-semibold">Licensed Escrow</h3></div>
          <div><h3 className="font-semibold">Verified Participants</h3></div>
          <div><h3 className="font-semibold">Admin Oversight</h3></div>
          <div><h3 className="font-semibold">Audit Trail</h3></div>
        </div>
      </section>

    </main>
  );
}