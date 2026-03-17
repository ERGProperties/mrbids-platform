import { autoCloseExpiredAuctions } from "@/lib/auctionLifecycle";

export async function GET(req: Request) {

  // 🔐 Simple security check (important)
  const authHeader = req.headers.get("authorization");

  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return new Response("Unauthorized", { status: 401 });
  }

  try {
    await autoCloseExpiredAuctions();

    return Response.json({
      success: true,
      message: "Auctions processed",
    });

  } catch (error) {
    console.error("Cron error:", error);

    return new Response("Error running cron", { status: 500 });
  }
}