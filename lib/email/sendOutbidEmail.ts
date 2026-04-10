import { resend, EMAIL_FROM } from "./mailer";
import { baseTemplate } from "./templates/baseTemplate";

export async function sendOutbidEmail({
  to,
  address,
  auctionUrl,
}: {
  to: string;
  address: string;
  auctionUrl: string;
}) {
  const content = `
    <h2 style="margin-top:0;">You've been outbid</h2>

    <p style="font-size:16px; color:#333;">
      Someone placed a higher bid on:
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
        Place a New Bid
      </a>
    </div>

    <p style="font-size:14px; color:#666;">
      Stay competitive — auctions move fast.
    </p>
  `;

  await resend.emails.send({
    from: EMAIL_FROM,
    to,
    subject: "You've been outbid",
    html: baseTemplate({
      title: "You've been outbid",
      preview: "Someone placed a higher bid",
      content,
    }),
  });
}