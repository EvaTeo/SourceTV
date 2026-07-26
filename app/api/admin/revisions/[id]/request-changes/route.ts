import { getCurrentUser } from "@/app/lib/auth";
import { prisma } from "@/app/lib/prisma";
import { NextResponse } from "next/server";

type RouteContext = {
  params: Promise<{
    id: string;
  }>;
};

type RequestChangesBody = {
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

  let body: RequestChangesBody;

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
          "Add a message explaining what the partner needs to change.",
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
          throw new RequestChangesError(
            "Revision not found.",
            404
          );
        }

        if (revision.status !== "pending") {
          throw new RequestChangesError(
            `This revision cannot receive a change request because its current status is "${revision.status}".`,
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
              status: "changes_requested",
              adminNotes,
              reviewedByEmail: user.email,
              reviewedAt,
              changesRequestedAt: reviewedAt,
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
              subject: `Changes requested: ${revision.project.title}`,
              body: createChangesRequestedMessage({
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
    if (error instanceof RequestChangesError) {
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
      `Unable to request changes for revision ${id}:`,
      error
    );

    return NextResponse.json(
      {
        error: "Unable to request changes.",
      },
      {
        status: 500,
      }
    );
  }
}

class RequestChangesError extends Error {
  status: number;

  constructor(message: string, status: number) {
    super(message);

    this.name = "RequestChangesError";
    this.status = status;
  }
}

function createChangesRequestedMessage({
  projectTitle,
  versionNumber,
  adminNotes,
}: {
  projectTitle: string;
  versionNumber: number;
  adminNotes: string;
}) {
  return [
    `SourceTV Content Review has requested changes to your revision for "${projectTitle}".`,
    "",
    `Version ${versionNumber} needs additional updates before it can be approved.`,
    "",
    "Requested changes:",
    adminNotes,
    "",
    "Open the project from your SourceTV Partner dashboard, make the requested updates, and submit a new revision for review.",
  ].join("\n");
}