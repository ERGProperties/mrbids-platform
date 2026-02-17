import { prisma } from "@/lib/db"

export const runtime = "nodejs"

export async function GET(
  _: Request,
  { params }: { params: { slug: string } }
) {
  const encoder = new TextEncoder()

  const stream = new ReadableStream({
    async start(controller) {
      let lastPayload = ""

      const send = async () => {
        const auction = await prisma.auction.findUnique({
          where: { slug: params.slug },
          include: {
            bids: {
              orderBy: { amount: "desc" },
              take: 1,
            },
          },
        })

        if (!auction) return

        const payload = JSON.stringify({
          endsAt: auction.endAt.toISOString(),
          highestBid:
            auction.bids[0]?.amount ??
            auction.finalPrice ??
            auction.startingBid,
        })

        if (payload !== lastPayload) {
          controller.enqueue(
            encoder.encode(`data: ${payload}\n\n`)
          )
          lastPayload = payload
        }
      }

      const interval = setInterval(send, 2000)
      send()

      controller.enqueue(
        encoder.encode("retry: 2000\n\n")
      )

      return () => clearInterval(interval)
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
