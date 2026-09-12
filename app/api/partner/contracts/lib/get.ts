import { prisma } from "@/app/lib/prisma";
import { PARTNER_VISIBLE_CONTRACT_STATUSES } from "./constants";
import type {
  ContractListUser,
  PartnerContractListItem,
} from "./types";

export async function getPartnerContracts(
  user: ContractListUser
): Promise<PartnerContractListItem[]> {
  return prisma.rightsContract.findMany({
    where:
      user.role === "admin"
        ? undefined
        : {
            partnerEmail: user.email,
            status: {
              in: [
                ...PARTNER_VISIBLE_CONTRACT_STATUSES,
              ],
            },
          },
    include: {
      project: true,
    },
    orderBy: {
      updatedAt: "desc",
    },
  });
}