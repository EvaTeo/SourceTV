import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/app/lib/auth";
import { mergeRevision, MergeRevisionError } from "../../lib/mergeRevision";

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

    console.error(error);

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