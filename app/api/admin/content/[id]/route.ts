import { getCurrentUser } from "@/app/lib/auth";
import { prisma } from "@/app/lib/prisma";
import { NextResponse } from "next/server";
import { buildActionUpdate } from "./lib/actions";
import { isSupportedAction } from "./lib/constants";
import { ContentRouteError } from "./lib/errors";
import { buildFieldUpdate } from "./lib/fields";
import { sendPartnerMessage } from "./lib/message";

type RouteContext = {
  params: Promise<{
    id: string;
  }>;
};

type RequestBody = Record<string, unknown>;

export async function PATCH(
  req: Request,
  { params }: RouteContext
) {
  try {
    const user = await getCurrentUser();

    if (!user || user.role !== "admin") {
      return NextResponse.json(
        {
          error: "Unauthorized",
        },
        {
          status: 403,
        }
      );
    }

    const { id } = await params;
    const body = (await req.json()) as RequestBody;

    if (
      body.action !== undefined &&
      !isSupportedAction(body.action)
    ) {
      return NextResponse.json(
        {
          error: "Unsupported action",
          message: `The action "${String(
            body.action
          )}" is not supported.`,
        },
        {
          status: 400,
        }
      );
    }

    const existing =
      await prisma.projectSubmission.findUnique({
        where: {
          id,
        },
      });

    if (!existing) {
      return NextResponse.json(
        {
          error: "Content not found",
        },
        {
          status: 404,
        }
      );
    }

    if (body.action === "send_message") {
      const partnerMessage =
        await sendPartnerMessage(existing, body);

      return NextResponse.json({
        success: true,
        message: "Partner message sent",
        partnerMessage,
      });
    }

    const actionUpdate = buildActionUpdate(
      existing,
      body
    );

    const fieldUpdate = buildFieldUpdate(
      existing,
      body
    );

    const data = {
      ...actionUpdate,
      ...fieldUpdate,
    };

    if (Object.keys(data).length === 0) {
      return NextResponse.json(
        {
          error: "No changes provided",
          message:
            "The request did not contain a supported update.",
        },
        {
          status: 400,
        }
      );
    }

    const updated =
      await prisma.projectSubmission.update({
        where: {
          id,
        },
        data,
      });

    return NextResponse.json({
      success: true,
      project: updated,
    });
  } catch (error: unknown) {
    if (error instanceof ContentRouteError) {
      return NextResponse.json(
        {
          error: error.error,
          message: error.message,
          ...(error.details
            ? {
                details: error.details,
              }
            : {}),
        },
        {
          status: error.status,
        }
      );
    }

    console.error(
      "ADMIN CONTENT UPDATE ERROR:",
      error
    );

    return NextResponse.json(
      {
        error: "Failed to update content",
        message:
          error instanceof Error
            ? error.message
            : "Unknown error",
      },
      {
        status: 500,
      }
    );
  }
}