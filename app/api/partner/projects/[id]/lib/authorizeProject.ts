import { getCurrentUser } from "@/app/lib/auth";
import { prisma } from "@/app/lib/prisma";

export class ProjectAuthorizationError extends Error {
  status: number;

  constructor(message: string, status: number) {
    super(message);

    this.name = "ProjectAuthorizationError";
    this.status = status;
  }
}

export async function authorizeProject(
  projectId: string
) {
  const user = await getCurrentUser();

  if (!user) {
    throw new ProjectAuthorizationError(
      "Not logged in.",
      401
    );
  }

  if (
    user.role !== "partner" &&
    user.role !== "admin"
  ) {
    throw new ProjectAuthorizationError(
      "Only SourceTV partners can manage projects.",
      403
    );
  }

  const project =
    await prisma.projectSubmission.findFirst({
      where:
        user.role === "admin"
          ? {
              id: projectId,
            }
          : {
              id: projectId,
              creatorEmail: user.email,
            },

      include: {
        rightsContracts: {
          orderBy: {
            updatedAt: "desc",
          },
        },

        projectRevisions: {
          orderBy: {
            createdAt: "desc",
          },

          take: 10,
        },
      },
    });

  if (!project) {
    throw new ProjectAuthorizationError(
      "Project not found or you do not have permission to access it.",
      404
    );
  }

  return {
    user,
    project,
  };
}