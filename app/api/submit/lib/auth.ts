import { getCurrentUser } from "@/app/lib/auth";

import { SubmissionError } from "./errors";

export async function authorizeSubmission() {
  const user = await getCurrentUser();

  if (!user) {
    throw new SubmissionError(
      "Not logged in.",
      401
    );
  }

  if (
    user.role !== "partner" &&
    user.role !== "admin"
  ) {
    throw new SubmissionError(
      "Only approved SourceTV partners can submit projects.",
      403
    );
  }

  return user;
}