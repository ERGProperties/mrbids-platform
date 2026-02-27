import NextAuth from "next-auth";
import { authOptions } from "@/lib/authOptions";

console.log("🔥 NEXTAUTH ROUTE LOADED");

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };