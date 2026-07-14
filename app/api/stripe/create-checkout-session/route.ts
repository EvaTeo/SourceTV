import { getCurrentUser } from "@/app/lib/auth";
import { prisma } from "@/app/lib/prisma";
import { SUBSCRIPTION } from "@/app/lib/subscription";
import { NextResponse } from "next/server";
import Stripe from "stripe";

const stripeSecretKey =
  process.env.STRIPE_SECRET_KEY;

const stripe = stripeSecretKey
  ? new Stripe(stripeSecretKey)
  : null;

function getBaseUrl() {
  return (
    process.env.NEXT_PUBLIC_APP_URL ||
    process.env.NEXT_PUBLIC_SITE_URL ||
    "http://localhost:3000"
  );
}

export async function POST() {
  try {
    const user = await getCurrentUser();

    if (!user) {
      return NextResponse.json(
        {
          error:
            "Please log in before upgrading.",
        },
        { status: 401 }
      );
    }

    const settings =
      await prisma.platformSettings.findFirst({
        select: {
          premiumEnabled: true,
          monthlyPrice: true,
          freeTrialDays: true,
        },
      });

    if (
      settings &&
      !settings.premiumEnabled
    ) {
      return NextResponse.json(
        {
          error:
            "Premium memberships are currently unavailable.",
        },
        { status: 403 }
      );
    }

    if (!stripe) {
      return NextResponse.json(
        {
          error:
            "Stripe is not configured.",
        },
        { status: 500 }
      );
    }

    const priceId =
      SUBSCRIPTION.premium.stripe
        .monthlyPriceId;

    if (!priceId) {
      return NextResponse.json(
        {
          error:
            "Premium price ID is missing.",
        },
        { status: 500 }
      );
    }

    const dbUser =
      await prisma.user.findUnique({
        where: {
          id: user.id,
        },
      });

    if (!dbUser) {
      return NextResponse.json(
        {
          error: "User not found.",
        },
        { status: 404 }
      );
    }

    if (
      dbUser.subscriptionTier ===
        "premium" &&
      ["active", "trialing"].includes(
        dbUser.subscriptionStatus
      )
    ) {
      return NextResponse.json(
        {
          error:
            "This account already has an active Premium membership.",
        },
        { status: 409 }
      );
    }

    let stripeCustomerId =
      dbUser.stripeCustomerId;

    if (!stripeCustomerId) {
      const customer =
        await stripe.customers.create({
          email: dbUser.email,
          name:
            dbUser.name || undefined,
          metadata: {
            userId: dbUser.id,
          },
        });

      stripeCustomerId = customer.id;

      await prisma.user.update({
        where: {
          id: dbUser.id,
        },
        data: {
          stripeCustomerId,
        },
      });
    }

    const baseUrl = getBaseUrl();

    const configuredTrialDays =
      settings?.freeTrialDays ?? 7;

    const freeTrialDays = Math.max(
      0,
      Math.min(
        730,
        Math.round(
          configuredTrialDays
        )
      )
    );

    const subscriptionData: Stripe.Checkout.SessionCreateParams.SubscriptionData =
      {
        metadata: {
          userId: dbUser.id,
          subscriptionTier:
            "premium",
        },
      };

    if (freeTrialDays > 0) {
      subscriptionData.trial_period_days =
        freeTrialDays;
    }

    const checkoutSession =
      await stripe.checkout.sessions.create({
        mode: "subscription",
        customer: stripeCustomerId,

        line_items: [
          {
            price: priceId,
            quantity: 1,
          },
        ],

        allow_promotion_codes: true,

        success_url: `${baseUrl}/account/billing?success=true&session_id={CHECKOUT_SESSION_ID}`,

        cancel_url: `${baseUrl}/account/billing?canceled=true`,

        metadata: {
          userId: dbUser.id,
          subscriptionTier:
            "premium",
        },

        subscription_data:
          subscriptionData,
      });

    if (!checkoutSession.url) {
      return NextResponse.json(
        {
          error:
            "Stripe did not return a checkout URL.",
        },
        { status: 500 }
      );
    }

    return NextResponse.json({
      url: checkoutSession.url,
    });
  } catch (error) {
    console.error(
      "CREATE CHECKOUT SESSION ERROR:",
      error
    );

    return NextResponse.json(
      {
        error:
          "Failed to create checkout session.",
      },
      { status: 500 }
    );
  }
}