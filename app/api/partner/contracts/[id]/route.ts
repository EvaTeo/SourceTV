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

    if (!user) {
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

    if (user.role !== "admin" && contract.partnerEmail !== user.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    if (contract.status === "sent" && !contract.viewedAt) {
      const viewedContract = await prisma.rightsContract.update({
        where: {
          id,
        },
        data: {
          status: "viewed",
          viewedAt: new Date(),
        },
        include: {
          project: true,
        },
      });

      return NextResponse.json(viewedContract);
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

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    const { id } = await context.params;
    const body = await request.json();

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

    if (user.role !== "admin" && contract.partnerEmail !== user.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    if (contract.status === "signed") {
      return NextResponse.json(
        {
          error:
            "This contract has already been signed and can no longer be changed.",
        },
        { status: 409 }
      );
    }

    if (
      contract.status === "cancelled" ||
      contract.status === "expired"
    ) {
      return NextResponse.json(
        {
          error: "This contract is no longer active.",
        },
        { status: 409 }
      );
    }

    if (body.action === "sign") {
      const signatureName = String(body.signatureName || "").trim();
      const signatureDataUrl = String(body.signatureDataUrl || "").trim();

      if (!signatureName || !signatureDataUrl) {
        return NextResponse.json(
          {
            error: "Signature name and drawn signature are required.",
          },
          { status: 400 }
        );
      }

      const updated = await prisma.rightsContract.update({
        where: {
          id,
        },
        data: {
          status: "signed",
          signedAt: new Date(),
          partnerSignatureName: signatureName,
          partnerSignatureDataUrl: signatureDataUrl,
        },
        include: {
          project: true,
        },
      });

      await prisma.partnerMessage.create({
        data: {
          projectId: contract.projectId,
          senderTeam: "Partner",
          subject: "Contract Signed",
          body: `${
            contract.partnerName || contract.partnerEmail
          } signed the streaming rights agreement.`,
        },
      });

      return NextResponse.json(updated);
    }

    if (body.action === "request_changes") {
      const partnerNotes = String(body.partnerNotes || "").trim();

      if (!partnerNotes) {
        return NextResponse.json(
          {
            error: "Please explain what changes you are requesting.",
          },
          { status: 400 }
        );
      }

      const updated = await prisma.rightsContract.update({
        where: {
          id,
        },
        data: {
          status: "changes_requested",
          partnerNotes,
        },
        include: {
          project: true,
        },
      });

      await prisma.partnerMessage.create({
        data: {
          projectId: contract.projectId,
          senderTeam: "Partner",
          subject: "Contract Changes Requested",
          body: partnerNotes,
        },
      });

      return NextResponse.json(updated);
    }

    return NextResponse.json(
      {
        error: "Invalid action",
      },
      { status: 400 }
    );
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