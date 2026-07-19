export function baseTemplate({
  title,
  preview,
  content,
}: {
  title: string;
  preview?: string;
  content: string;
}) {
  return `
  <!DOCTYPE html>
  <html>
    <head>
      <meta charset="UTF-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <title>${title}</title>
    </head>

    <body style="margin:0; padding:0; background:#f5f5f5; font-family:Arial, sans-serif;">

      <!-- PREVIEW TEXT -->
      <div style="display:none; max-height:0; overflow:hidden;">
        ${preview || ""}
      </div>

      <table width="100%" cellpadding="0" cellspacing="0">
        <tr>
          <td align="center" style="padding:40px 0;">

            <!-- CONTAINER -->
            <table width="600" style="background:#ffffff; border-radius:12px; overflow:hidden;">

              <!-- HEADER -->
              <tr>
                <td style="padding:20px; text-align:center; border-bottom:1px solid #eee;">
                  <img
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

              <!-- BODY -->
              <tr>
                <td style="padding:30px;">
                  ${content}
                </td>
              </tr>

              <!-- APP SECTION -->
              <tr>
                <td
                  style="
                    padding:30px;
                    text-align:center;
                    background:#fafafa;
                    border-top:1px solid #eee;
                    border-bottom:1px solid #eee;
                  "
                >

                  <div
                    style="
                      font-size:22px;
                      font-weight:bold;
                      color:#111827;
                      margin-bottom:10px;
                    "
                  >
                    📱 Take MrBids Anywhere
                  </div>

                  <div
                    style="
                      font-size:15px;
                      color:#555;
                      line-height:1.6;
                      margin-bottom:20px;
                    "
                  >
                    Receive instant outbid alerts, watch auctions end live,
                    and bid from anywhere with the official MrBids app.
                  </div>

                  <a
                    href="https://apps.apple.com/us/app/mrbids-auctions/id6782255893"
                    target="_blank"
                    style="display:inline-block; margin:0 8px 12px 8px;"
                  >
                    <img
                      src="https://mrbids.com/images/app-store-badge.svg"
                      alt="Download on the App Store"
                      style="height:50px;"
                    />
                  </a>

                  <a
                    href="https://play.google.com/store/apps/details?id=com.mrbids.app"
                    target="_blank"
                    style="display:inline-block; margin:0 8px 12px 8px;"
                  >
                    <img
                      src="https://mrbids.com/images/google-play-badge.png"
                      alt="Get it on Google Play"
                      style="height:50px;"
                    />
                  </a>

                </td>
              </tr>

              <!-- FOOTER -->
              <tr>
                <td
                  style="
                    padding:20px;
                    text-align:center;
                    font-size:12px;
                    color:#888;
                  "
                >
                  © ${new Date().getFullYear()} MrBids<br/>
                  Marketplace & Real Estate Auctions<br/><br/>

                  <a
                    href="https://mrbids.com"
                    style="color:#2563eb; text-decoration:none;"
                  >
                    www.mrbids.com
                  </a>

                </td>
              </tr>

            </table>

          </td>
        </tr>
      </table>

    </body>
  </html>
  `;
}