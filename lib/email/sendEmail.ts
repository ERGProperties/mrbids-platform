import { Resend } from "resend";

const resend = new Resend(process.env.re_Sn7eHJXL_HnHGBkT1sBtCPYuNwpNthVCn);

export async function sendEmail({
  to,
  subject,
  text,
}: {
  to: string;
  subject: string;
  text: string;
}) {
  await resend.emails.send({
    from: "MrBids <noreply@mrbids.com>",
    to,
    subject,
    text,
  });
}