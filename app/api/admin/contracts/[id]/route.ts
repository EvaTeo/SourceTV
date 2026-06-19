import { getCurrentUser } from "@/app/lib/auth";
import { prisma } from "@/app/lib/prisma";
import { NextResponse } from "next/server";

type RouteContext = {
  params: Promise<{
    id: string;
  }>;
};

export async function GET(request: Request, context: RouteContext) {
  try {
    const user = await getCurrentUser();

    if (!user || user.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    const { id } = await context.params;

    const contract = await prisma.rightsContract.findUnique({
      where: {
        id,
      },
      include: {
        project: true,
      },
    });

    if (!contract) {
      return NextResponse.json(
        { error: "Contract not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(contract);
  } catch (error: any) {
    return NextResponse.json(
      {
        error: "Failed to load contract",
        message: error?.message || "Unknown error",
      },
      { status: 500 }
    );
  }
}

export async function PATCH(request: Request, context: RouteContext) {
  try {
    const user = await getCurrentUser();

    if (!user || user.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    const { id } = await context.params;
    const body = await request.json();

    const existingContract = await prisma.rightsContract.findUnique({
      where: {
        id,
      },
      include: {
        project: true,
      },
    });

    if (!existingContract) {
      return NextResponse.json(
        { error: "Contract not found" },
        { status: 404 }
      );
    }

    const action = body.action;

    if (existingContract.status === "signed" && action !== "mark_signed") {
      return NextResponse.json(
        {
          error:
            "This contract has already been signed and can no longer be edited.",
        },
        { status: 409 }
      );
    }

    if (action === "send") {
      const contract = await prisma.rightsContract.update({
        where: {
          id,
        },
        data: {
          status: "sent",
          sentAt: new Date(),
        },
        include: {
          project: true,
        },
      });

      if (contract.partnerEmail) {
        await prisma.partnerMessage.create({
          data: {
            projectId: contract.projectId,
            senderTeam: "SourceTV Rights Team",
            subject: "Streaming Rights Agreement Ready For Review",
            body: `A SourceTV streaming rights agreement for "${contract.project?.title}" is ready for your review.

Please open your partner contracts area to review the agreement.

Status: Sent`,
          },
        });
      }

      return NextResponse.json(contract);
    }

    if (action === "mark_signed") {
      if (existingContract.status === "signed") {
        return NextResponse.json(existingContract);
      }

      const contract = await prisma.rightsContract.update({
        where: {
          id,
        },
        data: {
          status: "signed",
          signedAt: new Date(),
        },
        include: {
          project: true,
        },
      });

      return NextResponse.json(contract);
    }

    if (action === "cancel") {
      const contract = await prisma.rightsContract.update({
        where: {
          id,
        },
        data: {
          status: "cancelled",
        },
        include: {
          project: true,
        },
      });

      return NextResponse.json(contract);
    }

    const contract = await prisma.rightsContract.update({
      where: {
        id,
      },
      data: {
        partnerEmail: body.partnerEmail ?? existingContract.partnerEmail,
        partnerName: body.partnerName ?? existingContract.partnerName,
        rightsOwner: body.rightsOwner ?? existingContract.rightsOwner,
        rightsContact: body.rightsContact ?? existingContract.rightsContact,
        licenseType: body.licenseType ?? existingContract.licenseType,
        licenseStartDate:
          body.licenseStartDate === ""
            ? null
            : body.licenseStartDate
            ? new Date(`${body.licenseStartDate}T12:00:00`)
            : existingContract.licenseStartDate,
        licenseEndDate:
          body.licenseEndDate === ""
            ? null
            : body.licenseEndDate
            ? new Date(`${body.licenseEndDate}T12:00:00`)
            : existingContract.licenseEndDate,
        territories: body.territories ?? existingContract.territories,
        exclusivity: body.exclusivity ?? existingContract.exclusivity,
        revenueShare:
          typeof body.revenueShare === "number"
            ? body.revenueShare
            : existingContract.revenueShare,
        contractText: body.contractText ?? existingContract.contractText,
        adminNotes: body.adminNotes ?? existingContract.adminNotes,
      },
      include: {
        project: true,
      },
    });

    return NextResponse.json(contract);
  } catch (error: any) {
    return NextResponse.json(
      {
        error: "Failed to update contract",
        message: error?.message || "Unknown error",
      },
      { status: 500 }
    );
  }
}