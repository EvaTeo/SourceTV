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

export async function cancelContract(
  existingContract: ContractWithProject
) {
  const contract =
    await prisma.rightsContract.update({
      where: {
        id: existingContract.id,
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