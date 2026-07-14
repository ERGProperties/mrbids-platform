import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { validateUsername, normalizeUsername } from "@/lib/usernames";

export async function GET(request: Request) {
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
    },
  });

  return NextResponse.json({
    available: !existing,
    valid: !existing,
    message: existing ? "Username is already taken." : "Username is available.",
  });
}