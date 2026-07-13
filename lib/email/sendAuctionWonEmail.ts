import { resend, EMAIL_FROM } from "./mailer";
import { emailFooter } from "./templates/emailFooter";

export async function sendAuctionWonEmail({
  to,
  address,
  winningBid,
  sellerName,
  sellerEmail,
  auctionUrl,
  coverImage,
  shippingCost,
  shippingLabel,
  freeShipping,
  localPickup,
}: {
  to: string;
  address: string;
  winningBid: number;
  sellerName: string;
  sellerEmail: string;
  auctionUrl: string;
  coverImage?: string;
  shippingCost?: number;
  shippingLabel?: string;
  freeShipping?: boolean;
  localPickup?: boolean;
}) {
  const shippingAmount = (shippingCost || 0) / 100;

  const totalDue = winningBid + shippingAmount;

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

                <h1 style="font-size:24px; font-weight:700; margin-top:0;">
                  🎉 You won the auction
                </h1>

                <p style="font-size:16px; color:#444;">
                  Congratulations — you secured the winning bid on:
                </p>

                <p style="font-size:18px; font-weight:600; margin:20px 0;">
                  ${address}
                </p>

                <!-- PAYMENT SUMMARY -->
                <div style="margin:28px 0; padding:22px; background:#f9fafb; border:1px solid #e5e7eb; border-radius:12px;">

                  <p style="margin:0 0 14px; font-size:18px; font-weight:700;">
                    Payment Summary
                  </p>

                  <div style="display:flex; justify-content:space-between; margin-bottom:10px;">
                    <span style="font-size:15px; color:#555;">
                      Winning Bid
                    </span>

                    <span style="font-size:15px; font-weight:600;">
                      $${winningBid.toLocaleString()}
                    </span>
                  </div>

                  ${
                    freeShipping
                      ? `
                  <div style="display:flex; justify-content:space-between; margin-bottom:10px;">
                    <span style="font-size:15px; color:#555;">
                      Shipping
                    </span>

                    <span style="font-size:15px; font-weight:600; color:#16a34a;">
                      Free
                    </span>
                  </div>
                  `
                      : localPickup
                      ? `
                  <div style="display:flex; justify-content:space-between; margin-bottom:10px;">
                    <span style="font-size:15px; color:#555;">
                      Delivery
                    </span>

                    <span style="font-size:15px; font-weight:600; color:#2563eb;">
                      Local Pickup
                    </span>
                  </div>
                  `
                      : `
                  <div style="display:flex; justify-content:space-between; margin-bottom:10px;">
                    <span style="font-size:15px; color:#555;">
                      ${shippingLabel || "Shipping"}
                    </span>

                    <span style="font-size:15px; font-weight:600;">
                      $${shippingAmount.toFixed(2)}
                    </span>
                  </div>
                  `
                  }

                  <hr style="margin:18px 0; border:none; border-top:1px solid #e5e7eb;" />

                  <div style="display:flex; justify-content:space-between;">
                    <span style="font-size:18px; font-weight:700;">
                      Total Due
                    </span>

                    <span style="font-size:18px; font-weight:700;">
                      $${totalDue.toLocaleString()}
                    </span>
                  </div>

                </div>

                <!-- PAYMENT CTA -->
                <div style="margin:34px 0; padding:24px; background:#f9fafb; border:1px solid #e5e7eb; border-radius:12px; text-align:center;">

                  <p style="font-size:16px; color:#111827; margin-top:0; margin-bottom:18px; font-weight:600;">
                    Complete your payment to finalize this purchase.
                  </p>

                  <a
                    href="${auctionUrl}"
                    style="
                      display:inline-block;
                      padding:16px 34px;
                      background:#16a34a;
                      color:#ffffff;
                      text-decoration:none;
                      border-radius:10px;
                      font-weight:700;
                      font-size:16px;
                    "
                  >
                    Complete Payment
                  </a>

                </div>

                <div style="text-align:center; margin:26px 0;">
                  <a
                    href="${auctionUrl}"
                    style="
                      display:inline-block;
                      padding:14px 28px;
                      background:#000;
                      color:#fff;
                      text-decoration:none;
                      border-radius:10px;
                      font-weight:700;
                      font-size:15px;
                    "
                  >
                    View Auction
                  </a>
                </div>

                <hr style="margin:30px 0; border:none; border-top:1px solid #eee;" />

                <p style="font-size:15px; color:#444;">
                  <strong>Seller Information</strong>
                </p>

                <div style="margin:20px 0; padding:16px; background:#f9f9f9; border-radius:8px;">

                  <p style="margin:0; font-size:14px;">
                    <strong>Seller:</strong> ${sellerName}
                  </p>

                  <p style="margin:6px 0 0; font-size:14px;">
                    <strong>Email:</strong>

                    <a href="mailto:${sellerEmail}">
                      ${sellerEmail}
                    </a>
                  </p>

                </div>

                <p style="font-size:13px; color:#777;">
                  Once payment is completed, coordinate directly with the seller regarding shipping, delivery, pickup, or transaction details.
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
    subject: "🎉 You won the auction — Complete Payment",
    html,
  });
}