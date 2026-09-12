import type {
  StatusFilter,
  Submission,
  SubmissionMetrics,
} from "./types";

export const STATUS_OPTIONS: {
  value: StatusFilter;
  label: string;
}[] = [
  {
    value: "all",
    label: "All",
  },
  {
    value: "pending",
    label: "Pending",
  },
  {
    value: "approved",
    label: "Approved",
  },
  {
    value: "denied",
    label: "Denied",
  },
];

export function normalizeStatus(
  status?: string | null
) {
  const normalized = String(
    status || "pending"
  )
    .trim()
    .toLowerCase()
    .replace(/\s+/g, "_");

  if (
    normalized === "rejected" ||
    normalized === "declined"
  ) {
    return "denied";
  }

  return normalized;
}

export function isPendingStatus(
  status?: string | null
) {
  const normalized =
    normalizeStatus(status);

  return [
    "pending",
    "submitted",
    "in_review",
    "under_review",
    "review",
  ].includes(normalized);
}

export function formatStatus(
  status?: string | null
) {
  return normalizeStatus(status)
    .split("_")
    .map(
      (word) =>
        word
          .charAt(0)
          .toUpperCase() +
        word.slice(1)
    )
    .join(" ");
}

export function formatSubmissionDate(
  value?: string | null
) {
  if (!value) {
    return "Date unavailable";
  }

  const date =
    new Date(value);

  if (
    Number.isNaN(
      date.getTime()
    )
  ) {
    return "Date unavailable";
  }

  return new Intl.DateTimeFormat(
    "en-US",
    {
      month: "short",
      day: "numeric",
      year: "numeric",
    }
  ).format(date);
}

export function getSubmissionMetrics(
  submissions: Submission[]
): SubmissionMetrics {
  const pending =
    submissions.filter(
      (submission) =>
        isPendingStatus(
          submission.status
        )
    ).length;

  const approved =
    submissions.filter(
      (submission) =>
        normalizeStatus(
          submission.status
        ) === "approved"
    ).length;

  const denied =
    submissions.filter(
      (submission) =>
        normalizeStatus(
          submission.status
        ) === "denied"
    ).length;

  return {
    total:
      submissions.length,

    pending,
    approved,
    denied,
  };
}

export function filterSubmissions(
  submissions: Submission[],
  searchQuery: string,
  statusFilter: StatusFilter
) {
  const query =
    searchQuery
      .trim()
      .toLowerCase();

  return submissions.filter(
    (submission) => {
      const normalizedStatus =
        normalizeStatus(
          submission.status
        );

      const matchesStatus =
        statusFilter === "all"
          ? true
          : statusFilter ===
              "pending"
            ? isPendingStatus(
                normalizedStatus
              )
            : normalizedStatus ===
              statusFilter;

      if (!matchesStatus) {
        return false;
      }

      if (!query) {
        return true;
      }

      const searchableText = [
        submission.title,
        submission.description,
        submission.type,
        submission.genre,
        submission.creatorName,
        submission.creatorCompany,
        submission.year,
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();

      return searchableText.includes(
        query
      );
    }
  );
}