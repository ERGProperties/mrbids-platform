import EmailProvider from "next-auth/providers/email";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { prisma } from "@/lib/prisma";
import type { NextAuthOptions } from "next-auth";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),

  providers: [
    EmailProvider({
      from: process.env.EMAIL_FROM!,

      async sendVerificationRequest({ identifier, url, provider }) {
        // 🔥 DEBUG LOG (check Vercel logs)
        console.log("🔥 SEND VERIFICATION CALLED", identifier);

        await resend.emails.send({
          from: provider.from!,
          to: identifier,
          subject: "Sign in to MrBids",
          html: `
            <div style="font-family: Arial, sans-serif; line-height:1.5;">
              <h2>Sign in to MrBids</h2>
              <p>Click the button below to securely sign in:</p>
              <p>
                <a href="${url}" style="
                  display:inline-block;
                  padding:10px 16px;
                  background:#000;
                  color:#fff;
                  text-decoration:none;
                  border-radius:6px;
                ">
                  Sign in
                </a>
              </p>
              <p>If you did not request this email, you can safely ignore it.</p>
            </div>
          `,
        });

        console.log("✅ RESEND EMAIL SENT");
      },
    }),
  ],

  session: {
    strategy: "database",
  },

  pages: {
    signIn: "/signin",
  },
};