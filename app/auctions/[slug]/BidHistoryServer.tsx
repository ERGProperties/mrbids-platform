import { prisma } from "@/lib/prisma";

interface Props {
  auctionId: string;
}

export default async function BidHistoryServer({
  auctionId,
}: Props) {
  const bids = await prisma.bid.findMany({
    where: { auctionId },
    orderBy: { createdAt: "desc" },
  });

  if (bids.length === 0) {
    return (
      <div className="text-sm text-gray-500">
        No bids yet.
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {bids.map((bid) => (
        <div
          key={bid.id}
          className="flex justify-between border-b pb-2"
        >
          <span className="text-sm">
            ${bid.amount.toLocaleString()}
          </span>
          <span className="text-xs text-gray-500">
            {new Date(bid.createdAt).toLocaleString()}
          </span>
        </div>
      ))}
    </div>
  );
}
