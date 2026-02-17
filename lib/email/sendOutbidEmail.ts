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
      <h2>You've been outbid</h2>
      <p>You were outbid on:</p>
      <p><strong>${address}</strong></p>
      <p>
        <a href="${auctionUrl}">
          Place a new bid
        </a>
      </p>
    `,
  })
}
