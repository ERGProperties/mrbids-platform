import { redirect } from "next/navigation";
import Link from "next/link";
import { getServerSession } from "next-auth";
import ManageAuctionControls from "@/components/dashboard/ManageAuctionControls";

import { authOptions } from "@/lib/authOptions";
import { prisma } from "@/lib/prisma";

export default async function ManageAuctionPage({
  params,
}: {
  params: {
    id: string;
  };
}) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    redirect("/signin");
  }

  const auction =
    await prisma.marketplaceAuction.findUnique({
      where: {
        id: params.id,
      },
      include: {
        winner: true,
      },
    });

  if (!auction) {
    redirect("/dashboard");
  }

  if (auction.sellerId !== session.user.id) {
    redirect("/dashboard");
  }

  return (
    <main className="min-h-screen bg-gray-50 py-20">
      <div className="mx-auto max-w-5xl px-6">

        <div className="mb-10 flex items-center justify-between">

          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-gray-500">
              Seller Dashboard
            </p>

            <h1 className="mt-2 text-4xl font-bold">
              Manage Auction
            </h1>
          </div>

          <Link
            href="/dashboard"
            className="rounded-xl border border-gray-300 px-5 py-3 font-medium transition hover:bg-gray-100"
          >
            ← Back to Dashboard
          </Link>

        </div>

        <div className="rounded-3xl border border-gray-200 bg-white p-8 shadow-sm">

          <h2 className="text-3xl font-bold">
            {auction.title}
          </h2>

          <div className="mt-8 grid gap-6 md:grid-cols-2">

            <div>
              <p className="text-sm text-gray-500">
                Status
              </p>

              <p className="mt-1 text-xl font-semibold">
                {auction.status}
              </p>
            </div>

            <div>
              <p className="text-sm text-gray-500">
                Current Bid
              </p>

              <p className="mt-1 text-xl font-semibold">
                ${auction.currentBid.toLocaleString()}
              </p>
            </div>

            <div>
              <p className="text-sm text-gray-500">
                Total Bids
              </p>

              <p className="mt-1 text-xl font-semibold">
                {auction.bidCount}
              </p>
            </div>

            <div>
              <p className="text-sm text-gray-500">
                Restart Mode
              </p>

              <p className="mt-1 text-xl font-semibold">
                {auction.restartMode}
              </p>
            </div>

          </div>

        </div>

        <div className="mt-10">

          <ManageAuctionControls
            auctionId={auction.id}
            restartMode={auction.restartMode}
          />

        </div>

      </div>
    </main>
  );
}