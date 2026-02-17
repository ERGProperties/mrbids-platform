import { prisma } from "@/lib/db";

export default async function BidHistory({
  auctionId,
}: {
  auctionId: string;
}) {
  const bids = await prisma.bid.findMany({
    where: { auctionId },
    orderBy: { createdAt: "desc" },
  });

  if (bids.length === 0) {
    return (
      <div className="bg-white border border-gray-200 rounded-2xl p-6">
        <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-widest">
          Bid History
        </h3>
        <p className="mt-4 text-sm text-gray-500">
          No bids have been placed yet.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white border border-gray-200 rounded-2xl p-6">
      <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-widest mb-4">
        Bid History
      </h3>

      <ul className="divide-y divide-gray-200">
        {bids.map((bid) => (
          <li
            key={bid.id}
            className="py-3 flex justify-between text-sm"
          >
            <span className="font-medium text-gray-900">
              ${bid.amount.toLocaleString()}
            </span>
            <span className="text-gray-500">
              {bid.createdAt.toLocaleString()}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}
