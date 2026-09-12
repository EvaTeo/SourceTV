import { NextRequest } from "next/server";

const ALLOWED_ROLES = [
  "user",
  "viewer",
  "partner",
  "admin",
] as const;

const ALLOWED_ACTIONS = [
  "grant_premium",
  "remove_premium",
  "lifetime_premium",
] as const;

export type UserRole =
  (typeof ALLOWED_ROLES)[number];

export type UserAction =
  (typeof ALLOWED_ACTIONS)[number];

export type UserUpdateInput = {
  userId: string;
  role?: UserRole;
  action?: UserAction;
};

export async function parseUserUpdateRequest(
  request: NextRequest
): Promise<
  | {
      success: true;
      data: UserUpdateInput;
    }
  | {
      success: false;
      error: string;
    }
> {
  try {
    const body = (await request.json()) as Record<
      string,
      unknown
    >;

    const userId = String(
      body.userId ?? ""
    ).trim();

    const role = String(
      body.role ?? ""
    )
      .trim()
      .toLowerCase();

    const action = String(
      body.action ?? ""
    )
      .trim()
      .toLowerCase();

    if (!userId) {
      return {
        success: false,
        error: "User ID is required.",
      };
    }

    if (action) {
      if (
        !ALLOWED_ACTIONS.includes(
          action as UserAction
        )
      ) {
        return {
          success: false,
          error: "Invalid user action.",
        };
      }

      return {
        success: true,
        data: {
          userId,
          action: action as UserAction,
        },
      };
    }

    if (!role) {
      return {
        success: false,
        error: "Role or action is required.",
      };
    }

    if (
      !ALLOWED_ROLES.includes(
        role as UserRole
      )
    ) {
      return {
        success: false,
        error: "Invalid role.",
      };
    }

    return {
      success: true,
      data: {
        userId,
        role: role as UserRole,
      },
    };
  } catch {
    return {
      success: false,
      error: "Invalid request body.",
    };
  }
}