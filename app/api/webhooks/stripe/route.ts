import Stripe from "stripe"
import { prisma } from "@/lib/db"
import { NextResponse } from "next/server"

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2023-10-16",
})

export async function POST(req: Request) {
  const signature = req.headers.get("stripe-signature")

  if (!signature) {
    return new NextResponse("Missing signature", { status: 400 })
  }

  const body = Buffer.from(await req.arrayBuffer())

  let event: Stripe.Event

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    )
  } catch (err: any) {
    console.error("Webhook signature verification failed:", err.message)
    return new NextResponse("Invalid signature", { status: 400 })
  }

  // =========================
  // 💳 Service Fee Payment
  // =========================
  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session

    const auctionId = session.metadata?.auctionId
    const type = session.metadata?.type

    if (type === "service_fee" && auctionId) {
      await prisma.auction.update({
        where: { id: auctionId },
        data: {
          serviceFeeStatus: "PAID",
          serviceFeePaidAt: new Date(),
        },
      })
    }
  }

  // =========================
  // 🔒 Bidder Verification (Card Setup)
  // =========================
  if (event.type === "setup_intent.succeeded") {
    const setupIntent = event.data.object as Stripe.SetupIntent

    if (setupIntent.customer) {
      const customerId = setupIntent.customer.toString()

      await prisma.user.updateMany({
        where: { stripeCustomerId: customerId },
        data: {
          isVerifiedBidder: true,
        },
      })
    }
  }

  return NextResponse.json({ received: true })
}
