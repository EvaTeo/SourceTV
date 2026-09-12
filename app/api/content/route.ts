import { NextResponse } from "next/server";

import { selectPublicContent } from "./lib/content";
import { contentErrorResponse } from "./lib/errors";
import { parseContentQuery } from "./lib/query";
import { getPublishedContent } from "./lib/repository";

export async function GET(request: Request) {
  try {
    const now = new Date();
    const query = parseContentQuery(request);
    const content = await getPublishedContent(now);
    const result = selectPublicContent(content, query, now);

    return NextResponse.json(result);
  } catch (error: unknown) {
    return contentErrorResponse(error);
  }
}