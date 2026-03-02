import { prisma } from "@/lib/db"

export const dynamic = "force-dynamic"

const viewers: Record<string, number> = {}

export async function GET(
  req: Request,
  { params }: { params: { slug: string } }
) {
  const slug = params.slug

  viewers[slug] = (viewers[slug] || 0) + 1

  const stream = new ReadableStream({
    start(controller) {
      let closed = false

      const send = async () => {
        // ⭐ CRITICAL SAFETY CHECK
        if (closed) return

        try {
          const auction = await prisma.auction.findUnique({
            where: { slug },
            include: {
              bids: {
                orderBy: { amount: "desc" },
                take: 1,
              },
            },
          })

          if (!auction || closed) return

          const payload = {
            highestBid:
              auction.bids[0]?.amount ??
              auction.finalPrice ??
              auction.startingBid ??
              0,
            endsAt: auction.endAt
              ? auction.endAt.toISOString()
              : null,
            bidCount: auction.bidCount ?? 0,
            watchers: viewers[slug] || 1,
          }

          // ⭐ prevents enqueue after close
          if (!closed) {
            controller.enqueue(
              `data: ${JSON.stringify(payload)}\n\n`
            )
          }
        } catch (err) {
          console.error("Stream send error:", err)
        }
      }

      // send immediately
      send()

      const interval = setInterval(send, 2000)

      const cleanup = () => {
        if (closed) return
        closed = true

        clearInterval(interval)

        viewers[slug] = Math.max(
          0,
          (viewers[slug] || 1) - 1
        )

        try {
          controller.close()
        } catch {
          // ignore already closed
        }
      }

      req.signal.addEventListener("abort", cleanup)
    },
  })

  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache, no-transform",
      Connection: "keep-alive",
    },
  })
}