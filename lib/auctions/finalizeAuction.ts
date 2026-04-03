import { prisma } from "@/lib/db";
import { sendEmail } from "@/lib/email/sendEmail";

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

  // 🚨 SEND EMAILS
  if (buyer && auction.seller) {
    try {
      // 📧 Email seller
      if (auction.seller.email) {
        await sendEmail({
          to: auction.seller.email,
          subject: "Your auction has ended 🎉",
          text: `
Your auction has ended.

Winning Bid: $${highestBid.amount}

Buyer:
${buyer.name || "Anonymous"}
${buyer.email}
          `,
        });
      }

      // 📧 Email buyer
      if (buyer.email) {
        await sendEmail({
          to: buyer.email,
          subject: "You won the auction 🎉",
          text: `
Congratulations! You won the auction.

Winning Bid: $${highestBid.amount}

Seller:
${auction.seller.name || "Anonymous"}
${auction.seller.email}
          `,
        });
      }

    } catch (err) {
      console.error("Email error:", err);
    }
  }

  // 💬 CREATE INITIAL MESSAGE THREAD (NEW 🔥)
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