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

      async sendVerificationRequest({ identifier, url }) {
        console.log("🔥 SEND VERIFICATION CALLED", identifier);

        try {
          const result = await resend.emails.send({
            from: process.env.EMAIL_FROM!,
            to: identifier,
            subject: "Sign in to MrBids",
            html: `
              <div style="font-family: Arial, sans-serif; line-height:1.5;">
                <h2>Sign in to MrBids</h2>
                <p>Click below to securely sign in:</p>

                <p>
                  <a href="${url}" style="
                    display:inline-block;
                    padding:10px 16px;
                    background:#000;
                    color:#fff;
                    text-decoration:none;
                    border-radius:6px;
                    font-weight:600;
                  ">
                    Sign in
                  </a>
                </p>

                <p style="font-size:12px;color:#666;">
                  This secure magic link will expire automatically.
                </p>

                <p style="font-size:12px;color:#666;">
                  If you did not request this email, you can safely ignore it.
                </p>
              </div>
            `,
          });

          console.log("✅ RESEND RESULT:", result);
        } catch (err) {
          console.error("❌ RESEND ERROR:", err);
          throw err;
        }
      },
    }),
  ],

  session: {
    strategy: "database",
  },

  pages: {
    signIn: "/signin",
  },

  callbacks: {
    async redirect({ url, baseUrl }) {

      // Allow relative URLs like /sell or /auctions/slug
      if (url.startsWith("/")) {
        return `${baseUrl}${url}`;
      }

      // Allow full URLs from our own domain
      if (new URL(url).origin === baseUrl) {
        return url;
      }

      // Fallback if something unexpected happens
      return `${baseUrl}/auctions`;
    },
  },
};