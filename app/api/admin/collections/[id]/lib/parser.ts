import { NextRequest } from "next/server";

export async function parseCollectionUpdate(
  request: NextRequest
): Promise<
  | {
      success: true;
      data: Record<string, unknown>;
    }
  | {
      success: false;
      error: string;
    }
> {
  try {
    const body =
      (await request.json()) as Record<
        string,
        unknown
      >;

    return {
      success: true,
      data: body,
    };
  } catch {
    return {
      success: false,
      error: "Invalid request body.",
    };
  }
}