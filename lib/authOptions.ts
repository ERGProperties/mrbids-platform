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
          const subject = "Sign in to MrBids";

          const html = `
          <div style="margin:0; padding:0; background:#f4f4f5; font-family:-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Arial, sans-serif;">

            <table width="100%" cellpadding="0" cellspacing="0">
              <tr>
                <td align="center" style="padding:40px 16px;">

                  <!-- CONTAINER -->
                  <table width="100%" style="max-width:600px; background:#ffffff; border-radius:14px; overflow:hidden; box-shadow:0 8px 24px rgba(0,0,0,0.08);">

                    <!-- HEADER -->
                    <tr>
                      <td style="padding:28px 20px; text-align:center; border-bottom:1px solid #f1f1f1;">
                        <img 
                          src="https://mrbids.com/logo.png" 
                          alt="MrBids"
                          style="height:60px;"
                        />
                      </td>
                    </tr>

                    <!-- BODY -->
                    <tr>
                      <td style="padding:34px 28px;">

                        <h1 style="margin:0 0 12px; font-size:24px; font-weight:700; color:#111;">
                          Your secure login link is ready
                        </h1>

                        <p style="margin:0 0 18px; font-size:16px; color:#444;">
                          You're one click away from accessing your live auctions, bids, and opportunities.
                        </p>

                        <p style="margin:0 0 28px; font-size:14px; color:#666;">
                          This secure login link was requested from your device.
                        </p>

                        <!-- CTA -->
                        <div style="text-align:center; margin:30px 0;">
                          <a 
                            href="${url}" 
                            style="
                              display:inline-block;
                              padding:16px 34px;
                              background:#000;
                              color:#ffffff;
                              text-decoration:none;
                              border-radius:10px;
                              font-weight:700;
                              font-size:16px;
                              letter-spacing:0.3px;
                            "
                          >
                            Sign In to MrBids
                          </a>
                        </div>

                        <!-- Secondary -->
                        <p style="margin:24px 0 0; font-size:13px; color:#777; text-align:center;">
                          Or copy and paste this link into your browser:
                        </p>

                        <p style="word-break:break-all; font-size:12px; color:#999; text-align:center; margin-top:8px;">
                          ${url}
                        </p>

                      </td>
                    </tr>

                    <!-- FOOTER -->
                    <tr>
                      <td style="padding:22px; text-align:center; border-top:1px solid #f1f1f1;">

                        <p style="margin:0 0 6px; font-size:13px; color:#555; font-weight:500;">
                          MrBids — Real-time real estate auctions
                        </p>

                        <p style="margin:0; font-size:12px; color:#888;">
                          Built for investors, wholesalers, and dealmakers
                        </p>

                        <p style="margin-top:14px; font-size:11px; color:#aaa;">
                          This link expires shortly. If you didn’t request this, you can safely ignore this email.
                        </p>

                      </td>
                    </tr>

                  </table>

                </td>
              </tr>
            </table>

          </div>
          `;

          const text = `Sign in to MrBids\n${url}`;

          const result = await resend.emails.send({
            from: process.env.EMAIL_FROM!,
            to: identifier,
            subject,
            html,
            text,
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
    async session({ session, user }) {
      if (session.user) {
        session.user.id = user.id;
        session.user.email = user.email ?? undefined;
      }
      return session;
    },

    async redirect({ url, baseUrl }) {
      if (url.startsWith("/")) {
        return `${baseUrl}${url}`;
      }

      if (new URL(url).origin === baseUrl) {
        return url;
      }

      return `${baseUrl}/auctions`;
    },
  },
};