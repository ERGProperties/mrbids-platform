import { prisma } from "@/lib/prisma";
import Link from "next/link";

export default async function UserProfile({ params }: { params: { id: string } }) {
  const user = await prisma.user.findUnique({
    where: { id: params.id },
    include: {
      auctions: true,
      bids: {
        include: {
          auction: true
        }
      }
    }
  });

  if (!user) {
    return <div className="p-6">User not found</div>;
  }

  const wins = user.bids.filter(
    (b) => b.auction.result === "WINNER" && b.bidderId === user.id
  ).length;

  return (
    <div className="max-w-5xl mx-auto p-6">

      {/* HEADER */}
      <div className="flex items-center gap-5 border-b pb-6">

        <img
          src={user.avatarUrl || user.image || "/default-avatar.png"}
          className="w-20 h-20 rounded-full object-cover border"
        />

        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            {user.name || "Anonymous User"}

            {user.isVerifiedBidder && (
              <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full">
                Verified Buyer
              </span>
            )}
          </h1>

          <p className="text-gray-500 mt-1">
            {user.bio || "No bio yet"}
          </p>
        </div>

      </div>

      {/* STATS */}
      <div className="grid grid-cols-3 gap-4 mt-6">
        <Stat label="Listings" value={user.auctions.length} />
        <Stat label="Bids" value={user.bids.length} />
        <Stat label="Wins" value={wins} />
      </div>

      {/* LISTINGS */}
      <section className="mt-10">
        <h2 className="text-xl font-semibold mb-4">Listings</h2>

        {user.auctions.length === 0 ? (
          <p className="text-gray-500">No listings yet</p>
        ) : (
          <div className="space-y-3">
            {user.auctions.map((auction) => (
              <Link
                key={auction.id}
                href={`/auctions/${auction.slug}`}
                className="block p-4 border rounded-xl hover:bg-gray-50 transition"
              >
                <div className="font-medium">
                  {auction.title || "Untitled Property"}
                </div>

                <div className="text-sm text-gray-500 mt-1">
                  {auction.cityStateZip || ""}
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>

    </div>
  );
}

function Stat({ label, value }: { label: string; value: number }) {
  return (
    <div className="p-4 border rounded-xl text-center">
      <div className="text-xl font-bold">{value}</div>
      <div className="text-sm text-gray-500">{label}</div>
    </div>
  );
}