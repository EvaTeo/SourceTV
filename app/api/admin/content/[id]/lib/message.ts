import { prisma } from "@/app/lib/prisma";
import type {
  PartnerMessage,
  ProjectSubmission,
} from "@/app/generated/prisma";
import { ContentRouteError } from "./errors";

type RequestBody = Record<string, unknown>;

type PartnerMessageWithProject =
  PartnerMessage & {
    project: ProjectSubmission | null;
  };

export async function sendPartnerMessage(
  existing: ProjectSubmission,
  body: RequestBody
): Promise<PartnerMessageWithProject> {
  const partnerEmail = String(
    body.partnerEmail ||
      existing.creatorEmail ||
      ""
  ).trim();

  const partnerName = String(
    body.partnerName ||
      existing.creatorCompany ||
      existing.creatorName ||
      ""
  ).trim();

  const senderTeam = String(
    body.senderTeam ||
      "SourceTV Partner Relations"
  ).trim();

  const subject = String(
    body.subject ||
      "Message From SourceTV"
  ).trim();

  const message = String(
    body.message ||
      "A SourceTV team member has contacted you."
  ).trim();

  if (!partnerEmail) {
    throw new ContentRouteError({
      error:
        "This title does not have a partner email.",
      message:
        "Add a partner email before sending this message.",
    });
  }

  if (!subject || !message) {
    throw new ContentRouteError({
      error:
        "Subject and message are required.",
      message:
        "Enter both a subject and message body.",
    });
  }

  return prisma.partnerMessage.create({
    data: {
      projectId: existing.id,
      partnerEmail,
      partnerName: partnerName || null,
      senderTeam,
      subject,
      body: message,
      isRead: false,
    },
    include: {
      project: true,
    },
  });
}