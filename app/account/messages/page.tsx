import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import Link from "next/link";

export default async function MessagesPage() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.email) {
    redirect("/signin");
  }

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
  });

  if (!user) {
    redirect("/");
  }

  const messages = await prisma.message.findMany({
    where: {
      OR: [
        { senderId: user.id },
        { receiverId: user.id },
      ],
    },
    include: {
      auction: true,
      sender: true,
      receiver: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  // 🔥 Group by auction
  const threads = new Map();

  for (const msg of messages) {
    if (!threads.has(msg.auctionId)) {
      threads.set(msg.auctionId, msg);
    }
  }

  const threadList = Array.from(threads.values());

  return (
    <div className="max-w-4xl mx-auto p-6">

      <h1 className="text-2xl font-bold mb-6">
        Messages
      </h1>

      {threadList.length === 0 ? (
        <p className="text-gray-500">
          No messages yet.
        </p>
      ) : (
        <div className="space-y-3">
          {threadList.map((msg: any) => {
            const otherUser =
              msg.senderId === user.id
                ? msg.receiver
                : msg.sender;

            return (
              <Link
                key={msg.id}
                href={`/auctions/${msg.auction.slug}#auction-messages`}
                className="block border rounded-xl p-4 hover:bg-gray-50"
              >
                <div className="flex justify-between items-center">

                  <div>
                    <div className="font-medium">
                      {otherUser?.name || "User"}
                    </div>

                    <div className="text-sm text-gray-500 mt-1">
                      {msg.body.slice(0, 60)}...
                    </div>
                  </div>

                  <div className="text-xs text-gray-400">
                    {new Date(msg.createdAt).toLocaleDateString()}
                  </div>

                </div>

                <div className="text-xs text-gray-500 mt-2">
                  {msg.auction?.title || "Auction"}
                </div>

              </Link>
            );
          })}
        </div>
      )}

    </div>
  );
}