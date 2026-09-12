import { NextResponse } from "next/server";

export class SubmissionError extends Error {
  status: number;

  constructor(message: string, status = 400) {
    super(message);

    this.name = "SubmissionError";
    this.status = status;
  }
}

export function handleSubmissionError(
  error: unknown
) {
  if (error instanceof SubmissionError) {
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
    "SUBMIT API ERROR:",
    error
  );

  return NextResponse.json(
    {
      error:
        "Failed to upload and submit project.",

      message:
        error instanceof Error
          ? error.message
          : "Unknown submission error.",
    },
    {
      status: 500,
    }
  );
}