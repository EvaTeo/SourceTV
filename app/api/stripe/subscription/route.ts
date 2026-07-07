import { getCurrentUser } from "@/app/lib/auth";
import { prisma } from "@/app/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const user = await getCurrentUser();

    if (!user) {
      return NextResponse.json(
        {
          subscriptionTier: "free",
          subscriptionStatus: "inactive",
          isPremium: false,
          subscriptionEndsAt: null,
        },
        { status: 200 }
      );
    }

    const dbUser = await prisma.user.findUnique({
      where: {
        id: user.id,
      },
      select: {
        subscriptionTier: true,
        subscriptionStatus: true,
        subscriptionPriceId: true,
        subscriptionEndsAt: true,
        stripeCustomerId: true,
        stripeSubscriptionId: true,
      },
    });

    const isPremium =
      dbUser?.subscriptionTier === "premium" &&
      ["active", "trialing"].includes(dbUser?.subscriptionStatus || "");

    return NextResponse.json({
      subscriptionTier: dbUser?.subscriptionTier || "free",
      subscriptionStatus: dbUser?.subscriptionStatus || "inactive",
      subscriptionPriceId: dbUser?.subscriptionPriceId || null,
      subscriptionEndsAt: dbUser?.subscriptionEndsAt || null,
      stripeCustomerId: dbUser?.stripeCustomerId || null,
      stripeSubscriptionId: dbUser?.stripeSubscriptionId || null,
      isPremium,
    });
  } catch (error) {
    console.error("LOAD SUBSCRIPTION ERROR:", error);

    return NextResponse.json(
      { error: "Failed to load subscription." },
      { status: 500 }
    );
  }
}