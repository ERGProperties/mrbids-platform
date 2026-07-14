import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

import { prisma } from "@/lib/prisma";
import { authOptions } from "@/lib/authOptions";

import DashboardStats from "@/components/seller/DashboardStats";
import QuickActions from "@/components/seller/QuickActions";

export default async function SellerDashboardPage() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.email) {
    redirect("/signin");
  }

  const user = await prisma.user.findUnique({
    where: {
      email: session.user.email,
    },
  });

  if (!user) {
    redirect("/signin");
  }

  if (!user.isMarketplaceSeller) {
    redirect("/marketplace-sell");
  }

  const today = new Date();
  today.setHours(0, 0, 0, 0);

const tomorrow = new Date(today);
tomorrow.setDate(tomorrow.getDate() + 1);

const [
  activeAuctions,
  completedAuctions,
  endingToday,
  totalBids,
] = await Promise.all([

  prisma.marketplaceAuction.count({
    where: {
      sellerId: user.id,
      status: "LIVE",
    },
  }),

  prisma.marketplaceAuction.count({
    where: {
      sellerId: user.id,
      status: "ENDED",
    },
  }),

  prisma.marketplaceAuction.count({
    where: {
      sellerId: user.id,
      status: "LIVE",
      endAt: {
        gte: today,
        lt: tomorrow,
      },
    },
  }),

  prisma.marketplaceBid.count({
    where: {
      auction: {
        sellerId: user.id,
      },
    },
  }),

]);

  if (!user) {
    redirect("/coming-soon");
  }

  if (!user.isMarketplaceSeller) {
    redirect("/seller/onboarding");
  }

  return (
    <main className="min-h-screen bg-white">

      {/* HERO */}
      <section className="max-w-7xl mx-auto px-6 pt-32 pb-20">

        <div className="border rounded-[2rem] p-8 md:p-12">

          <div className="flex flex-col md:flex-row md:items-center gap-8">

            {/* AVATAR */}
            <div>

              {user.avatarUrl ? (

                <img
                  src={user.avatarUrl}
                  alt={user.name || "Seller"}
                  className="w-32 h-32 rounded-full object-cover border"
                />

              ) : (

                <div className="w-32 h-32 rounded-full bg-gray-100 flex items-center justify-center text-3xl font-semibold text-gray-500">
                  {user.name?.charAt(0) || "M"}
                </div>

              )}

            </div>

            {/* SELLER INFO */}
            <div className="flex-1">

              <p className="text-sm font-medium text-gray-500 uppercase tracking-[0.18em] mb-4">
                Seller Dashboard
              </p>

              <h1 className="text-5xl font-semibold leading-tight">
                {user.name || "Marketplace Seller"}
              </h1>

              {user.username && (
                <p className="mt-3 text-xl text-gray-500 font-medium">
                  @{user.username}
                </p>
              )}

              <div className="mt-5 flex flex-wrap gap-3">

                <span className="px-4 py-2 rounded-full bg-black text-white text-sm font-medium">
                  {user.sellerCategory || "Seller"}
                </span>

                <span className="px-4 py-2 rounded-full border text-sm font-medium">
                  ACTIVE SELLER
                </span>

              </div>

              {user.tiktokUsername && (

                <p className="mt-6 text-lg text-gray-600">
                  TikTok:{" "}
                  <span className="font-medium">
                    {user.tiktokUsername}
                  </span>
                </p>

              )}

            </div>

          </div>

          {/* BIO */}
          <div className="mt-14">

            <p className="text-sm font-medium text-gray-500 uppercase tracking-[0.18em] mb-4">
              Seller Bio
            </p>

            <div className="border rounded-2xl bg-gray-50 p-6 text-gray-700 leading-relaxed text-lg">
              {user.sellerBio || "No seller bio yet."}
            </div>

          </div>

          {/* DASHBOARD STATS */}
          <DashboardStats
            activeAuctions={activeAuctions}
            endingToday={endingToday}
            completedAuctions={completedAuctions}
            totalBids={totalBids}
          />

          {/* QUICK ACTIONS */}
          <QuickActions
            username={user.username}
          />

        </div>

      </section>

    </main>
  );
}