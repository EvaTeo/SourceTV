import { getCurrentUser } from "@/app/lib/auth";
import { prisma } from "@/app/lib/prisma";
import { NextResponse } from "next/server";
import { cancelContract } from "./lib/cancel";
import { markContractSigned } from "./lib/markSigned";
import { sendContract } from "./lib/send";
import { updateContract } from "./lib/update";
import {
  EDITABLE_CONTRACT_STATUSES,
  isContractAction,
  type ContractRequestBody,
} from "./lib/validation";

type RouteContext = {
  params: Promise<{
    id: string;
  }>;
};

async function requireAdmin() {
  const user = await getCurrentUser();

  if (!user) {
    return {
      response: NextResponse.json(
        {
          error: "Unauthorized",
        },
        {
          status: 401,
        }
      ),
    };
  }

  if (user.role !== "admin") {
    return {
      response: NextResponse.json(
        {
          error: "Forbidden",
        },
        {
          status: 403,
        }
      ),
    };
  }

  return {
    response: null,
  };
}

async function readContractId(context: RouteContext) {
  const { id } = await context.params;

  return id.trim();
}

export async function GET(
  _request: Request,
  context: RouteContext
) {
  const auth = await requireAdmin();

  if (auth.response) {
    return auth.response;
  }

  try {
    const id = await readContractId(context);

    if (!id) {
      return NextResponse.json(
        {
          error: "Contract ID is required.",
        },
        {
          status: 400,
        }
      );
    }

    const contract =
      await prisma.rightsContract.findUnique({
        where: {
          id,
        },
        include: {
          project: true,
        },
      });

    if (!contract) {
      return NextResponse.json(
        {
          error: "Contract not found.",
        },
        {
          status: 404,
        }
      );
    }

    return NextResponse.json(contract);
  } catch (error) {
    console.error(
      "Unable to load rights contract:",
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
) {
  const auth = await requireAdmin();

  if (auth.response) {
    return auth.response;
  }

  const id = await readContractId(context);

  if (!id) {
    return NextResponse.json(
      {
        error: "Contract ID is required.",
      },
      {
        status: 400,
      }
    );
  }

  let body: ContractRequestBody;

  try {
    body =
      (await request.json()) as ContractRequestBody;
  } catch {
    return NextResponse.json(
      {
        error: "Invalid request body.",
        message:
          "The contract request must contain valid JSON.",
      },
      {
        status: 400,
      }
    );
  }

  try {
    const existingContract =
      await prisma.rightsContract.findUnique({
        where: {
          id,
        },
        include: {
          project: true,
        },
      });

    if (!existingContract) {
      return NextResponse.json(
        {
          error: "Contract not found.",
        },
        {
          status: 404,
        }
      );
    }

    if (existingContract.status === "signed") {
      return NextResponse.json(
        {
          error:
            "This contract has already been signed and can no longer be edited, resent, or cancelled.",
        },
        {
          status: 409,
        }
      );
    }

    if (
      existingContract.status === "cancelled" ||
      existingContract.status === "expired"
    ) {
      return NextResponse.json(
        {
          error:
            "This contract is no longer active.",
        },
        {
          status: 409,
        }
      );
    }

    if (
  !EDITABLE_CONTRACT_STATUSES.some(
    (status) =>
      status === existingContract.status
  )
) {
      return NextResponse.json(
        {
          error:
            "This contract status cannot be edited.",
        },
        {
          status: 409,
        }
      );
    }

    const action = body.action;

    if (
      action !== undefined &&
      action !== null &&
      !isContractAction(action)
    ) {
      return NextResponse.json(
        {
          error: "Invalid contract action.",
        },
        {
          status: 400,
        }
      );
    }

    if (action === "send") {
      return sendContract(existingContract);
    }

    if (action === "mark_signed") {
      return markContractSigned(
        existingContract
      );
    }

    if (action === "cancel") {
      return cancelContract(existingContract);
    }

    return updateContract(
      existingContract,
      body
    );
  } catch (error) {
    console.error(
      "Unable to update rights contract:",
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