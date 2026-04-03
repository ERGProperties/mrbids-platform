import { prisma } from "@/lib/prisma";
import Link from "next/link";

interface Props {
  auctionId: string;
}

export default async function BidHistoryServer({
  auctionId,
}: Props) {
  const bids = await prisma.bid.findMany({
    where: { auctionId },
    orderBy: { createdAt: "desc" },
    include: {
      bidder: true, // ✅ ADD THIS
    },
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
          className="flex justify-between items-center border-b pb-2"
        >
          {/* LEFT: BIDDER + AMOUNT */}
          <div className="flex items-center gap-2 text-sm">
            <Link
              href={`/user/${bid.bidderId}`}
              className="font-medium underline hover:text-black"
            >
              {bid.bidder?.name || "Anonymous"}
            </Link>

            <span className="text-gray-400">•</span>

            <span>
              ${bid.amount.toLocaleString()}
            </span>
          </div>

          {/* RIGHT: TIME */}
          <span className="text-xs text-gray-500">
            {new Date(bid.createdAt).toLocaleString("en-US", {
              month: "short",
              day: "numeric",
              hour: "numeric",
              minute: "2-digit",
              timeZone: "America/Chicago",
              timeZoneName: "short",
            })}
          </span>
        </div>
      ))}
    </div>
  );
}