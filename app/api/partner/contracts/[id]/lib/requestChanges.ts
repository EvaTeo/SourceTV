import { prisma } from "@/app/lib/prisma";
import { NextResponse } from "next/server";
import type { PartnerContractWithProject } from "./types";
import {
  CHANGE_REQUEST_CONTRACT_STATUSES,
  isAllowedContractStatus,
  PartnerContractValidationError,
  validatePartnerNotes,
} from "./validation";

type RequestChangesParams = {
  contract: PartnerContractWithProject;
  partnerNotes: unknown;
};

export async function requestContractChanges({
  contract,
  partnerNotes,
}: RequestChangesParams) {
  if (
    contract.status === "signed"
  ) {
    return NextResponse.json(
      {
        error:
          "This contract has already been signed.",
      },
      {
        status: 409,
      }
    );
  }

  if (
    contract.status === "cancelled" ||
    contract.status === "expired"
  ) {
    return NextResponse.json(
      {
        error:
          "This contract is no longer active.",
      },
      {
        status: 409,
      }
    );
  }

  if (
    !isAllowedContractStatus(
      CHANGE_REQUEST_CONTRACT_STATUSES,
      contract.status
    )
  ) {
    return NextResponse.json(
      {
        error:
          "Changes cannot be requested for this contract in its current state.",
      },
      {
        status: 409,
      }
    );
  }

  try {
    const cleanedNotes =
      validatePartnerNotes(
        partnerNotes
      );

    const updated =
      await prisma.$transaction(
        async (tx) => {
          const updatedContract =
            await tx.rightsContract.update({
              where: {
                id: contract.id,
              },
              data: {
                status:
                  "changes_requested",
                partnerNotes:
                  cleanedNotes,
              },
              include: {
                project: true,
              },
            });

          await tx.partnerMessage.create({
            data: {
              projectId:
                updatedContract.projectId,
              senderTeam: "Partner",
              subject:
                "Contract Changes Requested",
              body: cleanedNotes,
            },
          });

          return updatedContract;
        }
      );

    return NextResponse.json(updated);
  } catch (error) {
    if (
      error instanceof
      PartnerContractValidationError
    ) {
      return NextResponse.json(
        {
          error: error.message,
        },
        {
          status: 400,
        }
      );
    }

    throw error;
  }
}