import { prisma } from "@/lib/prisma"
import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import Stripe from "stripe"

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2023-10-16",
})

export async function POST() {
  const session = await getServerSession(authOptions)

  if (!session?.user?.id || !session.user.email) {
    return NextResponse.json(
      { error: "Unauthorized" },
      { status: 401 }
    )
  }

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
  })

  if (!user) {
    return NextResponse.json(
      { error: "User not found" },
      { status: 404 }
    )
  }

  let customerId = user.stripeCustomerId

  // Create Stripe customer if not exists
  if (!customerId) {
    const customer = await stripe.customers.create({
      email: session.user.email,
    })

    customerId = customer.id

    await prisma.user.update({
      where: { id: user.id },
      data: { stripeCustomerId: customerId },
    })
  }

  const setupIntent = await stripe.setupIntents.create({
    customer: customerId,
    payment_method_types: ["card"],
  })

  return NextResponse.json({
    clientSecret: setupIntent.client_secret,
  })
}
