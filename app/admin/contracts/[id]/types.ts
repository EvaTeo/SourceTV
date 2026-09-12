export type AdminContract = {
  id: string;
  projectId: string;

  partnerEmail?: string | null;
  partnerName?: string | null;

  rightsOwner?: string | null;
  rightsContact?: string | null;

  status: string;

  licenseType?: string | null;
  licenseStartDate?: string | null;
  licenseEndDate?: string | null;

  territories?: string | null;
  exclusivity?: string | null;

  revenueShare: number;

  contractText?: string | null;
  adminNotes?: string | null;
  partnerNotes?: string | null;

  partnerSignatureName?: string | null;
  partnerSignatureDataUrl?: string | null;

  sentAt?: string | null;
  viewedAt?: string | null;
  signedAt?: string | null;
  createdAt?: string | null;

  project?: {
    id: string;
    title: string;

    creatorName?: string | null;
    creatorEmail?: string | null;
    creatorCompany?: string | null;
  };
};

export type ContractAction =
  | "send"
  | "mark_signed"
  | "cancel";