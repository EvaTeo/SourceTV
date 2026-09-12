import { NextResponse } from "next/server";
import { authorizePartnerContractsList } from "./lib/auth";
import { getPartnerContracts } from "./lib/get";

export async function GET() {
  const auth = await authorizePartnerContractsList();

  if (!auth.ok) {
    return auth.response;
  }

  try {
    const contracts = await getPartnerContracts(
      auth.user
    );

    return NextResponse.json(contracts);
  } catch (error) {
    console.error(
      "Failed to load partner contracts:",
      error
    );

    return NextResponse.json(
      {
        error: "Failed to load contracts",
        message:
          error instanceof Error
            ? error.message
            : "Unknown error",
      },
      {
        status: 500,
      }
    );
  }
}