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
              <h2>Sign in to MrBids</h2>
              <p><a href="${url}">Sign in</a></p>
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
};