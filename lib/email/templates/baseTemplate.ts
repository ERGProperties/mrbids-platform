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
                    src="https://mrbids.com/logo.png" 
                    alt="MrBids"
                    style="height:40px;"
                  />
                </td>
              </tr>

              <!-- BODY -->
              <tr>
                <td style="padding:30px;">
                  ${content}
                </td>
              </tr>

              <!-- FOOTER -->
              <tr>
                <td style="padding:20px; text-align:center; font-size:12px; color:#888; border-top:1px solid #eee;">
                  © ${new Date().getFullYear()} MrBids<br/>
                  Real-time real estate auctions
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