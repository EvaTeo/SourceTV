import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/app/lib/auth";
import {
  mergeRevision,
  MergeRevisionError,
} from "../../lib/mergeRevision";

type RouteContext = {
  params: Promise<{
    id: string;
  }>;
};

export async function POST(
  _request: NextRequest,
  context: RouteContext
) {
  const user = await getCurrentUser();

  if (!user) {
    return NextResponse.json(
      {
        error: "Unauthorized",
      },
      {
        status: 401,
      }
    );
  }

  if (user.role !== "admin") {
    return NextResponse.json(
      {
        error: "Forbidden",
      },
      {
        status: 403,
      }
    );
  }

  const { id } = await context.params;

  if (!id.trim()) {
    return NextResponse.json(
      {
        error: "Revision ID is required.",
      },
      {
        status: 400,
      }
    );
  }

  try {
    const result = await mergeRevision({
      revisionId: id,
      reviewedByEmail: user.email,
    });

    return NextResponse.json({
      success: true,
      project: result.project,
      revision: result.revision,
    });
  } catch (error) {
    if (error instanceof MergeRevisionError) {
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
      "Unable to approve project revision:",
      error
    );

    return NextResponse.json(
      {
        error: "Unable to approve revision.",
      },
      {
        status: 500,
      }
    );
  }
}