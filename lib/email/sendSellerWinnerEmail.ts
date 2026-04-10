import { resend, EMAIL_FROM } from "./mailer";

export async function sendSellerWinnerEmail({
  to,
  address,
  winningBid,
  buyerName,
  buyerEmail,
}: {
  to: string;
  address: string;
  winningBid: number;
  buyerName: string;
  buyerEmail: string;
}) {
  const html = `
  <div style="margin:0; padding:0; background:#f4f4f5; font-family:-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Arial, sans-serif;">

    <table width="100%" cellpadding="0" cellspacing="0">
      <tr>
        <td align="center" style="padding:40px 16px;">

          <table width="100%" style="max-width:600px; background:#ffffff; border-radius:14px; overflow:hidden; box-shadow:0 8px 24px rgba(0,0,0,0.08);">

            <!-- HEADER -->
            <tr>
              <td style="padding:32px 20px; text-align:center; border-bottom:1px solid #f1f1f1;">
                <img src="https://mrbids.com/logo.png" style="height:60px;" />
              </td>
            </tr>

            <!-- BODY -->
            <tr>
              <td style="padding:34px 28px;">

                <h1 style="font-size:22px; font-weight:700;">
                  Your auction has ended
                </h1>

                <p style="font-size:16px; color:#444;">
                  Your property has a winning bidder:
                </p>

                <p style="font-size:18px; font-weight:600; margin:20px 0;">
                  ${address}
                </p>

                <p style="font-size:16px; font-weight:600;">
                  Final bid: $${winningBid.toLocaleString()}
                </p>

                <hr style="margin:30px 0; border:none; border-top:1px solid #eee;" />

                <p style="font-size:15px;">
                  <strong>Buyer Details:</strong>
                </p>

                <div style="margin:20px 0; padding:16px; background:#f9f9f9; border-radius:8px;">
                  <p style="margin:0; font-size:14px;"><strong>Name:</strong> ${buyerName}</p>
                  <p style="margin:6px 0 0; font-size:14px;">
                    <strong>Email:</strong> 
                    <a href="mailto:${buyerEmail}">${buyerEmail}</a>
                  </p>
                </div>

                <p style="font-size:13px; color:#777;">
                  Please contact the buyer to proceed with closing the deal.
                </p>

              </td>
            </tr>

            <!-- FOOTER -->
            <tr>
              <td style="padding:22px; text-align:center; border-top:1px solid #f1f1f1;">
                <p style="font-size:13px; color:#555;">
                  MrBids — Real-time real estate auctions
                </p>
                <p style="font-size:12px; color:#888;">
                  Built for investors, wholesalers, and dealmakers
                </p>
              </td>
            </tr>

          </table>

        </td>
      </tr>
    </table>

  </div>
  `;

  await resend.emails.send({
    from: EMAIL_FROM,
    to,
    subject: "Auction complete — winning bidder details",
    html,
  });
}