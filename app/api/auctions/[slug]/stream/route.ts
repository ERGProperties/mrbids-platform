import { prisma } from "@/lib/db"

export const dynamic = "force-dynamic"

const viewers: Record<string, number> = {}

export async function GET(
  req: Request,
  { params }: { params: { slug: string } }
) {
  const slug = params.slug

  // 👀 increment watcher count
  viewers[slug] = (viewers[slug] || 0) + 1

  const stream = new ReadableStream({
    async start(controller) {
      const send = async () => {
        const auction = await prisma.auction.findUnique({
          where: { slug },
          include: {
            bids: {
              orderBy: { amount: "desc" },
              take: 1,
            },
          },
        })

        if (!auction) return

        const payload = {
          highestBid:
            auction.bids[0]?.amount ??
            auction.finalPrice ??
            auction.startingBid,
          endsAt: auction.endAt.toISOString(),
          bidCount: auction.bidCount,
          watchers: viewers[slug] || 1,
        }

        controller.enqueue(
          `data: ${JSON.stringify(payload)}\n\n`
        )
      }

      await send()

      const interval = setInterval(send, 2000)

      req.signal.addEventListener("abort", () => {
        clearInterval(interval)

        // 👀 decrement watcher count
        viewers[slug] = Math.max(
          0,
          (viewers[slug] || 1) - 1
        )
      })
    },
  })

  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
      Connection: "keep-alive",
    },
  })
}
