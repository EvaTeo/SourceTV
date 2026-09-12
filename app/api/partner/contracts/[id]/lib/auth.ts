import { NextResponse } from "next/server";
import type { PartnerContractWithProject } from "./types";

type ContractUser = {
  role: string;
  email: string | null;
};

export function verifyPartnerContractAccess(
  user: ContractUser,
  contract: PartnerContractWithProject
) {
  if (
    user.role !== "partner" &&
    user.role !== "admin"
  ) {
    return NextResponse.json(
      {
        error: "Forbidden",
      },
      {
        status: 403,
      }
    );
  }

  if (user.role === "admin") {
    return null;
  }

  const userEmail = normalizeEmail(user.email);
  const partnerEmail = normalizeEmail(
    contract.partnerEmail
  );

  if (
    !userEmail ||
    !partnerEmail ||
    userEmail !== partnerEmail
  ) {
    return NextResponse.json(
      {
        error: "Forbidden",
      },
      {
        status: 403,
      }
    );
  }

  return null;
}

export function verifyPartnerActionAccess(
  user: ContractUser,
  contract: PartnerContractWithProject
) {
  if (user.role !== "partner") {
    return NextResponse.json(
      {
        error:
          "Only the assigned partner can complete this action.",
      },
      {
        status: 403,
      }
    );
  }

  const userEmail = normalizeEmail(user.email);
  const partnerEmail = normalizeEmail(
    contract.partnerEmail
  );

  if (
    !userEmail ||
    !partnerEmail ||
    userEmail !== partnerEmail
  ) {
    return NextResponse.json(
      {
        error: "Forbidden",
      },
      {
        status: 403,
      }
    );
  }

  return null;
}

function normalizeEmail(
  value: string | null | undefined
) {
  return value?.trim().toLowerCase() || null;
}