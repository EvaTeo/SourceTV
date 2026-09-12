import { NextResponse } from "next/server";

type RequestBody = Record<string, unknown>;

function cleanOptionalString(
  value: unknown
): string | null {
  if (typeof value !== "string") {
    return null;
  }

  const cleaned = value.trim();

  return cleaned || null;
}

export async function parseCreateContractRequest(
  request: Request
) {
  let body: RequestBody;

  try {
    body = (await request.json()) as RequestBody;
  } catch {
    return {
      projectId: null,
      response: NextResponse.json(
        {
          error: "Invalid request body.",
          message:
            "The contract request must contain valid JSON.",
        },
        {
          status: 400,
        }
      ),
    };
  }

  const projectId =
    cleanOptionalString(body.projectId);

  if (!projectId) {
    return {
      projectId: null,
      response: NextResponse.json(
        {
          error: "Project ID is required.",
        },
        {
          status: 400,
        }
      ),
    };
  }

  return {
    projectId,
    response: null,
  };
}