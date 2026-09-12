import { getCurrentUser } from "@/app/lib/auth";
import { NextResponse } from "next/server";

import {
  verifyPartnerActionAccess,
  verifyPartnerContractAccess,
} from "./lib/auth";
import { getPartnerContract } from "./lib/get";
import { requestContractChanges } from "./lib/requestChanges";
import { signContract } from "./lib/sign";
import type {
  PartnerContractRequestBody,
  RouteContext,
} from "./lib/types";
import {
  isPartnerContractAction,
  parsePartnerContractBody,
  PartnerContractValidationError,
} from "./lib/validation";

export async function GET(
  _request: Request,
  context: RouteContext
): Promise<Response> {
  try {
    const user = await getCurrentUser();

    if (!user) {
      return NextResponse.json(
        {
          error: "Unauthorized",
        },
        {
          status: 401,
        }
      );
    }

    const { id } = await context.params;

    const result =
      await getPartnerContract(
        id,
        user.role === "partner"
      );

    if (!result.ok) {
      return result.response;
    }

    const accessResponse =
      verifyPartnerContractAccess(
        user,
        result.contract
      );

    if (accessResponse) {
      return accessResponse;
    }

    return result.response;
  } catch (error) {
    console.error(
      "Failed to load partner contract:",
      error
    );

    return NextResponse.json(
      {
        error: "Failed to load contract.",
      },
      {
        status: 500,
      }
    );
  }
}

export async function PATCH(
  request: Request,
  context: RouteContext
): Promise<Response> {
  try {
    const user = await getCurrentUser();

    if (!user) {
      return NextResponse.json(
        {
          error: "Unauthorized",
        },
        {
          status: 401,
        }
      );
    }

    const { id } = await context.params;

    const result =
      await getPartnerContract(id, false);

    if (!result.ok) {
      return result.response;
    }

    const accessResponse =
      verifyPartnerActionAccess(
        user,
        result.contract
      );

    if (accessResponse) {
      return accessResponse;
    }

    let requestData: unknown;

    try {
      requestData = await request.json();
    } catch {
      return NextResponse.json(
        {
          error: "Invalid request body.",
        },
        {
          status: 400,
        }
      );
    }

    const body: PartnerContractRequestBody =
      parsePartnerContractBody(
        requestData
      );

    if (
      !isPartnerContractAction(body.action)
    ) {
      return NextResponse.json(
        {
          error: "Invalid action.",
        },
        {
          status: 400,
        }
      );
    }

    if (body.action === "sign") {
      return signContract({
        contract: result.contract,
        signatureName:
          body.signatureName,
        signatureDataUrl:
          body.signatureDataUrl,
      });
    }

    return requestContractChanges({
      contract: result.contract,
      partnerNotes: body.partnerNotes,
    });
  } catch (error) {
    if (
      error instanceof
      PartnerContractValidationError
    ) {
      return NextResponse.json(
        {
          error: error.message,
        },
        {
          status: 400,
        }
      );
    }

    console.error(
      "Failed to update partner contract:",
      error
    );

    return NextResponse.json(
      {
        error: "Failed to update contract.",
      },
      {
        status: 500,
      }
    );
  }
}