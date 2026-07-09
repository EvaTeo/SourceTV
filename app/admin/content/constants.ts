export const filters = [
  { label: "All", value: "all" },
  { label: "Submissions", value: "submission" },
  { label: "Metadata", value: "metadata_review" },
  { label: "Content", value: "content_review" },
  { label: "Rights", value: "rights_review" },
  { label: "Approved", value: "approved" },
  { label: "Scheduled", value: "scheduled" },
  { label: "Published", value: "published" },
  { label: "Featured", value: "featured" },
  { label: "Archived", value: "archived" },
  { label: "Rejected", value: "rejected" },
];

export const recognitionLevels = [
  "",
  "SourceTV Selection",
  "Featured Selection",
  "Editor's Selection",
  "Premier Selection",
];

export const stageLabels: Record<string, string> = {
  submission: "Submission",
  metadata_review: "Metadata Review",
  content_review: "Content Review",
  rights_review: "Rights Review",
  approved: "Approved",
  scheduled: "Scheduled",
  published: "Published",
  archived: "Archived",
  rejected: "Rejected",
};