import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

export async function middleware(req: NextRequest) {
  const token = await getToken({
    req,
    secret: process.env.NEXTAUTH_SECRET,
  });

  // ⭐ Not logged in → go to YOUR custom signin page
  if (!token) {
    return NextResponse.redirect(new URL("/signin", req.url));
  }

  // ⭐ Logged in but not admin
  if (token.role !== "ADMIN") {
    return NextResponse.redirect(new URL("/", req.url));
  }

  // ⭐ Admin access granted
  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};