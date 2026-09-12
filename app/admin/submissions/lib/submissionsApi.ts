import type { Submission } from "../types";

async function readErrorMessage(
  response: Response
) {
  try {
    const data = await response.json();

    return (
      data?.message ||
      data?.error ||
      ""
    );
  } catch {
    return "";
  }
}

export async function fetchSubmissions(): Promise<
  Submission[]
> {
  const response = await fetch(
    "/api/submissions",
    {
      cache: "no-store",
    }
  );

  if (response.status === 401) {
    window.location.href = "/login";

    return [];
  }

  if (!response.ok) {
    const message =
      await readErrorMessage(
        response
      );

    throw new Error(
      message ||
        "Could not load submissions."
    );
  }

  const data =
    await response.json();

  if (Array.isArray(data)) {
    return data;
  }

  if (
    Array.isArray(
      data?.submissions
    )
  ) {
    return data.submissions;
  }

  return [];
}

export async function updateSubmissionStatus(
  submissionId: string,
  status: "approved" | "denied"
) {
  const response = await fetch(
    "/api/submissions/update",
    {
      method: "POST",

      headers: {
        "Content-Type":
          "application/json",
      },

      body: JSON.stringify({
        id: submissionId,
        status,
      }),
    }
  );

  if (response.status === 401) {
    window.location.href = "/login";

    return;
  }

  if (!response.ok) {
    const message =
      await readErrorMessage(
        response
      );

    const action =
      status === "approved"
        ? "approve"
        : "deny";

    throw new Error(
      message ||
        `SourceTV could not ${action} this submission.`
    );
  }
}