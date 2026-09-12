import { prisma } from "@/app/lib/prisma";

type CreateAdminMessageInput = {
  projectId?: string;
  partnerEmail: string;
  partnerName?: string;
  senderTeam: string;
  subject: string;
  message: string;
};

export async function getAdminMessages() {
  return prisma.partnerMessage.findMany({
    orderBy: {
      createdAt: "desc",
    },
    include: {
      project: true,
      replies: {
        orderBy: {
          createdAt: "asc",
        },
      },
    },
  });
}

export async function createAdminMessage(
  input: CreateAdminMessageInput
) {
  const projectId = input.projectId || null;
  let resolvedPartnerName =
    input.partnerName?.trim() || "";

  if (projectId) {
    const project =
      await prisma.projectSubmission.findUnique({
        where: {
          id: projectId,
        },
      });

    if (!project) {
      return {
        status: "project_not_found" as const,
      };
    }

    if (!resolvedPartnerName) {
      resolvedPartnerName =
        project.creatorName ||
        project.creatorCompany ||
        input.partnerEmail;
    }
  }

  const message =
    await prisma.partnerMessage.create({
      data: {
        projectId,
        partnerEmail: input.partnerEmail,
        partnerName:
          resolvedPartnerName || null,
        senderTeam: input.senderTeam,
        subject: input.subject,
        body: input.message,
        isRead: false,
      },
      include: {
        project: true,
        replies: {
          orderBy: {
            createdAt: "asc",
          },
        },
      },
    });

  return {
    status: "created" as const,
    message,
  };
}

export async function markPartnerRepliesRead(
  messageId: string
) {
  await prisma.partnerMessageReply.updateMany({
    where: {
      messageId,
      senderRole: "partner",
      isRead: false,
    },
    data: {
      isRead: true,
    },
  });

  return prisma.partnerMessage.findUnique({
    where: {
      id: messageId,
    },
    include: {
      project: true,
      replies: {
        orderBy: {
          createdAt: "asc",
        },
      },
    },
  });
}