import { notFound, redirect } from "next/navigation";
import { auctions } from "../data/auctions";
import Countdown from "../2210-mckenzie-ave-waco/Countdown";

export default function AuctionPage({
  params,
}: {
  params: { slug: string };
}) {
  const auction = auctions.find((a) => a.slug === params.slug);
  if (!auction) return notFound();

  const endTime = new Date(auction.endTime);

  if (Date.now() >= endTime.getTime()) {
    redirect(`/auctions/${auction.slug}/result`);
  }

  return (
    <main className="bg-gray-50 min-h-screen">
      <div className="max-w-6xl mx-auto px-6 py-32">
        <h1 className="text-4xl font-semibold text-gray-900">
          {auction.address}
        </h1>
        <p className="mt-2 text-lg text-gray-600">{auction.cityState}</p>

        <div className="mt-10 grid grid-cols-2 md:grid-cols-4 gap-6 bg-white p-6 rounded-2xl border">
          <div>
            <p className="text-sm font-medium">Auction Ends</p>
            <p className="text-sm">{endTime.toLocaleString()}</p>
          </div>
          <div>
            <p className="text-sm font-medium">Starting Bid</p>
            <p className="text-sm">{auction.startingBid}</p>
          </div>
          <div>
            <p className="text-sm font-medium">Bid Increment</p>
            <p className="text-sm">{auction.bidIncrement}</p>
          </div>
          <div>
            <p className="text-sm font-medium">ARV</p>
            <p className="text-sm">{auction.arv}</p>
          </div>
        </div>

        <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {auction.photos.map((photo) => (
            <img
              key={photo}
              src={`/auctions/${auction.slug}/${photo}`}
              className="rounded-xl object-cover border"
              alt=""
            />
          ))}
        </div>

        <div className="mt-16 text-center">
          <a
            href="/join"
            className="inline-block px-8 py-4 bg-black text-white rounded-full"
          >
            Request Buyer Access
          </a>
        </div>
      </div>
    </main>
  );
}
