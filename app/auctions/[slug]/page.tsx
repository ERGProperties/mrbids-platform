import { notFound, redirect } from "next/navigation"
import { prisma } from "@/lib/db"
import AuctionClient from "./AuctionClient"

/**
 * Resolve primary (01-*) image
 */
function getPrimaryImage(
  images: unknown,
  imagesPath: string
): string | null {
  if (!Array.isArray(images) || images.length === 0)
    return null

  const files = images as string[]
  const primary = files.find((f) =>
    f.startsWith("01-")
  )
  const file = primary ?? files[0]

  return file ? `${imagesPath}/${file}` : null
}

export default async function AuctionPage({
  params,
}: {
  params: { slug: string }
}) {
  const auction = await prisma.auction.findUnique({
    where: { slug: params.slug },
    include: {
      bids: {
        orderBy: { amount: "desc" },
        take: 1,
      },
    },
  })

  if (!auction) {
    notFound()
  }

  const now = new Date()

  // 🔒 Redirect if auction has ended
  if (now > auction.endAt) {
    redirect(`/auctions/${auction.slug}/result`)
  }

  const highestBid =
    auction.bids[0]?.amount ??
    auction.finalPrice ??
    auction.startingBid

  const minimumBid =
    highestBid + auction.bidIncrement

  const image = getPrimaryImage(
    auction.images,
    auction.imagesPath
  )

  return (
    <AuctionClient
      auction={{
        id: auction.id,
        slug: auction.slug,
        title: auction.title,
        addressLine: auction.addressLine,
        cityStateZip: auction.cityStateZip,
        startingBid: auction.startingBid,
        bidIncrement: auction.bidIncrement,
        highestBid,
        arv: auction.arv,
        endsAt: auction.endAt.toISOString(), // 👈 client expects endsAt string
        image,
      }}
      minimumBid={minimumBid}
    />
  )
}
