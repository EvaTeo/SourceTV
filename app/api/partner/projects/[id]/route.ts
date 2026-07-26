import { NextResponse } from "next/server";
import {
  authorizeProject,
  ProjectAuthorizationError,
} from "./lib/authorizeProject";
import {
  parseProjectForm,
  ProjectFormError,
} from "./lib/parseProjectForm";
import {
  validateProject,
  ProjectValidationError,
} from "./lib/validateProject";
import { uploadImages } from "./lib/uploadImages";
import { uploadVideoToBunny } from "./lib/uploadVideo";
import {
  createRevision,
  RevisionSubmissionError,
} from "./lib/createRevision";

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

    return NextResponse.json(project);
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