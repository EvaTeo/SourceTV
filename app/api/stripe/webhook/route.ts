import { prisma } from "@/app/lib/prisma";
import { NextResponse } from "next/server";
import Stripe from "stripe";

const stripeSecretKey = process.env.STRIPE_SECRET_KEY;
const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

const stripe = stripeSecretKey ? new Stripe(stripeSecretKey) : null;

async function updateUserFromSubscription(subscription: Stripe.Subscription) {
  const customerId =
    typeof subscription.customer === "string"
      ? subscription.customer
      : subscription.customer.id;

  const subscriptionItem = subscription.items.data[0];
  const priceId = subscriptionItem?.price?.id || null;

  const periodEnd = subscription.items.data[0]?.current_period_end
    ? new Date(subscription.items.data[0].current_period_end * 1000)
    : null;

  const isPremium =
    subscription.status === "active" || subscription.status === "trialing";

  await prisma.user.updateMany({
    where: {
      stripeCustomerId: customerId,
    },
    data: {
      subscriptionTier: isPremium ? "premium" : "free",
      subscriptionStatus: subscription.status,
      subscriptionPriceId: priceId,
      subscriptionEndsAt: periodEnd,
      stripeSubscriptionId: subscription.id,
    },
  });
}

export async function POST(req: Request) {
  try {
    if (!stripe || !webhookSecret) {
      return NextResponse.json(
        { error: "Stripe webhook is not configured." },
        { status: 500 }
      );
    }

    const body = await req.text();
    const signature = req.headers.get("stripe-signature");

    if (!signature) {
      return NextResponse.json(
        { error: "Missing Stripe signature." },
        { status: 400 }
      );
    }

    let event: Stripe.Event;

    try {
      event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
    } catch (error) {
      console.error("STRIPE WEBHOOK SIGNATURE ERROR:", error);

      return NextResponse.json(
        { error: "Invalid Stripe signature." },
        { status: 400 }
      );
    }

    if (event.type === "checkout.session.completed") {
      const session = event.data.object as Stripe.Checkout.Session;

      const userId = session.metadata?.userId;
      const customerId =
        typeof session.customer === "string" ? session.customer : null;
      const subscriptionId =
        typeof session.subscription === "string" ? session.subscription : null;

      if (userId && customerId) {
        await prisma.user.update({
          where: {
            id: userId,
          },
          data: {
            stripeCustomerId: customerId,
            stripeSubscriptionId: subscriptionId,
            subscriptionTier: "premium",
            subscriptionStatus: "active",
          },
        });
      }

      if (subscriptionId) {
        const subscription = await stripe.subscriptions.retrieve(subscriptionId);
        await updateUserFromSubscription(subscription);
      }
    }

    if (
      event.type === "customer.subscription.created" ||
      event.type === "customer.subscription.updated" ||
      event.type === "customer.subscription.deleted"
    ) {
      const subscription = event.data.object as Stripe.Subscription;

      await updateUserFromSubscription(subscription);
    }

    if (event.type === "invoice.payment_failed") {
      const invoice = event.data.object as Stripe.Invoice;

      const customerId =
        typeof invoice.customer === "string" ? invoice.customer : null;

      if (customerId) {
        await prisma.user.updateMany({
          where: {
            stripeCustomerId: customerId,
          },
          data: {
            subscriptionStatus: "past_due",
          },
        });
      }
    }

    return NextResponse.json({
      received: true,
    });
  } catch (error) {
    console.error("STRIPE WEBHOOK ERROR:", error);

    return NextResponse.json(
      { error: "Stripe webhook failed." },
      { status: 500 }
    );
  }
}