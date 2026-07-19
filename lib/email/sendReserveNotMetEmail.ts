import { resend, EMAIL_FROM } from "./mailer";
import { emailFooter } from "./templates/emailFooter";

export async function sendReserveNotMetEmail({
  to,
  address,
  highestBid,
  auctionUrl,
  coverImage,
}: {
  to: string;
  address: string;
  highestBid: number;
  auctionUrl: string;
  coverImage?: string;
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
                <img
                  src="https://mrbids.com/logo-header.png"
                  alt="MrBids"
                  style="
                    width:100%;
                    max-width:420px;
                    height:auto;
                  "
                />
              </td>
            </tr>

            <!-- COVER IMAGE -->
            ${
              coverImage
                ? `
            <tr>
              <td style="padding:0;">
                <a href="${auctionUrl}">
                  <img
                    src="${coverImage}"
                    alt="${address}"
                    style="
                      width:100%;
                      max-height:320px;
                      object-fit:cover;
                      display:block;
                    "
                  />
                </a>
              </td>
            </tr>
            `
                : ""
            }

            <!-- BODY -->
            <tr>
              <td style="padding:34px 28px;">

                <h1 style="margin:0 0 14px; font-size:24px; font-weight:700;">
                  Reserve Price Not Met
                </h1>

                <p style="font-size:16px; color:#444; line-height:1.6;">
                  Thank you for participating in this auction. Although you placed the highest bid, the seller's reserve price was not reached, so the auction ended without an automatic sale.
                </p>

                <p style="font-size:18px; font-weight:700; margin:24px 0;">
                  ${address}
                </p>

                <div style="margin:28px 0; padding:22px; background:#fafafa; border-radius:12px;">

                  <p style="margin:0; font-size:14px; color:#666;">
                    Your Highest Bid
                  </p>

                  <p style="margin:8px 0 0; font-size:30px; font-weight:700;">
                    $${highestBid.toLocaleString()}
                  </p>

                </div>

                <p style="font-size:15px; color:#555; line-height:1.7;">
                  The seller may still review your offer and decide to contact you directly if they wish to negotiate or complete the sale.
                </p>

                <div style="text-align:center; margin:34px 0;">

                  <a
                    href="${auctionUrl}"
                    style="
                      display:inline-block;
                      padding:16px 34px;
                      background:#000;
                      color:#fff;
                      text-decoration:none;
                      border-radius:10px;
                      font-weight:700;
                      font-size:16px;
                    "
                  >
                    View Auction
                  </a>

                </div>

              </td>
            </tr>

            ${emailFooter()}

          </table>

        </td>
      </tr>
    </table>

  </div>
  `;

  await resend.emails.send({
    from: EMAIL_FROM,
    to,
    subject: "Reserve price not met — thank you for bidding",
    html,
  });
}