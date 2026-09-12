import type { Prisma } from "@/app/generated/prisma";
import type { NextResponse } from "next/server";

export type ContractListUser = {
  role: string;
  email: string | null;
};

export type PartnerContractListItem =
  Prisma.RightsContractGetPayload<{
    include: {
      project: true;
    };
  }>;

export type PartnerContractsAuthResult =
  | {
      ok: true;
      user: ContractListUser;
    }
  | {
      ok: false;
      response: NextResponse;
    };