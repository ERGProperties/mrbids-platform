import NextAuth from "next-auth";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { prisma } from "@/lib/prisma";
import CredentialsProvider from "next-auth/providers/credentials";

export const authOptions = {
  adapter: PrismaAdapter(prisma),

  session: {
    strategy: "jwt",
  },

  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
      },
      async authorize(credentials) {
        if (!credentials?.email) return null;

        let user = await prisma.user.findUnique({
          where: { email: credentials.email },
        });

        // AUTO-CREATE USER ON FIRST LOGIN
        if (!user) {
          user = await prisma.user.create({
            data: {
              email: credentials.email,
            },
          });
        }

        return user;
      },
    }),
  ],

  callbacks: {
    async jwt({ token, user }) {
      // On login
      if (user) {
        token.id = user.id;
        token.role = user.role;
        token.isVerifiedBidder = user.isVerifiedBidder;
      }

      // Refresh verification status from DB
      if (token.id) {
        const dbUser = await prisma.user.findUnique({
          where: { id: token.id as string },
        });

        if (dbUser) {
          token.isVerifiedBidder =
            dbUser.isVerifiedBidder;
        }
      }

      return token;
    },

    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.role =
          token.role as "USER" | "ADMIN";

        session.user.isVerifiedBidder =
          token.isVerifiedBidder as boolean;
      }

      return session;
    },
  },
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
