export type CreateContractResult =
  | {
      status: "created";
      contract: unknown;
    }
  | {
      status: "existing";
      contract: unknown;
    }
  | {
      status: "not_found";
    };

export type ContractTemplateInput = {
  title: string;
  partnerName: string;
  rightsOwner: string;
  licenseType: string;
  territories: string;
  exclusivity: string;
  revenueShare: number;
  licenseStartDate: Date | null;
  licenseEndDate: Date | null;
};

export type ParsedContractRequest = {
  projectId: string;
};