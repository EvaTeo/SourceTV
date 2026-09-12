import { NextRequest, NextResponse } from "next/server";

import { requireAdmin } from "@/app/api/admin/lib/auth";

import { userErrorResponse } from "./lib/errors";
import {
  parseUserUpdateRequest,
} from "./lib/parser";
import {
  getUsers,
  updateUser,
} from "./lib/repository";

export async function GET() {
  const authResponse =
    await requireAdmin();

  if (authResponse) {
    return authResponse;
  }

  try {
    const users = await getUsers();

    return NextResponse.json(
      users
    );
  } catch (error) {
    return userErrorResponse(
      error,
      "Failed to load users."
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
    await parseUserUpdateRequest(
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
    const user =
      await updateUser(
        parsed.data
      );

    return NextResponse.json(
      user
    );
  } catch (error) {
    return userErrorResponse(
      error,
      "Failed to update user."
    );
  }
}