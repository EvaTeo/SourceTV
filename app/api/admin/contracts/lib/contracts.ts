import { prisma } from "@/app/lib/prisma";

import { buildDefaultContractText } from "./template";

const OPEN_CONTRACT_STATUSES = [
  "draft",
  "sent",
  "viewed",
  "changes_requested",
  "signed",
] as const;

export async function getContracts() {
  return prisma.rightsContract.findMany({
    orderBy: {
      createdAt: "desc",
    },
    include: {
      project: true,
    },
  });
}

export async function createContractForProject(
  projectId: string
) {
  return prisma.$transaction(async (tx) => {
    const project =
      await tx.projectSubmission.findUnique({
        where: {
          id: projectId,
        },
      });

    if (!project) {
      return {
        status: "not_found" as const,
      };
    }

    const existingContract =
      await tx.rightsContract.findFirst({
        where: {
          projectId,
          status: {
            in: [...OPEN_CONTRACT_STATUSES],
          },
        },
        orderBy: {
          createdAt: "desc",
        },
        include: {
          project: true,
        },
      });

    if (existingContract) {
      return {
        status: "existing" as const,
        contract: existingContract,
      };
    }

    const partnerName =
      project.creatorName ||
      project.creatorCompany ||
      null;

    const partnerEmail =
      project.creatorEmail || null;

    const rightsOwner =
      project.rightsOwner ||
      project.creatorCompany ||
      project.creatorName ||
      null;

    const rightsContact =
      project.rightsContact ||
      project.creatorEmail ||
      null;

    const licenseType =
      project.licenseType ||
      "Streaming License";

    const territories =
      project.territories ||
      "United States";

    const exclusivity =
      project.exclusivity ||
      "Non-exclusive";

    const revenueShare =
      project.revenueShare;

    const contract =
      await tx.rightsContract.create({
        data: {
          projectId: project.id,

          partnerEmail,
          partnerName,

          rightsOwner,
          rightsContact,

          status: "draft",

          licenseType,
          licenseStartDate:
            project.licenseStartDate,
          licenseEndDate:
            project.licenseEndDate,
          territories,
          exclusivity,
          revenueShare,

          contractText:
            buildDefaultContractText({
              title: project.title,
              partnerName:
                partnerName || "",
              rightsOwner:
                rightsOwner || "",
              licenseType,
              territories,
              exclusivity,
              revenueShare,
              licenseStartDate:
                project.licenseStartDate,
              licenseEndDate:
                project.licenseEndDate,
            }),
        },
        include: {
          project: true,
        },
      });

    return {
      status: "created" as const,
      contract,
    };
  });
}