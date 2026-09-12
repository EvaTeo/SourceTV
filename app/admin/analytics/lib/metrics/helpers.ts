import type { getAnalyticsDashboard } from "../analyticsRepository";

export type AnalyticsDashboardData =
  Awaited<ReturnType<typeof getAnalyticsDashboard>>;

export function getAnalyticsDates() {
  const now = new Date();

  const startOfToday = new Date(
    now.getFullYear(),
    now.getMonth(),
    now.getDate()
  );

  const startOfMonth = new Date(
    now.getFullYear(),
    now.getMonth(),
    1
  );

  return {
    now,
    startOfToday,
    startOfMonth,
  };
}

export function isDateRangeActive(
  startsAt: Date | null,
  endsAt: Date | null,
  now: Date
) {
  const hasStarted =
    startsAt === null ||
    startsAt <= now;

  const hasNotEnded =
    endsAt === null ||
    endsAt >= now;

  return hasStarted && hasNotEnded;
}

export function getCollectionDisplayStatus(
  status: string,
  startsAt: Date | null,
  endsAt: Date | null,
  now: Date
) {
  if (endsAt && endsAt < now) {
    return "expired";
  }

  if (
    startsAt &&
    startsAt > now
  ) {
    return "scheduled";
  }

  return status;
}

export function addSignal(
  map: Record<string, number>,
  label: string,
  amount: number
) {
  const normalizedLabel =
    label.trim() || "Unknown";

  map[normalizedLabel] =
    (map[normalizedLabel] || 0) +
    amount;
}

export function topEntries(
  map: Record<string, number>
) {
  return Object.entries(map)
    .sort(
      (a, b) =>
        b[1] - a[1]
    )
    .slice(0, 8);
}

export function percent(
  value: number,
  total: number
) {
  if (!total) {
    return 0;
  }

  return Math.round(
    (value / total) * 100
  );
}

export function formatNumber(
  value: number
) {
  return value.toLocaleString();
}

export function formatLabel(
  value?: string | null
) {
  if (!value) {
    return "Unknown";
  }

  return value
    .replaceAll("_", " ")
    .replace(
      /\b\w/g,
      (character) =>
        character.toUpperCase()
    );
}