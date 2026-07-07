import { cookies } from "next/headers";
import { prisma } from "@/app/lib/prisma";

export async function getCurrentUser() {
  const cookieStore = await cookies();

  const userId = cookieStore.get("sourcetv_user_id")?.value;

  if (!userId) {
    return null;
  }

  const user = await prisma.user.findUnique({
    where: {
      id: userId,
    },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,

      subscriptionTier: true,
      subscriptionStatus: true,
      subscriptionPriceId: true,
      subscriptionEndsAt: true,

      stripeCustomerId: true,
      stripeSubscriptionId: true,
    },
  });

  return user;
}