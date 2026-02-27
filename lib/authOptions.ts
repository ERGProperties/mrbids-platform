import EmailProvider from "next-auth/providers/email";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { prisma } from "@/lib/db";
import type { NextAuthOptions } from "next-auth";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),

  providers: [
    EmailProvider({
      from: process.env.EMAIL_FROM!,

      async sendVerificationRequest({ identifier, url, provider }) {
        await resend.emails.send({
          from: provider.from!,
          to: identifier,
          subject: "Sign in to MrBids",
          html: `
            <p>Click below to sign in to your MrBids account:</p>
            <p><a href="${url}">Sign in</a></p>
          `,
        });
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