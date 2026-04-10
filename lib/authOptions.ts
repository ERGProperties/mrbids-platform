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
            <div style="margin:0; padding:0; background:#f5f5f5; font-family:Arial, sans-serif;">

              <table width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td align="center" style="padding:40px 0;">

                    <!-- CONTAINER -->
                    <table width="600" style="background:#ffffff; border-radius:12px; overflow:hidden;">

                      <!-- HEADER -->
                      <tr>
                        <td style="padding:20px; text-align:center; border-bottom:1px solid #eee;">
                          <img 
                            src="https://mrbids.com/logo.png" 
                            alt="MrBids"
                            style="height:40px;"
                          />
                        </td>
                      </tr>

                      <!-- BODY -->
                      <tr>
                        <td style="padding:30px;">

                          <h2 style="margin-top:0; font-size:22px;">
                            Sign in to MrBids
                          </h2>

                          <p style="font-size:16px; color:#333;">
                            Click the button below to securely access your account.
                          </p>

                          <div style="text-align:center; margin:30px 0;">
                            <a 
                              href="${url}" 
                              style="
                                display:inline-block;
                                padding:14px 26px;
                                background:#000;
                                color:#ffffff;
                                text-decoration:none;
                                border-radius:8px;
                                font-weight:bold;
                                font-size:15px;
                              "
                            >
                              Sign In
                            </a>
                          </div>

                          <p style="font-size:14px; color:#666;">
                            This secure link will expire shortly.
                          </p>

                          <p style="font-size:14px; color:#666;">
                            If you didn’t request this email, you can safely ignore it.
                          </p>

                        </td>
                      </tr>

                      <!-- FOOTER -->
                      <tr>
                        <td style="padding:20px; text-align:center; font-size:12px; color:#888; border-top:1px solid #eee;">
                          © ${new Date().getFullYear()} MrBids<br/>
                          Real-time real estate auctions
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