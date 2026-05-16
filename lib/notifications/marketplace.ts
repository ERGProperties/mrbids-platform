import { prisma } from "@/lib/prisma";
import { sendEmail } from "@/lib/email/sendEmail";

type NotifyOutbidParams = {
  auctionId: string;
  outbidUserId: string;
  newHighestBid: number;
};

type NotifyWinningBidderParams = {
  auctionId: string;
  winnerUserId: string;
};

type NotifySellerAuctionEndedParams = {
  auctionId: string;
};

export async function notifyOutbid({
  auctionId,
  outbidUserId,
  newHighestBid,
}: NotifyOutbidParams) {
  try {
    const auction = await prisma.marketplaceAuction.findUnique({
      where: {
        id: auctionId,
      },
      include: {
        seller: true,
      },
    });

    if (!auction) {
      console.error("Auction not found");
      return;
    }

    const user = await prisma.user.findUnique({
      where: {
        id: outbidUserId,
      },
    });

    if (!user?.email) {
      return;
    }

    const auctionUrl = `${process.env.NEXT_PUBLIC_APP_URL}/marketplace/${auction.id}`;

    await sendEmail({
      to: user.email,
      subject: `You've been outbid on ${auction.title}`,
      html: `
        <div style="font-family: Arial, sans-serif;">
          <h2>You've Been Outbid</h2>

          <p>Your bid is no longer the highest for:</p>

          <h3>${auction.title}</h3>

          <p>
            Current highest bid:
            <strong>$${newHighestBid.toLocaleString()}</strong>
          </p>

          <p>
            Place another bid before the auction ends.
          </p>

          <a
            href="${auctionUrl}"
            style="
              display:inline-block;
              padding:12px 20px;
              background:#000;
              color:#fff;
              text-decoration:none;
              border-radius:6px;
              margin-top:12px;
            "
          >
            View Auction
          </a>
        </div>
      `,
    });

    console.log("Outbid email sent");
  } catch (error) {
    console.error("notifyOutbid error:", error);
  }
}

export async function notifyWinningBidder({
  auctionId,
  winnerUserId,
}: NotifyWinningBidderParams) {
  try {
    const auction = await prisma.marketplaceAuction.findUnique({
      where: {
        id: auctionId,
      },
      include: {
        seller: true,
      },
    });

    if (!auction) {
      return;
    }

    const winner = await prisma.user.findUnique({
      where: {
        id: winnerUserId,
      },
    });

    if (!winner?.email) {
      return;
    }

    await sendEmail({
      to: winner.email,
      subject: `You won ${auction.title}`,
      html: `
        <div style="font-family: Arial, sans-serif;">
          <h2>Congratulations — You Won!</h2>

          <h3>${auction.title}</h3>

          <p>
            Winning bid:
            <strong>$${Number(auction.currentBid).toLocaleString()}</strong>
          </p>

          <p>
            Seller Contact:
          </p>

          <p>
            ${auction.seller.name || "Seller"}<br/>
            ${auction.seller.email}
          </p>

          <p>
            Please contact the seller to complete the transaction.
          </p>
        </div>
      `,
    });

    console.log("Winning bidder email sent");
  } catch (error) {
    console.error("notifyWinningBidder error:", error);
  }
}

export async function notifySellerAuctionEnded({
  auctionId,
}: NotifySellerAuctionEndedParams) {
  try {
    const auction = await prisma.marketplaceAuction.findUnique({
      where: {
        id: auctionId,
      },
      include: {
        seller: true,
        winner: true,
      },
    });

    if (!auction || !auction.seller?.email || !auction.winner) {
      return;
    }

    await sendEmail({
      to: auction.seller.email,
      subject: `Your auction has ended`,
      html: `
        <div style="font-family: Arial, sans-serif;">
          <h2>Your Auction Has Ended</h2>

          <h3>${auction.title}</h3>

          <p>
            Winning bid:
            <strong>$${Number(auction.currentBid).toLocaleString()}</strong>
          </p>

          <p>
            Winner Contact:
          </p>

          <p>
            ${auction.winner.name || "Winner"}<br/>
            ${auction.winner.email}
          </p>

          <p>
            Please contact the winner to complete the transaction.
          </p>
        </div>
      `,
    });

    console.log("Seller ended auction email sent");
  } catch (error) {
    console.error("notifySellerAuctionEnded error:", error);
  }
}