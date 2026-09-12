import { prisma } from "@/app/lib/prisma";
import { NextResponse } from "next/server";
import type {
  PartnerContractWithProject,
} from "./types";

type PartnerContractSuccess = {
  ok: true;
  contract: PartnerContractWithProject;
  response: NextResponse;
};

type PartnerContractFailure = {
  ok: false;
  response: NextResponse;
};

export type GetPartnerContractResult =
  | PartnerContractSuccess
  | PartnerContractFailure;

export async function getPartnerContract(
  id: string,
  markViewed: boolean
): Promise<GetPartnerContractResult> {
  const contract =
    await prisma.rightsContract.findUnique({
      where: {
        id,
      },
      include: {
        project: true,
      },
    });

  if (!contract) {
    return {
      ok: false,
      response: NextResponse.json(
        {
          error: "Contract not found.",
        },
        {
          status: 404,
        }
      ),
    };
  }

  if (
    markViewed &&
    contract.status === "sent" &&
    !contract.viewedAt
  ) {
    const viewedContract =
      await prisma.rightsContract.update({
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

    return {
      ok: true,
      contract: viewedContract,
      response:
        NextResponse.json(viewedContract),
    };
  }

  return {
    ok: true,
    contract,
    response: NextResponse.json(contract),
  };
}