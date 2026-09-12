import { getCurrentUser } from "@/app/lib/auth";
import { NextResponse } from "next/server";
import type { PartnerContractsAuthResult } from "./types";

export async function authorizePartnerContractsList(): Promise<PartnerContractsAuthResult> {
  const user = await getCurrentUser();

  if (!user) {
    return {
      ok: false,
      response: NextResponse.json(
        {
          error: "Unauthorized",
        },
        {
          status: 403,
        }
      ),
    };
  }

  if (
    user.role !== "partner" &&
    user.role !== "admin"
  ) {
    return {
      ok: false,
      response: NextResponse.json(
        {
          error: "Unauthorized",
        },
        {
          status: 403,
        }
      ),
    };
  }

  return {
    ok: true,
    user: {
      role: user.role,
      email: user.email,
    },
  };
}