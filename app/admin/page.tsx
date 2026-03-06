import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";

export default async function AdminPage() {

  const session = await getServerSession(authOptions);

  // If not logged in → go to signin
  if (!session) {
    redirect("/signin");
  }

  // Only allow admins
  if (session.user.role !== "ADMIN") {
    redirect("/auctions");
  }

  const auctions = await prisma.auction.findMany({
    orderBy: { createdAt: "desc" },
    take: 10,
    include: {
      seller: true,
      bids: true,
    },
  });

  const sellers = await prisma.user.findMany({
    where: {
      auctions: {
        some: {},
      },
    },
    include: {
      auctions: true,
    },
  });

  const bids = await prisma.bid.findMany({
    orderBy: { createdAt: "desc" },
    take: 10,
    include: {
      auction: true,
      bidder: true,
    },
  });

  return (
    <div className="max-w-6xl mx-auto p-8 space-y-12">

      <h1 className="text-2xl font-semibold">
        Admin Dashboard
      </h1>

      {/* Auctions */}
      <div>
        <h2 className="text-lg font-semibold mb-4">
          Recent Auctions
        </h2>

        <div className="border rounded-lg overflow-hidden">
          <table className="w-full text-sm">

            <thead className="bg-gray-100">
              <tr>
                <th className="p-3 text-left">Title</th>
                <th className="p-3 text-left">Status</th>
                <th className="p-3 text-left">Bids</th>
                <th className="p-3 text-left">Seller</th>
              </tr>
            </thead>

            <tbody>
              {auctions.map((a) => (
                <tr key={a.id} className="border-t">
                  <td className="p-3">{a.title}</td>
                  <td className="p-3">{a.status}</td>
                  <td className="p-3">{a.bids.length}</td>
                  <td className="p-3">{a.seller?.email || "—"}</td>
                </tr>
              ))}
            </tbody>

          </table>
        </div>
      </div>

      {/* Sellers */}
      <div>
        <h2 className="text-lg font-semibold mb-4">
          Sellers
        </h2>

        <div className="border rounded-lg overflow-hidden">
          <table className="w-full text-sm">

            <thead className="bg-gray-100">
              <tr>
                <th className="p-3 text-left">Seller</th>
                <th className="p-3 text-left">Auctions Listed</th>
              </tr>
            </thead>

            <tbody>
              {sellers.map((s) => (
                <tr key={s.id} className="border-t">
                  <td className="p-3">{s.email}</td>
                  <td className="p-3">{s.auctions.length}</td>
                </tr>
              ))}
            </tbody>

          </table>
        </div>
      </div>

      {/* Bids */}
      <div>
        <h2 className="text-lg font-semibold mb-4">
          Recent Bids
        </h2>

        <div className="border rounded-lg overflow-hidden">
          <table className="w-full text-sm">

            <thead className="bg-gray-100">
              <tr>
                <th className="p-3 text-left">Auction</th>
                <th className="p-3 text-left">Bid</th>
                <th className="p-3 text-left">Bidder</th>
              </tr>
            </thead>

            <tbody>
              {bids.map((b) => (
                <tr key={b.id} className="border-t">
                  <td className="p-3">{b.auction.title}</td>
                  <td className="p-3">${b.amount.toLocaleString()}</td>
                  <td className="p-3">{b.bidder.email}</td>
                </tr>
              ))}
            </tbody>

          </table>
        </div>
      </div>

    </div>
  );
}