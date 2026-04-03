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
      bidder: {
        select: {
          id: true,
          name: true,
          avatarUrl: true,
          image: true,
          isVerifiedBidder: true,
        },
      },
    },
  });

  if (bids.length === 0) {
    return (
      <div className="text-sm text-gray-500">
        No bids yet.
      </div>
    );
  }

  // 🔥 Identify top bid (latest highest)
  const topBidId = bids[0]?.id;

  return (
    <div className="space-y-3">
      {bids.map((bid) => (
        <div
          key={bid.id}
          className={`flex justify-between items-center border-b pb-3 rounded-lg px-2 ${
            bid.id === topBidId
              ? "bg-green-50 border-green-200"
              : ""
          }`}
        >
          {/* LEFT: AVATAR + NAME + BADGE + AMOUNT */}
          <div className="flex items-center gap-3">

            <img
              src={
                bid.bidder?.avatarUrl ||
                bid.bidder?.image ||
                "/default-avatar.png"
              }
              className="w-8 h-8 rounded-full object-cover border"
            />

            <div className="text-sm">

              <div className="flex items-center gap-2">

                <Link
                  href={`/user/${bid.bidder?.id}`}
                  className="font-medium hover:underline"
                >
                  {bid.bidder?.name || "Anonymous"}
                </Link>

                {/* 🏷️ Winning badge */}
                {bid.id === topBidId && (
                  <span className="text-[10px] bg-green-600 text-white px-2 py-0.5 rounded-full">
                    Winning
                  </span>
                )}

                {/* ✅ Verified badge */}
                {bid.bidder?.isVerifiedBidder && (
                  <span className="text-[10px] bg-green-100 text-green-700 px-2 py-0.5 rounded-full">
                    Verified
                  </span>
                )}

              </div>

              <div className="text-gray-600">
                ${bid.amount.toLocaleString()}
              </div>

            </div>

          </div>

          {/* RIGHT: TIME */}
          <span className="text-xs text-gray-500">
            {new Date(bid.createdAt).toLocaleString("en-US", {
              month: "short",
              day: "numeric",
              hour: "numeric",
              minute: "2-digit",
              timeZone: "America/Chicago",
            })}
          </span>

        </div>
      ))}
    </div>
  );
}