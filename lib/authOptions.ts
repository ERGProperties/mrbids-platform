import EmailProvider from "next-auth/providers/email";
import GoogleProvider from "next-auth/providers/google";
import AppleProvider from "next-auth/providers/apple";
import CredentialsProvider from "next-auth/providers/credentials";

import { PrismaAdapter }
  from "@next-auth/prisma-adapter";

import { prisma }
  from "@/lib/prisma";

import type {
  NextAuthOptions,
} from "next-auth";

import { Resend }
  from "resend";

const resend =
  new Resend(
    process.env.RESEND_API_KEY
  );

export const authOptions: NextAuthOptions = {

  adapter:
    PrismaAdapter(prisma),

  providers: [

    AppleProvider({

      clientId:
        process.env.APPLE_ID!,

      clientSecret:
        process.env.APPLE_SECRET!,

    }),

    GoogleProvider({

      clientId:
        process.env.GOOGLE_CLIENT_ID!,

      clientSecret:
        process.env.GOOGLE_CLIENT_SECRET!,

    }),

    EmailProvider({

      from:
        process.env.EMAIL_FROM!,

      async sendVerificationRequest({
        identifier,
        url,
      }) {

        console.log(
          "🔥 SEND VERIFICATION CALLED",
          identifier
        );

        console.log(
          "MAGIC LINK URL:",
          url
        );

        try {

          const subject =
            "Sign in to MrBids";

          const html = `
          <div style="margin:0; padding:0; background:#f4f4f5; font-family:-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Arial, sans-serif;">

            <table width="100%" cellpadding="0" cellspacing="0">
              <tr>
                <td align="center" style="padding:40px 16px;">

                  <table width="100%" style="max-width:600px; background:#ffffff; border-radius:14px; overflow:hidden; box-shadow:0 8px 24px rgba(0,0,0,0.08);">

                    <tr>
                      <td style="padding:28px 20px; text-align:center; border-bottom:1px solid #f1f1f1;">

                        <img 
                          src="https://mrbids.com/header-logo.png" 
                          alt="MrBids"
                          style="width:100%; max-width:420px; height:auto;"
                        />

                      </td>
                    </tr>

                    <tr>
                      <td style="padding:34px 28px;">

                        <h1 style="margin:0 0 12px; font-size:24px; font-weight:700; color:#111;">
                          Your secure login link is ready
                        </h1>

                        <p style="margin:0 0 18px; font-size:16px; color:#444;">
                          You're one click away from accessing live marketplace auctions, bids, watchlists, and exclusive deals.
                        </p>

                        <p style="margin:0 0 28px; font-size:14px; color:#666;">
                          This secure login link was requested from your device.
                        </p>

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

                        <p style="margin:24px 0 0; font-size:13px; color:#777; text-align:center;">
                          Or copy and paste this link into your browser:
                        </p>

                        <p style="word-break:break-all; font-size:12px; color:#999; text-align:center; margin-top:8px;">
                          ${url}
                        </p>

                      </td>
                    </tr>

                    <tr>
                      <td style="padding:22px; text-align:center; border-top:1px solid #f1f1f1;">

                        <p style="margin:0 0 6px; font-size:13px; color:#555; font-weight:500;">
                          MrBids — Live marketplace auctions
                        </p>

                        <p style="margin:0; font-size:12px; color:#888;">
                          Discover real estate, luxury items, collectibles, vehicles, electronics, and more
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

          const text =
            `Sign in to MrBids\n${url}`;

          const result =
            await resend.emails.send({

              from:
                process.env.EMAIL_FROM!,

              to:
                identifier,

              subject,

              html,

              text,

            });

          console.log(
            "✅ RESEND RESULT:",
            result
          );

        } catch (err) {

          console.error(
            "❌ RESEND ERROR:",
            err
          );

          throw err;
        }
      },
    }),

    CredentialsProvider({

      id: "firebase",

      name: "Firebase",

      credentials: {

        idToken: {

          label: "Firebase ID Token",

          type: "text",

        },

      },

async authorize(credentials) {

  console.log("🔥 Firebase authorize() called");

  console.log(
    "Credentials received:",
    credentials
      ? Object.keys(credentials)
      : "NONE"
  );

  // Ensure an idToken was provided
  if (!credentials?.idToken) {

    console.warn(
      "Firebase credentials.authorize called without idToken"
    );

    return null;

  }

  try {

    // Get your existing Firebase Admin app
    console.log(
      "1 - Before dynamic imports"
    );

    const { getAuth } =
      await import(
        "firebase-admin/auth"
      );

    console.log(
      "2 - firebase-admin/auth imported"
    );

    const { getFirebaseApp } =
      await import(
        "@/lib/firebaseAdmin"
      );

    console.log(
      "3 - firebaseAdmin helper imported"
    );

    const firebaseApp =
      await getFirebaseApp();

    console.log(
      "4 - Firebase app initialized"
    );

    const decoded =
      await getAuth(firebaseApp)
        .verifyIdToken(
          credentials.idToken
        );

    console.log(
      "5 - Token verified"
    );

    console.log(
      "✅ Firebase token verified:",
      {
        uid: decoded.uid,
        email: decoded.email,
        provider:
          decoded.firebase?.sign_in_provider,
      }
    );

    if (!decoded) {

      console.warn(
        "Firebase token verification returned no decoded token"
      );

      return null;

    }

    // Require an email
    if (!decoded.email) {

      console.warn(
        "Firebase token is missing email claim",
        decoded
      );

      return null;

    }

    // Require verified email
    if (!decoded.email_verified) {

      console.warn(
        "Firebase email is not verified:",
        decoded.email
      );

      return null;

    }

    const now =
      new Date();

    // Find or create the Prisma user
    const user =
      await prisma.user.upsert({

        where: {

          email:
            decoded.email,

        },

        update: {

          name:
            decoded.name ?? null,

          image:
            decoded.picture ?? null,

          emailVerified:
            now,

        },

        create: {

          email:
            decoded.email,

          name:
            decoded.name ?? null,

          image:
            decoded.picture ?? null,

          emailVerified:
            now,

        },

      });

    // Determine provider
    const rawProvider =
      decoded.firebase?.sign_in_provider
      ?? "";

    const provider =
      rawProvider.replace(
        ".com",
        ""
      ) || "firebase";

    // Link provider account
    try {

      await prisma.account.upsert({

        where: {

          provider_providerAccountId: {

            provider,

            providerAccountId:
              decoded.uid,

          },

        },

        update: {},

        create: {

          userId:
            user.id,

          type:
            "oauth",

          provider,

          providerAccountId:
            decoded.uid,

        },

      });

    } catch (accountErr) {

      console.warn(
        "Account upsert failed, attempting fallback:",
        accountErr
      );

      const existing =
        await prisma.account.findFirst({

          where: {

            provider,

            providerAccountId:
              decoded.uid,

          },

        });

      if (!existing) {

        await prisma.account.create({

          data: {

            userId:
              user.id,

            type:
              "oauth",

            provider,

            providerAccountId:
              decoded.uid,

          },

        });

      }

    }

    // Return the NextAuth user

console.log(
  "✅ Returning NextAuth user:",
  {
    id: user.id,
    email: user.email,
    role: user.role,
  }
);
    return {

      id:
        user.id,

      email:
        user.email,

      name:
        user.name ?? undefined,

      image:
        user.image ?? undefined,

      role: user.role,

    };

} catch (err) {

  console.error(
    "🔥 FIREBASE AUTHORIZE ERROR"
  );

  console.error(err);

  if (err instanceof Error) {

    console.error(err.message);

    console.error(err.stack);

  }

  throw err;

}

},

    }),

  ],

  session: {
    strategy: "jwt",
  },

  jwt: {
    maxAge: 30 * 24 * 60 * 60,
  },

  cookies: {

    pkceCodeVerifier: {

      name:
        "next-auth.pkce.code_verifier",

      options: {

        httpOnly: true,

        sameSite: "none",

        path: "/",

        secure: true,

      },
    },

    state: {

      name:
        "next-auth.state",

      options: {

        httpOnly: true,

        sameSite: "none",

        path: "/",

        secure: true,

      },
    },

    nonce: {

      name:
        "next-auth.nonce",

      options: {

        httpOnly: true,

        sameSite: "none",

        path: "/",

        secure: true,

      },
    },
  },

  pages: {
    signIn: "/signin",
  },

  callbacks: {

    async jwt({
      token,
      user,
    }) {

      if (user) {

        token.id =
          user.id;

        token.email =
          user.email;
      }

      return token;
    },

    async session({
      session,
      token,
    }) {

      if (session.user) {

        session.user.id =
          token.id as string;

        session.user.email =
          token.email as string;
      }

      return session;
    },

    async redirect({
      url,
      baseUrl,
    }) {

      console.log(
        "REDIRECT CALLBACK URL:",
        url
      );

      console.log(
        "REDIRECT CALLBACK BASE:",
        baseUrl
      );

      if (url.startsWith("/")) {

        return `${baseUrl}${url}`;
      }

      try {

        const parsed =
          new URL(url);

        if (
          parsed.origin === baseUrl
        ) {

          return url;
        }

      } catch (err) {

        console.error(
          "Redirect Parse Error:",
          err
        );
      }

      return `${baseUrl}/`;
    },
  },
};