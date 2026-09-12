import { prisma } from "@/app/lib/prisma";
import type {
  ProjectSubmission,
  RightsContract,
} from "@/app/generated/prisma";
import { NextResponse } from "next/server";

type ContractWithProject = RightsContract & {
  project: ProjectSubmission;
};

export async function sendContract(
  existingContract: ContractWithProject
) {
  if (
    existingContract.status === "sent" ||
    existingContract.status === "viewed"
  ) {
    return NextResponse.json(existingContract, {
      status: 200,
      headers: {
        "X-Contract-Result": "already-sent",
      },
    });
  }

  if (!existingContract.partnerEmail) {
    return NextResponse.json(
      {
        error:
          "A partner email address is required before this contract can be sent.",
      },
      {
        status: 400,
      }
    );
  }

  const contractText = existingContract.contractText?.trim();

  if (!contractText) {
    return NextResponse.json(
      {
        error:
          "Contract text is required before this contract can be sent.",
      },
      {
        status: 400,
      }
    );
  }

  const contract = await prisma.$transaction(async (tx) => {
    const updatedContract = await tx.rightsContract.update({
      where: {
        id: existingContract.id,
      },
      data: {
        status: "sent",
        sentAt: new Date(),
      },
      include: {
        project: true,
      },
    });

    await tx.partnerMessage.create({
      data: {
        projectId: updatedContract.projectId,
        senderTeam: "SourceTV Rights Team",
        subject:
          "Streaming Rights Agreement Ready For Review",
        body: buildPartnerMessage(
          updatedContract.project.title
        ),
      },
    });

    return updatedContract;
  });

  return NextResponse.json(contract);
}

function buildPartnerMessage(title: string) {
  return `A SourceTV streaming rights agreement for "${title}" is ready for your review.

Please open your partner contracts area to review the agreement.

Status: Sent`;
}