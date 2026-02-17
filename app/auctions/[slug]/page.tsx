import { notFound, redirect } from "next/navigation";
import { prisma } from "@/lib/db";
import BidForm from "./BidForm";
import BidHistory from "./BidHistory";

/**
 * Resolve primary (01-*) image
 */
function getPrimaryImage(
  images: unknown,
  imagesPath: string
): string | null {
  if (!Array.isArray(images) || images.length === 0) return null;

  const files = images as string[];
  const primary = files.find((f) => f.startsWith("01-"));
  const file = primary ?? files[0];

  return file ? `${imagesPath}/${file}` : null;
}

export default async function AuctionPage({
  params,
}: {
  params: { slug: string };
}) {
  const auction = await prisma.auction.findUnique({
    where: { slug: params.slug },
    include: {
      bids: {
        orderBy: { amount: "desc" },
        take: 1,
      },
    },
  });

  if (!auction) {
    notFound();
  }

  const now = new Date();

  // 🔒 Redirect if auction has ended
  if (now > auction.endAt) {
    redirect(`/auctions/${auction.slug}/result`);
  }

  const highestBid =
    auction.bids[0]?.amount ??
    auction.finalPrice ??
    auction.startingBid;

  const minimumBid =
    highestBid + auction.bidIncrement;

  const image = getPrimaryImage(
    auction.images,
    auction.imagesPath
  );

  return (
    <main className="bg-gray-50 min-h-screen">
      <div className="max-w-6xl mx-auto px-6 py-32">
        {/* HEADER */}
        <div className="mb-12">
          <p className="text-xs uppercase tracking-widest text-gray-400">
            Live Auction
          </p>
          <h1 className="mt-4 text-4xl font-semibold text-gray-900">
            {auction.title}
          </h1>
          <p className="mt-2 text-lg text-gray-600">
            {auction.addressLine}, {auction.cityStateZip}
          </p>
        </div>

        {/* IMAGE */}
        <div className="mb-12 overflow-hidden rounded-2xl border border-gray-200 bg-white">
          {image ? (
            <img
              src={image}
              alt=""
              className="w-full h-[420px] object-cover"
            />
          ) : (
            <div className="h-[420px] flex items-center justify-center text-sm text-gray-400">
              No image available
            </div>
          )}
        </div>

        {/* AUCTION DETAILS */}
        <div className="mb-12 bg-white border border-gray-200 rounded-2xl p-6 grid grid-cols-1 md:grid-cols-4 gap-6">
          <Detail label="Starting Bid">
            ${auction.startingBid.toLocaleString()}
          </Detail>

          <Detail label="Bid Increment">
            ${auction.bidIncrement.toLocaleString()}
          </Detail>

          <Detail label="Current Bid">
            ${highestBid.toLocaleString()}
          </Detail>

          <Detail label="ARV">
            {auction.arv
              ? `$${auction.arv.toLocaleString()}`
              : "—"}
          </Detail>
        </div>

        {/* BID FORM */}
        <BidForm
          slug={auction.slug}
          minimumBid={minimumBid}
        />

        {/* BID HISTORY */}
        <div className="mt-12">
          <BidHistory auctionId={auction.id} />
        </div>

        {/* FOOTNOTE */}
        <p className="mt-12 text-xs text-gray-400 leading-relaxed">
          All bids are binding. Auction closes automatically
          at the stated end time. Seller retains discretion
          over acceptance.
        </p>
      </div>
    </main>
  );
}

function Detail({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <p className="text-sm font-medium text-gray-900">
        {label}
      </p>
      <p className="mt-1 text-sm text-gray-600">
        {children}
      </p>
    </div>
  );
}
