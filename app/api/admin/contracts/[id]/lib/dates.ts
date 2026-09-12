import { ContractValidationError } from "./validation";

const DATE_ONLY_PATTERN =
  /^\d{4}-\d{2}-\d{2}$/;

export function parseContractDate(
  value: unknown,
  currentValue: Date | null,
  fieldName: string
): Date | null {
  if (value === undefined) {
    return currentValue;
  }

  if (value === null || value === "") {
    return null;
  }

  if (typeof value !== "string") {
    throw new ContractValidationError(
      `${fieldName} must be a valid date.`
    );
  }

  const cleaned = value.trim();

  if (!cleaned) {
    return null;
  }

  let parsedDate: Date;

  if (DATE_ONLY_PATTERN.test(cleaned)) {
    parsedDate = new Date(
      `${cleaned}T12:00:00.000Z`
    );
  } else {
    parsedDate = new Date(cleaned);
  }

  if (Number.isNaN(parsedDate.getTime())) {
    throw new ContractValidationError(
      `${fieldName} must be a valid date.`
    );
  }

  return parsedDate;
}

export function validateLicenseDates(
  startDate: Date | null,
  endDate: Date | null
) {
  if (
    startDate &&
    endDate &&
    endDate.getTime() < startDate.getTime()
  ) {
    throw new ContractValidationError(
      "License end date cannot be before the license start date."
    );
  }
}