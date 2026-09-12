import type {
  AdminContract,
  ContractAction,
} from "../types";

import { formatDateInput } from "../utils";

async function readJson(
  response: Response
) {
  return response
    .json()
    .catch(() => null);
}

export async function fetchAdminContract(
  id: string
): Promise<AdminContract> {
  const response = await fetch(
    `/api/admin/contracts/${id}`,
    {
      cache: "no-store",
    }
  );

  if (
    response.status === 403
  ) {
    window.location.href =
      "/login";

    throw new Error(
      "Authentication required."
    );
  }

  const data =
    await readJson(response);

  if (!response.ok) {
    throw new Error(
      data?.error ||
        "Could not load contract."
    );
  }

  return data;
}

export async function saveAdminContract(
  contract: AdminContract,
  action?: ContractAction
): Promise<AdminContract> {
  const body = action
    ? {
        action,
      }
    : {
        partnerName:
          contract.partnerName ||
          "",

        partnerEmail:
          contract.partnerEmail ||
          "",

        rightsOwner:
          contract.rightsOwner ||
          "",

        rightsContact:
          contract.rightsContact ||
          "",

        licenseType:
          contract.licenseType ||
          "",

        licenseStartDate:
          contract.licenseStartDate
            ? formatDateInput(
                contract.licenseStartDate
              )
            : "",

        licenseEndDate:
          contract.licenseEndDate
            ? formatDateInput(
                contract.licenseEndDate
              )
            : "",

        territories:
          contract.territories ||
          "",

        exclusivity:
          contract.exclusivity ||
          "",

        revenueShare:
          Number(
            contract.revenueShare ||
              50
          ),

        contractText:
          contract.contractText ||
          "",

        adminNotes:
          contract.adminNotes ||
          "",
      };

  const response = await fetch(
    `/api/admin/contracts/${contract.id}`,
    {
      method: "PATCH",

      headers: {
        "Content-Type":
          "application/json",
      },

      body: JSON.stringify(body),
    }
  );

  const data =
    await readJson(response);

  if (!response.ok) {
    throw new Error(
      data?.error ||
        "Could not save contract."
    );
  }

  return data;
}