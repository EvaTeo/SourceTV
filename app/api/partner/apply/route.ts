import { getCurrentUser } from "@/app/lib/auth";
import { prisma } from "@/app/lib/prisma";
import { NextResponse } from "next/server";

type PartnerApplicationBody = {
  fullName?: unknown;
  email?: unknown;
  company?: unknown;
  roleTitle?: unknown;
  website?: unknown;
  portfolio?: unknown;
  workType?: unknown;
  bio?: unknown;
  reason?: unknown;
};

function cleanString(value: unknown) {
  return typeof value === "string"
    ? value.trim()
    : "";
}

export async function POST(request: Request) {
  try {
    const settings =
      await prisma.platformSettings.findFirst({
        select: {
          partnerApplications: true,
        },
      });

    if (
      settings &&
      !settings.partnerApplications
    ) {
      return NextResponse.json(
        {
          error:
            "Partner applications are currently closed.",
        },
        { status: 403 }
      );
    }

    const user = await getCurrentUser();

    if (!user) {
      return NextResponse.json(
        {
          error: "Not logged in.",
        },
        { status: 401 }
      );
    }

    const body: PartnerApplicationBody =
      await request.json();

    const fullName = cleanString(
      body.fullName
    );

    const email = cleanString(
      body.email
    ).toLowerCase();

    const reason = cleanString(
      body.reason
    );

    if (!fullName || !email || !reason) {
      return NextResponse.json(
        {
          error:
            "Full name, email, and reason are required.",
        },
        { status: 400 }
      );
    }

    const existing =
      await prisma.partnerApplication.findFirst({
        where: {
          userId: user.id,
          status: "pending",
        },
      });

    if (existing) {
      return NextResponse.json(
        {
          error:
            "You already have a pending partner application.",
        },
        { status: 409 }
      );
    }

    const application =
      await prisma.partnerApplication.create({
        data: {
          userId: user.id,
          fullName,
          email,
          company:
            cleanString(body.company) ||
            null,
          roleTitle:
            cleanString(body.roleTitle) ||
            null,
          website:
            cleanString(body.website) ||
            null,
          portfolio:
            cleanString(body.portfolio) ||
            null,
          workType:
            cleanString(body.workType) ||
            null,
          bio:
            cleanString(body.bio) || null,
          reason,
        },
      });

    return NextResponse.json(
      {
        success: true,
        application,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error(
      "PARTNER APPLICATION ERROR:",
      error
    );

    return NextResponse.json(
      {
        error:
          "Failed to submit partner application.",
      },
      { status: 500 }
    );
  }
}