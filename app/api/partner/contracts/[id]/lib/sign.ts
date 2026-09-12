import { prisma } from "@/app/lib/prisma";
import { NextResponse } from "next/server";
import type { PartnerContractWithProject } from "./types";
import {
  PartnerContractValidationError,
  SIGNABLE_CONTRACT_STATUSES,
  isAllowedContractStatus,
  validateSignatureDataUrl,
  validateSignatureName,
} from "./validation";

type SignContractParams = {
  contract: PartnerContractWithProject;
  signatureName: unknown;
  signatureDataUrl: unknown;
};

export async function signContract({
  contract,
  signatureName,
  signatureDataUrl,
}: SignContractParams) {
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
      SIGNABLE_CONTRACT_STATUSES,
      contract.status
    )
  ) {
    return NextResponse.json(
      {
        error:
          "This contract cannot be signed in its current state.",
      },
      {
        status: 409,
      }
    );
  }

  try {
    const cleanedName =
      validateSignatureName(
        signatureName
      );

    const cleanedSignature =
      validateSignatureDataUrl(
        signatureDataUrl
      );

    const updated =
      await prisma.$transaction(
        async (tx) => {
          const signedContract =
            await tx.rightsContract.update({
              where: {
                id: contract.id,
              },
              data: {
                status: "signed",
                signedAt: new Date(),
                partnerSignatureName:
                  cleanedName,
                partnerSignatureDataUrl:
                  cleanedSignature,
              },
              include: {
                project: true,
              },
            });

          await tx.partnerMessage.create({
            data: {
              projectId:
                signedContract.projectId,
              senderTeam: "Partner",
              subject:
                "Contract Signed",
              body: `${
                signedContract.partnerName ??
                signedContract.partnerEmail
              } signed the streaming rights agreement for "${signedContract.project.title}".`,
            },
          });

          return signedContract;
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