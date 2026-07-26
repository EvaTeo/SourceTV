import { getCurrentUser } from "@/app/lib/auth";
import { prisma } from "@/app/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const user = await getCurrentUser();

    if (!user) {
      return NextResponse.json(
        { error: "Not logged in" },
        { status: 401 }
      );
    }

    if (
      user.role !== "partner" &&
      user.role !== "admin"
    ) {
      return NextResponse.json(
        {
          error: "Only partners can view projects",
        },
        { status: 403 }
      );
    }

    const projects =
      await prisma.projectSubmission.findMany({
        where:
          user.role === "admin"
            ? {}
            : {
                creatorEmail: user.email,
              },

        orderBy: {
          updatedAt: "desc",
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
            take: 1,
          },
        },
      });

    const formattedProjects = projects.map(
      (project) => {
        const latestRevision =
          project.projectRevisions[0] ?? null;

        return {
          ...project,
          latestRevision,
          projectRevisions: undefined,
        };
      }
    );

    return NextResponse.json(
      formattedProjects
    );
  } catch (error) {
    console.error(
      "PARTNER PROJECTS API ERROR:",
      error
    );

    return NextResponse.json(
      {
        error:
          "Failed to load partner projects",
      },
      { status: 500 }
    );
  }
}