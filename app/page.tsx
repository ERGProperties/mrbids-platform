import Link from "next/link";
import { getAllAuctions } from "@/lib/repositories/auctionRepository";

/* ⭐ SAFE JSON NORMALIZER */
function normalizeImages(images: unknown): string[] {
  if (!Array.isArray(images)) return [];

  return images.filter(
    (img): img is string =>
      typeof img === "string" && img.startsWith("http")
  );
}

/* ⭐ FIXED IMAGE LOGIC */
function getPrimaryImage(auction: any) {
  if (typeof auction.coverImage === "string" && auction.coverImage.length) {
    return auction.coverImage;
  }

  const images = normalizeImages(auction.images);
  return images[0] || null;
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
        />
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
    <span className={`px-3 py-1 rounded-full text-xs font-semibold tracking-wide ${styles}`}>
      {status}
    </span>
  );
}

function AddressBlock({ auction }: { auction: any }) {
  return (
    <p className="mt-4 text-sm text-gray-600 leading-relaxed">
      {auction.addressLine && (
        <>
          {auction.addressLine}
          <br />
        </>
      )}
      {auction.cityStateZip}
    </p>
  );
}

export default async function HomePage() {
  const auctions = await getAllAuctions();
  const live = auctions.filter((a) => a.status === "LIVE");
  const featured = live[0];

  return (
    <main className="bg-white">

      {/* HERO */}
      <section className="max-w-7xl mx-auto px-6 pt-36 pb-28">
        <div className="max-w-3xl">
          <h1 className="text-6xl md:text-7xl font-semibold tracking-tight text-gray-900">
            Seller-Direct
            <br />
            Real Estate Auctions
          </h1>
        </div>
      </section>

      {/* FEATURED */}
      {featured && (
        <section className="border-t border-b border-gray-100 bg-gray-50">
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
                <h2 className="text-4xl font-semibold text-gray-900">
                  {featured.title}
                </h2>

                <AddressBlock auction={featured} />

                <p className="mt-5 text-sm text-gray-600">
                  Ends in {formatTimeRemaining(featured.endAt)}
                </p>

                <Link
                  href={`/auctions/${featured.slug}`}
                  className="inline-block mt-10 px-8 py-3 bg-black text-white rounded-full text-sm"
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
          <div className="grid md:grid-cols-3 gap-10">
            {live.slice(0, 3).map((auction) => (
              <div
                key={auction.id}
                className="bg-white border rounded-3xl overflow-hidden"
              >
                <div className="h-60">
                  <AuctionImage src={getPrimaryImage(auction)} />
                </div>

                <div className="p-7">
                  <StatusBadge status={getTimeStatus(auction.endAt)} />

                  <h3 className="mt-4 text-xl font-semibold text-gray-900">
                    {auction.title}
                  </h3>

                  <AddressBlock auction={auction} />

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

    </main>
  );
}