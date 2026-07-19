import { resend, EMAIL_FROM } from "./mailer";
import { emailFooter } from "./templates/emailFooter";

export async function sendOutbidEmail({
  to,
  address,
  auctionUrl,
  coverImage,
}: {
  to: string;
  address: string;
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

                <h1 style="margin:0 0 12px; font-size:22px; font-weight:700;">
                  🔔 You've been outbid
                </h1>

                <p style="font-size:16px; color:#444; line-height:1.6;">
                  Another bidder has placed a higher bid on the auction below.
                  If you still want to win, place another bid before the auction ends.
                </p>

                <p style="font-size:18px; font-weight:600; margin:20px 0;">
                  ${address}
                </p>

                <p style="font-size:15px; color:#666;">
                  Auctions can change quickly—don't miss your chance to take the lead again.
                </p>

                <div style="text-align:center; margin:30px 0;">
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
                    Place a New Bid
                  </a>
                </div>

                <p style="font-size:13px; color:#888; text-align:center;">
                  Good luck, and thanks for bidding with MrBids!
                </p>

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
    subject: "🔔 You've been outbid on MrBids",
    html,
  });
}