import NextAuth from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      role: "USER" | "ADMIN";
      isVerifiedBidder?: boolean;
      email?: string | null;
    };
  }

  interface User {
    id: string;
    role: "USER" | "ADMIN";
    isVerifiedBidder?: boolean;
  }
}