import { notFound } from "next/navigation";
import { auctions } from "../../data/auctions";

export default function AuctionResult({
  params,
}: {
  params: { slug: string };
}) {
  const auction = auctions.find((a) => a.slug === params.slug);
  if (!auction) return notFound();

  return (
    <main className="bg-gray-50 min-h-screen">
      <div className="max-w-4xl mx-auto px-6 py-32 text-center">
        <h1 className="text-3xl font-semibold">{auction.address}</h1>

        <p className="mt-6 text-lg text-gray-700">
          {auction.result === "sold" && "Property Sold"}
          {auction.result === "under_contract" && "Under Contract"}
          {auction.result === "no_sale" && "Auction Closed — No Sale"}
          {!auction.result && "Auction Closed"}
        </p>

        <div className="mt-10">
          <a href="/auctions" className="underline">
            Browse Other Auctions
          </a>
        </div>
      </div>
    </main>
  );
}

import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/authOptions"

const session = await getServerSession(authOptions)
if (!session) notFound()

