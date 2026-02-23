import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";

export async function POST() {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    return NextResponse.json(
      { error: "Unauthorized" },
      { status: 401 }
    );
  }

  // Service fee payments are temporarily disabled
  return NextResponse.json({
    success: false,
    message:
      "Service fee payments are currently disabled during platform launch.",
  });
}