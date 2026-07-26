import { prisma } from "@/app/lib/prisma";
import { NextResponse } from "next/server";

import {
  authorizeProject,
  ProjectAuthorizationError,
} from "./lib/authorizeProject";
import {
  createRevision,
  RevisionSubmissionError,
} from "./lib/createRevision";
import {
  parseProjectForm,
  ProjectFormError,
} from "./lib/parseProjectForm";
import { uploadImages } from "./lib/uploadImages";
import { uploadVideoToBunny } from "./lib/uploadVideo";
import {
  validateProject,
  ProjectValidationError,
} from "./lib/validateProject";

export const runtime = "nodejs";

type RouteContext = {
  params: Promise<{
    id: string;
  }>;
};

type ProjectRouteError =
  | ProjectAuthorizationError
  | ProjectFormError
  | ProjectValidationError
  | RevisionSubmissionError;

function isProjectRouteError(
  error: unknown
): error is ProjectRouteError {
  return (
    error instanceof ProjectAuthorizationError ||
    error instanceof ProjectFormError ||
    error instanceof ProjectValidationError ||
    error instanceof RevisionSubmissionError
  );
}

function createErrorResponse(
  error: unknown,
  fallbackMessage: string
) {
  if (isProjectRouteError(error)) {
    return NextResponse.json(
      {
        error: error.message,
      },
      {
        status: error.status,
      }
    );
  }

  console.error(fallbackMessage, error);

  return NextResponse.json(
    {
      error: fallbackMessage,
    },
    {
      status: 500,
    }
  );
}

export async function GET(
  _request: Request,
  context: RouteContext
) {
  try {
    const { id } = await context.params;

    const { project } =
      await authorizeProject(id);

    const revisionHistory =
      await prisma.projectRevision.findMany({
        where: {
          projectId: project.id,
        },

        orderBy: [
          {
            versionNumber: "desc",
          },
          {
            submittedAt: "desc",
          },
        ],

        select: {
          id: true,
          projectId: true,
          versionNumber: true,
          status: true,

          submittedByEmail: true,
          reviewedByEmail: true,

          partnerNotes: true,
          adminNotes: true,
          changeSummary: true,

          submittedAt: true,
          reviewedAt: true,
          approvedAt: true,
          rejectedAt: true,
          changesRequestedAt: true,
          withdrawnAt: true,

          createdAt: true,
          updatedAt: true,
        },
      });

    return NextResponse.json({
      project,
      revisionHistory,
      latestRevision:
        revisionHistory[0] ?? null,
    });
  } catch (error) {
    return createErrorResponse(
      error,
      "Failed to load project."
    );
  }
}

export async function PATCH(
  request: Request,
  context: RouteContext
) {
  try {
    const { id } = await context.params;

    const { project, user } =
      await authorizeProject(id);

    if (!user.email) {
      return NextResponse.json(
        {
          error:
            "Your account does not have a valid email address.",
        },
        {
          status: 400,
        }
      );
    }

    const contentType =
      request.headers.get("content-type") ??
      "";

    if (
      !contentType.includes(
        "multipart/form-data"
      )
    ) {
      return NextResponse.json(
        {
          error:
            "This endpoint requires multipart form data.",
        },
        {
          status: 415,
        }
      );
    }

    const formData =
      await request.formData();

    const form =
      parseProjectForm(formData);

    validateProject(form);

    const mainVideo =
      form.mainVideoFile
        ? await uploadVideoToBunny(
            form.title,
            form.mainVideoFile
          )
        : null;

    const trailerVideo =
      form.trailerFile
        ? await uploadVideoToBunny(
            `${form.title} Trailer`,
            form.trailerFile
          )
        : null;

    const images = await uploadImages({
      title: form.title,
      thumbnailFile:
        form.thumbnailFile,
      backdropFile:
        form.backdropFile,
      titleLogoFile:
        form.titleLogoFile,
    });

    const revision =
      await createRevision({
        project,
        user: {
          email: user.email,
        },
        form,
        mainVideo,
        trailerVideo,
        images,
      });

    return NextResponse.json(
      {
        success: true,
        revision,
        uploads: {
          mainVideo,
          trailerVideo,
          images,
        },
        message:
          "Revision submitted for SourceTV review.",
      },
      {
        status: 201,
      }
    );
  } catch (error) {
    return createErrorResponse(
      error,
      "Failed to submit project revision."
    );
  }
}