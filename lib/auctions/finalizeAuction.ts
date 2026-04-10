import { prisma } from "@/lib/db";

// ✅ NEW EMAILS
import { sendAuctionWonEmail } from "@/lib/email/sendAuctionWonEmail";
import { sendSellerWinnerEmail } from "@/lib/email/sendSellerWinnerEmail";

export async function finalizeAuction(auctionId: string) {
  const auction = await prisma.auction.findUnique({
    where: { id: auctionId },
    include: {
      bids: {
        orderBy: { amount: "desc" },
        take: 1,
      },
      seller: true,
    },
  });

  if (!auction) return;

  const highestBid = auction.bids[0];

  if (!highestBid) {
    // ❌ No bids → close auction
    await prisma.auction.update({
      where: { id: auctionId },
      data: {
        status: "CLOSED",
        result: "NO_SALE",
      },
    });

    return;
  }

  // 🔥 Get buyer (winner)
  const buyer = await prisma.user.findUnique({
    where: { id: highestBid.bidderId },
  });

  // ✅ Close auction
  await prisma.auction.update({
    where: { id: auctionId },
    data: {
      status: "CLOSED",
      winnerId: highestBid.bidderId,
      finalPrice: highestBid.amount,
      result: "SOLD",
    },
  });

  // 🚨 SEND PREMIUM EMAILS
  if (buyer && auction.seller) {
    try {
      // 📧 Seller → gets buyer info
      if (auction.seller.email) {
        await sendSellerWinnerEmail({
          to: auction.seller.email,
          address: auction.title,
          winningBid: highestBid.amount,
          buyerName: buyer.name || "Anonymous",
          buyerEmail: buyer.email || "",
        });
      }

      // 📧 Buyer → gets seller info
      if (buyer.email) {
        await sendAuctionWonEmail({
          to: buyer.email,
          address: auction.title,
          winningBid: highestBid.amount,
          sellerName: auction.seller.name || "Anonymous",
          sellerEmail: auction.seller.email || "",
        });
      }

    } catch (err) {
      console.error("Email error:", err);
    }
  }

  // 💬 CREATE INITIAL MESSAGE THREAD
  if (buyer && auction.seller) {
    try {
      await prisma.message.create({
        data: {
          auctionId: auction.id,
          senderId: buyer.id,
          receiverId: auction.seller.id,
          body: `Hi, I won this auction for $${highestBid.amount}. Looking forward to next steps.`,
        },
      });
    } catch (err) {
      console.error("Message creation error:", err);
    }
  }
}