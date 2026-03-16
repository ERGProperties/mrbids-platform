import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendQuestionNotification({
  sellerEmail,
  auctionTitle,
  question,
  auctionUrl,
}: {
  sellerEmail: string;
  auctionTitle: string;
  question: string;
  auctionUrl: string;
}) {
  await resend.emails.send({
    from: "MrBids <notifications@mrbids.com>",
    to: sellerEmail,
    subject: "New question on your auction",
    html: `
      <h2>New Question on Your Auction</h2>

      <p><strong>${auctionTitle}</strong></p>

      <p>A bidder asked:</p>

      <blockquote>${question}</blockquote>

      <p>
        <a href="${auctionUrl}">View Auction</a>
      </p>

      <p>Reply on MrBids to keep bidders engaged.</p>
    `,
  });
}