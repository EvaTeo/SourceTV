export const EDITABLE_CONTRACT_STATUSES = [
  "draft",
  "sent",
  "viewed",
  "changes_requested",
] as const;

export const CONTRACT_ACTIONS = [
  "send",
  "mark_signed",
  "cancel",
] as const;

export type ContractAction =
  (typeof CONTRACT_ACTIONS)[number];

export type ContractRequestBody = {
  action?: unknown;
  partnerEmail?: unknown;
  partnerName?: unknown;
  rightsOwner?: unknown;
  rightsContact?: unknown;
  licenseType?: unknown;
  licenseStartDate?: unknown;
  licenseEndDate?: unknown;
  territories?: unknown;
  exclusivity?: unknown;
  revenueShare?: unknown;
  contractText?: unknown;
  adminNotes?: unknown;
};

export class ContractValidationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "ContractValidationError";
  }
}

export function isContractAction(
  value: unknown
): value is ContractAction {
  return (
    typeof value === "string" &&
    CONTRACT_ACTIONS.includes(
      value as ContractAction
    )
  );
}

export function cleanNullableString(
  value: unknown,
  currentValue: string | null
): string | null {
  if (value === undefined) {
    return currentValue;
  }

  if (value === null) {
    return null;
  }

  if (typeof value !== "string") {
    throw new ContractValidationError(
      "Expected a text value."
    );
  }

  const cleaned = value.trim();

  return cleaned || null;
}

export function cleanRequiredString(
  value: unknown,
  currentValue: string | null,
  fieldName: string
): string {
  if (value === undefined) {
    const current = currentValue?.trim();

    if (!current) {
      throw new ContractValidationError(
        `${fieldName} is required.`
      );
    }

    return current;
  }

  if (typeof value !== "string") {
    throw new ContractValidationError(
      `${fieldName} must be text.`
    );
  }

  const cleaned = value.trim();

  if (!cleaned) {
    throw new ContractValidationError(
      `${fieldName} is required.`
    );
  }

  return cleaned;
}

export function cleanEmail(
  value: unknown,
  currentValue: string | null
): string | null {
  const email = cleanNullableString(
    value,
    currentValue
  );

  if (!email) {
    return null;
  }

  const validEmail =
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (!validEmail.test(email)) {
    throw new ContractValidationError(
      "Enter a valid email address."
    );
  }

  return email.toLowerCase();
}

export function parseRevenueShare(
  value: unknown,
  currentValue: number
): number {
  if (value === undefined) {
    return currentValue;
  }

  const parsed =
    typeof value === "number"
      ? value
      : typeof value === "string" &&
          value.trim() !== ""
        ? Number(value)
        : Number.NaN;

  if (!Number.isFinite(parsed)) {
    throw new ContractValidationError(
      "Revenue share must be a valid number."
    );
  }

  if (parsed < 0 || parsed > 100) {
    throw new ContractValidationError(
      "Revenue share must be between 0 and 100."
    );
  }

  return parsed;
}