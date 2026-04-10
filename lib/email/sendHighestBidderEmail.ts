import { resend, EMAIL_FROM } from "./mailer";
import { baseTemplate } from "./templates/baseTemplate";

export async function sendHighestBidderEmail({
  to,
  address,
  auctionUrl,
}: {
  to: string;
  address: string;
  auctionUrl: string;
}) {
  const subject = "You're the highest bidder 🎉";

  const content = `
    <h2 style="margin-top:0;">You're the highest bidder 🎉</h2>

    <p style="font-size:16px;">
      You're currently winning:
    </p>

    <p style="font-size:18px; font-weight:bold; margin:20px 0;">
      ${address}
    </p>

    <div style="text-align:center; margin:30px 0;">
      <a 
        href="${auctionUrl}"
        style="
          display:inline-block;
          padding:14px 24px;
          background:#000;
          color:#fff;
          text-decoration:none;
          border-radius:8px;
          font-weight:bold;
        "
      >
        View Auction
      </a>
    </div>

    <p style="font-size:14px; color:#666;">
      Stay alert — other bidders may jump in at any time.
    </p>
  `;

  const html = baseTemplate({
    title: subject,
    preview: "You're currently winning this auction",
    content,
  });

  const text = `
You're the highest bidder!

Auction: ${address}

View auction:
${auctionUrl}
  `;

  await resend.emails.send({
    from: EMAIL_FROM,
    to,
    subject,
    html,
    text,
  });
}