import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";

import { authOptions } from "@/lib/authOptions";
import { prisma } from "@/lib/prisma";
import {
  normalizeUsername,
  validateUsername,
} from "@/lib/usernames";

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    return NextResponse.json(
      { error: "Unauthorized" },
      { status: 401 }
    );
  }

  const body = await request.json();

  const username = normalizeUsername(body.username ?? "");

  const validation = validateUsername(username);

  if (!validation.valid) {
    return NextResponse.json(
      { error: validation.message },
      { status: 400 }
    );
  }

  const existing = await prisma.user.findUnique({
    where: {
      username,
    },
    select: {
      id: true,
    },
  });

  if (existing && existing.id !== session.user.id) {
    return NextResponse.json(
      {
        error: "Username already taken.",
      },
      { status: 400 }
    );
  }

  await prisma.user.update({
    where: {
      id: session.user.id,
    },
    data: {
      username,
      onboardingStep: 2,
    },
  });

  return NextResponse.json({
    success: true,
  });
}