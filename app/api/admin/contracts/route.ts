import { requireAdmin } from "@/app/api/admin/lib/auth";
import { NextResponse } from "next/server";

import {
  createContractForProject,
  getContracts,
} from "./lib/contracts";
import { parseCreateContractRequest } from "./lib/parser";

export async function GET() {
  const authResponse = await requireAdmin();

  if (authResponse) {
    return authResponse;
  }

  try {
    const contracts = await getContracts();

    return NextResponse.json(contracts);
  } catch (error) {
    console.error(
      "Unable to load rights contracts:",
      error
    );

    return NextResponse.json(
      {
        error: "Failed to load contracts.",
      },
      {
        status: 500,
      }
    );
  }
}

export async function POST(
  request: Request
) {
  const authResponse = await requireAdmin();

  if (authResponse) {
    return authResponse;
  }

  const parsed =
    await parseCreateContractRequest(
      request
    );

  if (parsed.response) {
    return parsed.response;
  }

  try {
    const result =
      await createContractForProject(
        parsed.projectId
      );

    if (result.status === "not_found") {
      return NextResponse.json(
        {
          error: "Project not found.",
        },
        {
          status: 404,
        }
      );
    }

    if (result.status === "existing") {
      return NextResponse.json(
        result.contract,
        {
          status: 200,
          headers: {
            "X-Contract-Result":
              "existing",
          },
        }
      );
    }

    return NextResponse.json(
      result.contract,
      {
        status: 201,
        headers: {
          "X-Contract-Result": "created",
        },
      }
    );
  } catch (error) {
    console.error(
      "Unable to create rights contract:",
      error
    );

    return NextResponse.json(
      {
        error: "Failed to create contract.",
      },
      {
        status: 500,
      }
    );
  }
}