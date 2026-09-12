import type { Prisma } from "@/app/generated/prisma";

export type RouteContext = {
  params: Promise<{
    id: string;
  }>;
};

export type PartnerContractAction =
  | "sign"
  | "request_changes";

export type PartnerContractRequestBody = {
  action?: unknown;
  signatureName?: unknown;
  signatureDataUrl?: unknown;
  partnerNotes?: unknown;
};

export type PartnerContractWithProject =
  Prisma.RightsContractGetPayload<{
    include: {
      project: true;
    };
  }>;