import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";

import { prisma } from "@/lib/prisma";
import { authOptions } from "@/lib/authOptions";
import {
  validateUsername,
  normalizeUsername,
} from "@/lib/usernames";

export async function GET(request: Request) {
  const session = await getServerSession(authOptions);

  const { searchParams } = new URL(request.url);

  const username = searchParams.get("username") ?? "";

  const validation = validateUsername(username);

  if (!validation.valid) {
    return NextResponse.json({
      available: false,
      ...validation,
    });
  }

  const normalized = normalizeUsername(username);

  const existing = await prisma.user.findUnique({
    where: {
      username: normalized,
    },
    select: {
      id: true,
      email: true,
    },
  });

  // Username belongs to the currently logged-in user
  if (
    existing &&
    existing.email === session?.user?.email
  ) {
    return NextResponse.json({
      available: true,
      valid: true,
      message: "This is your current username.",
    });
  }

  return NextResponse.json({
    available: !existing,
    valid: !existing,
    message: existing
      ? "Username is already taken."
      : "Username is available.",
  });
}