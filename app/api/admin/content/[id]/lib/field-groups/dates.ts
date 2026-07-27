import type {
  Prisma,
  ProjectSubmission,
} from "@/app/generated/prisma";
import {
  parseOptionalDate,
  validateDateRange,
} from "../parsers";

type RequestBody = Record<string, unknown>;

type ContentUpdate =
  Prisma.ProjectSubmissionUpdateInput;

export function applyDateFields(
  data: ContentUpdate,
  existing: ProjectSubmission,
  body: RequestBody
) {
  const heroStartDate =
    parseOptionalDate(
      body.heroStartDate,
      "Hero start date"
    );

  const heroEndDate =
    parseOptionalDate(
      body.heroEndDate,
      "Hero end date"
    );

  const scheduledAt =
    parseOptionalDate(
      body.scheduledAt,
      "Scheduled release date"
    );

  const publishedAt =
    parseOptionalDate(
      body.publishedAt,
      "Published date"
    );

  const licenseStartDate =
    parseOptionalDate(
      body.licenseStartDate,
      "License start date"
    );

  const licenseEndDate =
    parseOptionalDate(
      body.licenseEndDate,
      "License end date"
    );

  validateDateRange(
    heroStartDate === undefined
      ? existing.heroStartDate
      : heroStartDate,
    heroEndDate === undefined
      ? existing.heroEndDate
      : heroEndDate,
    "Hero start date",
    "hero end date"
  );

  validateDateRange(
    licenseStartDate === undefined
      ? existing.licenseStartDate
      : licenseStartDate,
    licenseEndDate === undefined
      ? existing.licenseEndDate
      : licenseEndDate,
    "License start date",
    "license end date"
  );

  if (heroStartDate !== undefined) {
    data.heroStartDate = heroStartDate;
  }

  if (heroEndDate !== undefined) {
    data.heroEndDate = heroEndDate;
  }

  if (scheduledAt !== undefined) {
    data.scheduledAt = scheduledAt;
  }

  if (publishedAt !== undefined) {
    data.publishedAt = publishedAt;
  }

  if (licenseStartDate !== undefined) {
    data.licenseStartDate =
      licenseStartDate;
  }

  if (licenseEndDate !== undefined) {
    data.licenseEndDate =
      licenseEndDate;
  }
}