import { NextRequest, NextResponse } from "next/server";

import { requireAdmin } from "@/app/api/admin/lib/auth";

import { settingsErrorResponse } from "./lib/errors";
import {
  parseSettingsUpdate,
} from "./lib/parser";
import {
  getPlatformSettings,
  updatePlatformSettings,
} from "./lib/repository";

export async function GET() {
  const authResponse =
    await requireAdmin();

  if (authResponse) {
    return authResponse;
  }

  try {
    const settings =
      await getPlatformSettings();

    return NextResponse.json(
      settings
    );
  } catch (error: unknown) {
    return settingsErrorResponse(
      error
    );
  }
}

export async function PATCH(
  request: NextRequest
) {
  const authResponse =
    await requireAdmin();

  if (authResponse) {
    return authResponse;
  }

  const parsed =
    await parseSettingsUpdate(
      request
    );

  if (!parsed.success) {
    return NextResponse.json(
      {
        error: parsed.error,
      },
      {
        status: 400,
      }
    );
  }

  try {
    const settings =
      await updatePlatformSettings(
        parsed.data
      );

    return NextResponse.json(
      settings
    );
  } catch (error: unknown) {
    return settingsErrorResponse(
      error
    );
  }
}