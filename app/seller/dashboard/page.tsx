import Link from "next/link";
import { getServerSession } from "next-auth";

import { authOptions } from "@/lib/authOptions";
import { prisma } from "@/lib/prisma";

import { redirect } from "next/navigation";

export default async function SellerDashboardPage() {

  const session = await getServerSession(authOptions);

  if (!session?.user?.email) {
    redirect("/coming-soon");
  }

  const user = await prisma.user.findUnique({
    where: {
      email: session.user.email,
    },
  });

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

        <div className="max-w-3xl">

          <p className="text-sm font-medium text-gray-500 uppercase tracking-[0.18em] mb-6">
            Seller Dashboard
          </p>

          <h1 className="text-5xl md:text-7xl font-semibold leading-[1.02]">
            Welcome Back
          </h1>

          <p className="mt-8 text-xl text-gray-600">
            Manage your LIVE marketplace auctions and seller activity.
          </p>

        </div>

      </section>

      {/* SELLER INFO */}
      <section className="pb-24">

        <div className="max-w-7xl mx-auto px-6">

          <div className="border rounded-3xl p-8 md:p-12">

            <div className="grid md:grid-cols-3 gap-10">

              <div>

                <p className="text-sm text-gray-500 mb-2">
                  Seller Category
                </p>

                <p className="text-2xl font-semibold">
                  {user.sellerCategory || "—"}
                </p>

              </div>

              <div>

                <p className="text-sm text-gray-500 mb-2">
                  TikTok Username
                </p>

                <p className="text-2xl font-semibold">
                  {user.tiktokUsername || "—"}
                </p>

              </div>

              <div>

                <p className="text-sm text-gray-500 mb-2">
                  Seller Status
                </p>

                <p className="text-2xl font-semibold text-green-600">
                  ACTIVE
                </p>

              </div>

            </div>

            <div className="mt-14">

              <p className="text-sm text-gray-500 mb-4">
                Seller Bio
              </p>

              <div className="border rounded-2xl p-6 text-gray-700 leading-relaxed">
                {user.sellerBio || "No seller bio yet."}
              </div>

            </div>

            {/* CTA */}
            <div className="mt-14 flex flex-wrap gap-4">

              <button className="px-8 py-4 rounded-full bg-black text-white">
                Create Marketplace Auction
              </button>

              <Link
                href="/live"
                className="px-8 py-4 rounded-full border"
              >
                Browse LIVE Auctions
              </Link>

            </div>

          </div>

        </div>

      </section>

    </main>
  );
}