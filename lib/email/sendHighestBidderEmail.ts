import { resend, EMAIL_FROM } from "./mailer";

export async function sendHighestBidderEmail({
  to,
  address,
  bidAmount,
  auctionUrl,
  coverImage,
}: {
  to: string;
  address: string;
  bidAmount: number;
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
                  src="https://mrbids.com/logo.png"
                  alt="MrBids"
                  style="height:60px;"
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
                  You're in the lead 🎉
                </h1>

                <p style="font-size:16px; color:#444;">
                  You're currently the highest bidder on:
                </p>

                <p style="font-size:18px; font-weight:600; margin:20px 0;">
                  ${address}
                </p>

                <p style="font-size:16px; color:#000; font-weight:600;">
                  Your bid: $${bidAmount.toLocaleString()}
                </p>

                <p style="font-size:14px; color:#666; margin-top:10px;">
                  Stay alert — other bidders may try to take the lead.
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
                    View Auction
                  </a>
                </div>

              </td>
            </tr>

            <!-- APP DOWNLOAD -->
            <tr>
              <td
                style="
                  padding:30px;
                  text-align:center;
                  background:#fafafa;
                  border-top:1px solid #f1f1f1;
                  border-bottom:1px solid #f1f1f1;
                "
              >

                <h2
                  style="
                    margin:0 0 12px;
                    font-size:22px;
                    color:#111827;
                  "
                >
                  Take MrBids Anywhere
                </h2>

                <p
                  style="
                    margin:0 0 24px;
                    color:#666;
                    font-size:15px;
                    line-height:1.6;
                  "
                >
                  Receive instant outbid alerts, watch auctions end live,
                  and bid from anywhere with the official MrBids app.
                </p>

                <a
                  href="https://apps.apple.com/us/app/mrbids-auctions/id6782255893"
                  target="_blank"
                  style="display:inline-block; margin:0 8px 12px;"
                >
                  <img
                    src="https://mrbids.com/images/app-store-badge.svg"
                    alt="Download on the App Store"
                    style="width:176px; height:auto;"
                  />
                </a>

                <a
                  href="https://play.google.com/store/apps/details?id=com.mrbids.app"
                  target="_blank"
                  style="display:inline-block; margin:0 8px 12px;"
                >
                  <img
                    src="https://mrbids.com/images/google-play-badge.png"
                    alt="Get it on Google Play"
                    style="width:176px; height:auto;"
                  />
                </a>

                <div style="height:8px;"></div>

              </td>
            </tr>

            <!-- FOOTER -->
            <tr>
              <td
                style="
                  padding:24px;
                  text-align:center;
                  background:#ffffff;
                "
              >

                <p style="margin:0; font-size:13px; color:#555;">
                  <strong>MrBids</strong><br/>
                  Marketplace & Real Estate Auctions
                </p>

                <p
                  style="
                    margin:12px 0 0;
                    font-size:12px;
                    color:#888;
                    line-height:1.7;
                  "
                >
                  © ${new Date().getFullYear()} MrBids<br/>

                  <a
                    href="https://mrbids.com"
                    style="color:#2563eb; text-decoration:none;"
                  >
                    www.mrbids.com
                  </a>
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
    subject: "You're the highest bidder 🎉",
    html,
  });
}