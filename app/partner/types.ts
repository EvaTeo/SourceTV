export type PartnerProject = {
  recognitionLevel?: string | null;
  id: string;
  title: string;
  description?: string | null;
  type?: string | null;
  genre?: string | null;
  thumbnailUrl?: string | null;
  backdropUrl?: string | null;
  workflowStage: string;
  featured?: boolean | null;
  scheduledAt?: string | null;
  publishedAt?: string | null;
  reviewNotes?: string | null;
  metadataNotes?: string | null;
  contentNotes?: string | null;
  rightsNotes?: string | null;
};

export type PartnerDashboardStats = {
  total: number;
  inReview: number;
  scheduled: number;
  published: number;
};

export type PartnerAttentionNote = {
  label: string;
  note: string;
};