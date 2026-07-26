import { getCurrentUser } from "@/app/lib/auth";
import { prisma } from "@/app/lib/prisma";
import { NextResponse } from "next/server";

type RouteContext = {
  params: Promise<{
    id: string;
  }>;
};

type RejectRevisionBody = {
  adminNotes?: string;
};

export async function POST(
  request: Request,
  context: RouteContext
) {
  const user = await getCurrentUser();

  if (!user || user.role !== "admin") {
    return NextResponse.json(
      {
        error: "Unauthorized",
      },
      {
        status: 401,
      }
    );
  }

  const { id } = await context.params;

  let body: RejectRevisionBody;

  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      {
        error: "Invalid request body.",
      },
      {
        status: 400,
      }
    );
  }

  const adminNotes = body.adminNotes?.trim();

  if (!adminNotes) {
    return NextResponse.json(
      {
        error:
          "Add a reason explaining why this revision is being rejected.",
      },
      {
        status: 400,
      }
    );
  }

  try {
    const result = await prisma.$transaction(
      async (tx) => {
        const revision =
          await tx.projectRevision.findUnique({
            where: {
              id,
            },
            include: {
              project: {
                select: {
                  id: true,
                  title: true,
                  creatorName: true,
                  creatorCompany: true,
                },
              },
            },
          });

        if (!revision) {
          throw new RejectRevisionError(
            "Revision not found.",
            404
          );
        }

        if (revision.status !== "pending") {
          throw new RejectRevisionError(
            `This revision cannot be rejected because its current status is "${revision.status}".`,
            409
          );
        }

        const reviewedAt = new Date();

        const updatedRevision =
          await tx.projectRevision.update({
            where: {
              id,
            },
            data: {
              status: "rejected",
              adminNotes,
              reviewedByEmail: user.email,
              reviewedAt,
              rejectedAt: reviewedAt,
            },
          });

        const partnerName =
          revision.project.creatorName ||
          revision.project.creatorCompany ||
          null;

        const notification =
          await tx.partnerMessage.create({
            data: {
              projectId: revision.project.id,
              partnerEmail:
                revision.submittedByEmail,
              partnerName,
              senderTeam:
                "SourceTV Content Review",
              subject: `Revision rejected: ${revision.project.title}`,
              body: createRejectionMessage({
                projectTitle:
                  revision.project.title,
                versionNumber:
                  revision.versionNumber,
                adminNotes,
              }),
              isRead: false,
            },
          });

        return {
          revision: updatedRevision,
          notification,
        };
      }
    );

    return NextResponse.json({
      success: true,
      revision: result.revision,
      notification: result.notification,
    });
  } catch (error) {
    if (error instanceof RejectRevisionError) {
      return NextResponse.json(
        {
          error: error.message,
        },
        {
          status: error.status,
        }
      );
    }

    console.error(
      `Unable to reject revision ${id}:`,
      error
    );

    return NextResponse.json(
      {
        error: "Unable to reject revision.",
      },
      {
        status: 500,
      }
    );
  }
}

class RejectRevisionError extends Error {
  status: number;

  constructor(message: string, status: number) {
    super(message);

    this.name = "RejectRevisionError";
    this.status = status;
  }
}

function createRejectionMessage({
  projectTitle,
  versionNumber,
  adminNotes,
}: {
  projectTitle: string;
  versionNumber: number;
  adminNotes: string;
}) {
  return [
    `Your revision for "${projectTitle}" was not approved.`,
    "",
    `Version ${versionNumber} has been marked as rejected by SourceTV Content Review.`,
    "",
    "Review notes:",
    adminNotes,
    "",
    "Please review the feedback, update your project, and submit a new revision when it is ready.",
  ].join("\n");
}