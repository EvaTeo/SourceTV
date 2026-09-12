import type {
  ProjectSubmission,
  RightsContract,
} from "@/app/generated/prisma";
import { prisma } from "@/app/lib/prisma";
import { NextResponse } from "next/server";
import {
  parseContractDate,
  validateLicenseDates,
} from "./dates";
import {
  cleanEmail,
  cleanNullableString,
  cleanRequiredString,
  ContractValidationError,
  parseRevenueShare,
  type ContractRequestBody,
} from "./validation";

type ContractWithProject =
  RightsContract & {
    project: ProjectSubmission;
  };

export async function updateContract(
  existingContract: ContractWithProject,
  body: ContractRequestBody
) {
  try {
    const licenseStartDate =
      parseContractDate(
        body.licenseStartDate,
        existingContract.licenseStartDate,
        "License start date"
      );

    const licenseEndDate =
      parseContractDate(
        body.licenseEndDate,
        existingContract.licenseEndDate,
        "License end date"
      );

    validateLicenseDates(
      licenseStartDate,
      licenseEndDate
    );

    const partnerEmail = cleanEmail(
      body.partnerEmail,
      existingContract.partnerEmail
    );

    const partnerName =
      cleanNullableString(
        body.partnerName,
        existingContract.partnerName
      );

    const rightsOwner =
      cleanNullableString(
        body.rightsOwner,
        existingContract.rightsOwner
      );

    const rightsContact = cleanEmail(
      body.rightsContact,
      existingContract.rightsContact
    );

    const licenseType =
      cleanRequiredString(
        body.licenseType,
        existingContract.licenseType,
        "License type"
      );

    const territories =
      cleanRequiredString(
        body.territories,
        existingContract.territories,
        "Territories"
      );

    const exclusivity =
      cleanRequiredString(
        body.exclusivity,
        existingContract.exclusivity,
        "Exclusivity"
      );

    const revenueShare =
      parseRevenueShare(
        body.revenueShare,
        existingContract.revenueShare
      );

    const contractText =
      cleanRequiredString(
        body.contractText,
        existingContract.contractText,
        "Contract text"
      );

    const adminNotes =
      cleanNullableString(
        body.adminNotes,
        existingContract.adminNotes
      );

    const contract =
      await prisma.rightsContract.update({
        where: {
          id: existingContract.id,
        },
        data: {
          partnerEmail,
          partnerName,
          rightsOwner,
          rightsContact,
          licenseType,
          licenseStartDate,
          licenseEndDate,
          territories,
          exclusivity,
          revenueShare,
          contractText,
          adminNotes,
        },
        include: {
          project: true,
        },
      });

    return NextResponse.json(contract);
  } catch (error) {
    if (
      error instanceof
      ContractValidationError
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

    throw error;
  }
}