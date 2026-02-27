import NextAuth from "next-auth";
import { authOptions } from "@/lib/authOptions";

// Prevent caching issues during auth callbacks
export const dynamic = "force-dynamic";

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };