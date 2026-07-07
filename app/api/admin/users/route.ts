import { getCurrentUser } from "@/app/lib/auth";
import { prisma } from "@/app/lib/prisma";
import { NextResponse } from "next/server";

const allowedRoles = ["user", "viewer", "partner", "admin"];
const allowedActions = ["grant_premium", "remove_premium", "lifetime_premium"];

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

export async function GET() {
  try {
    const currentUser = await getCurrentUser();

    if (!currentUser || currentUser.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    const users = await prisma.user.findMany({
      orderBy: { createdAt: "desc" },
      select: userSelect,
    });

    return NextResponse.json(users);
  } catch (error) {
    console.error("ADMIN USERS ERROR:", error);

    return NextResponse.json(
      { error: "Failed to load users." },
      { status: 500 }
    );
  }
}

export async function PATCH(req: Request) {
  try {
    const currentUser = await getCurrentUser();

    if (!currentUser || currentUser.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    const body = await req.json();

    const userId = String(body.userId || "").trim();
    const role = String(body.role || "").trim().toLowerCase();
    const action = String(body.action || "").trim().toLowerCase();

    if (!userId) {
      return NextResponse.json(
        { error: "User ID is required." },
        { status: 400 }
      );
    }

    if (action) {
      if (!allowedActions.includes(action)) {
        return NextResponse.json(
          { error: "Invalid user action." },
          { status: 400 }
        );
      }

      const oneYearFromNow = new Date();
      oneYearFromNow.setFullYear(oneYearFromNow.getFullYear() + 1);

      const lifetimeDate = new Date("2099-12-31T23:59:59.000Z");

      const data =
        action === "grant_premium"
          ? {
              subscriptionTier: "premium",
              subscriptionStatus: "active",
              subscriptionEndsAt: oneYearFromNow,
            }
          : action === "lifetime_premium"
            ? {
                subscriptionTier: "premium",
                subscriptionStatus: "lifetime",
                subscriptionEndsAt: lifetimeDate,
              }
            : {
                subscriptionTier: "free",
                subscriptionStatus: "inactive",
                subscriptionEndsAt: null,
                stripeSubscriptionId: null,
                subscriptionPriceId: null,
              };

      const updatedUser = await prisma.user.update({
        where: { id: userId },
        data,
        select: userSelect,
      });

      return NextResponse.json(updatedUser);
    }

    if (!role) {
      return NextResponse.json(
        { error: "Role or action is required." },
        { status: 400 }
      );
    }

    if (!allowedRoles.includes(role)) {
      return NextResponse.json({ error: "Invalid role." }, { status: 400 });
    }

    if (userId === currentUser.id && role !== "admin") {
      return NextResponse.json(
        { error: "You cannot remove your own admin access." },
        { status: 400 }
      );
    }

    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: { role },
      select: userSelect,
    });

    return NextResponse.json(updatedUser);
  } catch (error) {
    console.error("ADMIN UPDATE USER ERROR:", error);

    return NextResponse.json(
      { error: "Failed to update user." },
      { status: 500 }
    );
  }
}