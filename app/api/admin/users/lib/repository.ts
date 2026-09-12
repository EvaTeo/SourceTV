import { prisma } from "@/app/lib/prisma";

import type {
  UserAction,
  UserRole,
  UserUpdateInput,
} from "./parser";

const userSelect = {
  id: true,
  email: true,
  name: true,
  role: true,
  subscriptionTier: true,
  subscriptionStatus: true,
  subscriptionEndsAt: true,
  stripeCustomerId: true,
  stripeSubscriptionId: true,
  createdAt: true,
};

export async function getUsers() {
  return prisma.user.findMany({
    orderBy: {
      createdAt: "desc",
    },
    select: userSelect,
  });
}

function getSubscriptionUpdate(
  action: UserAction
) {
  const oneYearFromNow = new Date();

  oneYearFromNow.setFullYear(
    oneYearFromNow.getFullYear() + 1
  );

  const lifetimeDate = new Date(
    "2099-12-31T23:59:59.000Z"
  );

  if (action === "grant_premium") {
    return {
      subscriptionTier: "premium",
      subscriptionStatus: "active",
      subscriptionEndsAt: oneYearFromNow,
    };
  }

  if (action === "lifetime_premium") {
    return {
      subscriptionTier: "premium",
      subscriptionStatus: "lifetime",
      subscriptionEndsAt: lifetimeDate,
    };
  }

  return {
    subscriptionTier: "free",
    subscriptionStatus: "inactive",
    subscriptionEndsAt: null,
    stripeSubscriptionId: null,
    subscriptionPriceId: null,
  };
}

export async function updateUser(
  input: UserUpdateInput,
  currentUserId?: string
) {
  if (input.action) {
    return prisma.user.update({
      where: {
        id: input.userId,
      },
      data: getSubscriptionUpdate(
        input.action
      ),
      select: userSelect,
    });
  }

  const role = input.role as UserRole;

  if (
    currentUserId &&
    input.userId === currentUserId &&
    role !== "admin"
  ) {
    throw new Error(
      "You cannot remove your own admin access."
    );
  }

  return prisma.user.update({
    where: {
      id: input.userId,
    },
    data: {
      role,
    },
    select: userSelect,
  });
}