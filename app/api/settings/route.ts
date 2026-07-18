import {
  defaultPlatformSettings,
  getPlatformSettings,
} from "@/app/lib/platformSettings";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const settings = await getPlatformSettings();

    return NextResponse.json(settings, {
      status: 200,
      headers: {
        "Cache-Control":
          "no-store, no-cache, must-revalidate",
      },
    });
  } catch (error) {
    console.error(
      "PUBLIC SETTINGS LOAD ERROR:",
      error
    );

    return NextResponse.json(
      defaultPlatformSettings,
      {
        status: 200,
        headers: {
          "Cache-Control":
            "no-store, no-cache, must-revalidate",
        },
      }
    );
  }
}