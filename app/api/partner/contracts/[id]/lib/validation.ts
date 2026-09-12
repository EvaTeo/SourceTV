import type {
  PartnerContractAction,
  PartnerContractRequestBody,
} from "./types";

export const SIGNABLE_CONTRACT_STATUSES = [
  "sent",
  "viewed",
] as const;

export const CHANGE_REQUEST_CONTRACT_STATUSES = [
  "sent",
  "viewed",
] as const;

const MAX_SIGNATURE_NAME_LENGTH = 200;
const MAX_PARTNER_NOTES_LENGTH = 5000;
const MAX_SIGNATURE_DATA_URL_LENGTH = 2_500_000;

export class PartnerContractValidationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "PartnerContractValidationError";
  }
}

export function isPartnerContractAction(
  value: unknown
): value is PartnerContractAction {
  return value === "sign" || value === "request_changes";
}

export function parsePartnerContractBody(
  value: unknown
): PartnerContractRequestBody {
  if (!value || typeof value !== "object") {
    throw new PartnerContractValidationError(
      "Invalid request body."
    );
  }

  return value as PartnerContractRequestBody;
}

export function isAllowedContractStatus(
  allowedStatuses: readonly string[],
  currentStatus: string
) {
  return allowedStatuses.some(
    (status) => status === currentStatus
  );
}

export function validateSignatureName(
  value: unknown
) {
  return validateRequiredText(
    value,
    "Signature name",
    MAX_SIGNATURE_NAME_LENGTH
  );
}

export function validatePartnerNotes(
  value: unknown
) {
  return validateRequiredText(
    value,
    "Requested changes",
    MAX_PARTNER_NOTES_LENGTH
  );
}

export function validateSignatureDataUrl(
  value: unknown
) {
  const signatureDataUrl = validateRequiredText(
    value,
    "Drawn signature",
    MAX_SIGNATURE_DATA_URL_LENGTH
  );

  const validSignatureFormat =
    /^data:image\/(?:png|jpeg|jpg|webp);base64,[A-Za-z0-9+/=\s]+$/.test(
      signatureDataUrl
    );

  if (!validSignatureFormat) {
    throw new PartnerContractValidationError(
      "The drawn signature must be a valid image."
    );
  }

  return signatureDataUrl;
}

function validateRequiredText(
  value: unknown,
  fieldName: string,
  maximumLength: number
) {
  if (typeof value !== "string") {
    throw new PartnerContractValidationError(
      `${fieldName} is required.`
    );
  }

  const cleanedValue = value.trim();

  if (!cleanedValue) {
    throw new PartnerContractValidationError(
      `${fieldName} is required.`
    );
  }

  if (cleanedValue.length > maximumLength) {
    throw new PartnerContractValidationError(
      `${fieldName} is too long.`
    );
  }

  return cleanedValue;
}