import { NextResponse } from "next/server";
import { getCurrentUser } from "@/app/lib/auth";
import { prisma } from "@/app/lib/prisma";

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
    const revision =
      await prisma.projectRevision.findUnique({
        where: {
          id,
        },
        select: {
          id: true,
          status: true,
        },
      });

    if (!revision) {
      return NextResponse.json(
        {
          error: "Revision not found.",
        },
        {
          status: 404,
        }
      );
    }

    if (revision.status !== "pending") {
      return NextResponse.json(
        {
          error: `This revision cannot receive a change request because its current status is "${revision.status}".`,
        },
        {
          status: 409,
        }
      );
    }

    const updatedRevision =
      await prisma.projectRevision.update({
        where: {
          id,
        },
        data: {
          status: "changes_requested",
          adminNotes,
          reviewedByEmail: user.email,
          reviewedAt: new Date(),
          changesRequestedAt: new Date(),
        },
      });

    return NextResponse.json({
      success: true,
      revision: updatedRevision,
    });
  } catch (error) {
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