import { resend, EMAIL_FROM } from "./mailer";
import { emailFooter } from "./templates/emailFooter";

export async function sendPaymentReminderEmail({
  to,
  auctionTitle,
  amount,
  paymentUrl,
  coverImage,
}: {
  to: string;
  auctionTitle: string;
  amount: number;
  paymentUrl: string;
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

            <!-- IMAGE -->
            ${
              coverImage
                ? `
            <tr>
              <td>
                <img
                  src="${coverImage}"
                  alt="${auctionTitle}"
                  style="width:100%; max-height:320px; object-fit:cover; display:block;"
                />
              </td>
            </tr>
            `
                : ""
            }

            <!-- BODY -->
            <tr>
              <td style="padding:34px 28px;">

                <h1 style="margin:0 0 14px; font-size:24px; font-weight:700;">
                  Complete Your Payment
                </h1>

                <p style="font-size:16px; color:#444; line-height:1.6;">
                  You won this marketplace auction, but payment has not been completed yet.
                </p>

                <div style="margin:28px 0; padding:22px; background:#fafafa; border-radius:12px;">

                  <p style="margin:0 0 10px; font-size:14px; color:#666;">
                    Auction
                  </p>

                  <p style="margin:0; font-size:20px; font-weight:700;">
                    ${auctionTitle}
                  </p>

                  <p style="margin:20px 0 0; font-size:14px; color:#666;">
                    Amount Due
                  </p>

                  <p style="margin:6px 0 0; font-size:28px; font-weight:700;">
                    $${amount.toLocaleString()}
                  </p>

                </div>

                <div style="text-align:center; margin:34px 0;">

                  <a
                    href="${paymentUrl}"
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
                    Complete Payment
                  </a>

                </div>

                <p style="font-size:14px; color:#777; line-height:1.6;">
                  Sellers may relist unpaid auctions, so complete your purchase as soon as possible.
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
    subject: "Complete your MrBids auction payment",
    html,
  });

}