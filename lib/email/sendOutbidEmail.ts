import { resend, EMAIL_FROM } from "./mailer"

export async function sendOutbidEmail({
  to,
  address,
  auctionUrl,
}: {
  to: string
  address: string
  auctionUrl: string
}) {
  await resend.emails.send({
    from: EMAIL_FROM,
    to,
    subject: "You've been outbid",
    html: `
      <div style="font-family: Arial, sans-serif; background-color: #f5f7fb; padding: 20px;">
        <div style="max-width: 600px; margin: auto; background: #ffffff; border-radius: 10px; overflow: hidden; box-shadow: 0 5px 20px rgba(0,0,0,0.08);">
          
          <!-- Header -->
          <div style="background: #0f172a; color: white; text-align: center; padding: 20px;">
            <img src="https://yourdomain.com/logo.png" style="max-width: 140px;" alt="MrBids Logo" />
          </div>

          <!-- Content -->
          <div style="padding: 30px; color: #333;">
            <h2 style="margin-top: 0;">You've been outbid</h2>
            
            <p style="font-size: 16px;">
              Someone just placed a higher bid on:
            </p>

            <p style="font-size: 18px; font-weight: bold; margin: 15px 0;">
              ${address}
            </p>

            <p style="color: #dc2626; font-weight: bold;">
              Act fast before the auction ends.
            </p>

            <div style="margin-top: 25px;">
              <a href="${auctionUrl}" 
                 style="display: inline-block; padding: 14px 22px; background: #2563eb; color: #ffffff; text-decoration: none; border-radius: 6px; font-weight: bold;">
                Place a New Bid
              </a>
            </div>
          </div>

          <!-- Footer -->
          <div style="text-align: center; font-size: 12px; color: #888; padding: 20px; background: #f1f5f9;">
            © ${new Date().getFullYear()} MrBids — Real Estate Auctions Made Simple<br/>
            You’re receiving this because you have an account on MrBids
          </div>

        </div>
      </div>
    `,
  })
}