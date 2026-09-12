import type {
  ProjectSubmission,
  RightsContract,
} from "@/app/generated/prisma";
import { prisma } from "@/app/lib/prisma";
import { NextResponse } from "next/server";

type ContractWithProject =
  RightsContract & {
    project: ProjectSubmission;
  };

export async function markContractSigned(
  existingContract: ContractWithProject
) {
  if (
    existingContract.status === "draft"
  ) {
    return NextResponse.json(
      {
        error:
          "A draft contract must be sent before it can be manually marked as signed.",
      },
      {
        status: 409,
      }
    );
  }

  const contract =
    await prisma.rightsContract.update({
      where: {
        id: existingContract.id,
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