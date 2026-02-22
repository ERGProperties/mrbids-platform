export const dynamic = "force-dynamic";

import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { getAuctionReadiness } from "@/lib/sell/getAuctionReadiness";

export default async function SellerDashboard() {
  const drafts = await prisma.auction.findMany({
    where: {
      status: "DRAFT",
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return (
    <div className="max-w-4xl mx-auto p-8">
      <h1 className="text-2xl font-semibold mb-8">
        Seller Dashboard
      </h1>

      {drafts.length === 0 ? (
        <p className="text-gray-600">
          No draft auctions yet.
        </p>
      ) : (
        <div className="space-y-4">
          {drafts.map((auction) => {
            const readiness = getAuctionReadiness(auction);

            return (
              <div
                key={auction.id}
                className="border rounded-xl p-6 flex justify-between items-center"
              >
                <div>
                  {/* Title / Address fallback */}
                  <p className="font-medium">
                    {auction.title ||
                      auction.addressLine ||
                      "Untitled Draft"}
                  </p>

                  <p className="text-sm text-gray-500">
                    Created {auction.createdAt.toDateString()}
                  </p>

                  {/* Readiness */}
                  <p className="text-sm mt-2 text-gray-700">
                    {readiness.percent}% Ready to Publish
                  </p>

                  <div className="w-48 bg-gray-200 h-2 rounded-full mt-2 overflow-hidden">
                    <div
                      className="bg-black h-2 transition-all"
                      style={{
                        width: `${readiness.percent}%`,
                      }}
                    />
                  </div>

                  {readiness.missing.length > 0 && (
                    <p className="text-xs text-gray-500 mt-2">
                      Missing: {readiness.missing.join(", ")}
                    </p>
                  )}
                </div>

                <Link
                  href={`/sell/${auction.id}/step-1`}
                  className="px-4 py-2 bg-black text-white rounded-lg text-sm font-medium hover:bg-gray-900 transition"
                >
                  Resume
                </Link>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

