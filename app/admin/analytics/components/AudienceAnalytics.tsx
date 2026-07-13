import Link from "next/link";
import InfoRow from "./InfoRow";
import ProgressRow from "./ProgressRow";
import SectionCard from "./SectionCard";

type AudienceAnalyticsProps = {
  totalUsers: number;
  totalProfiles: number;
  newUsersThisMonth: number;
  continueWatchingCount: number;
  completedTitlesCount: number;
  watchlistCount: number;
  likesCount: number;
  watchEventsToday: number;
  completionRate: number;
  totalWatchHours: number;
  topGenres: Array<[string, number]>;
  topTypes: Array<[string, number]>;
  topWatchlistTitles: Array<[string, number]>;
  topLikedTitles: Array<[string, number]>;
};

export default function AudienceAnalytics({
  totalUsers,
  totalProfiles,
  newUsersThisMonth,
  continueWatchingCount,
  completedTitlesCount,
  watchlistCount,
  likesCount,
  watchEventsToday,
  completionRate,
  totalWatchHours,
  topGenres,
  topTypes,
  topWatchlistTitles,
  topLikedTitles,
}: AudienceAnalyticsProps) {
  const profileRate = percent(totalProfiles, totalUsers);
  const savedPerUser =
    totalUsers > 0
      ? (watchlistCount / totalUsers).toFixed(1)
      : "0";

  const maxGenreValue = Math.max(
    ...topGenres.map(([, value]) => value),
    1
  );

  const maxTypeValue = Math.max(
    ...topTypes.map(([, value]) => value),
    1
  );

  return (
    <div className="space-y-6">
      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <AudienceMetric
          label="Total Users"
          value={formatNumber(totalUsers)}
          description={`${formatNumber(
            newUsersThisMonth
          )} joined this month`}
        />

        <AudienceMetric
          label="Viewer Profiles"
          value={formatNumber(totalProfiles)}
          description={`${profileRate}% profiles per user`}
        />

        <AudienceMetric
          label="Watch Hours"
          value={formatNumber(totalWatchHours)}
          description={`${formatNumber(
            watchEventsToday
          )} watch events today`}
        />

        <AudienceMetric
          label="Completion Rate"
          value={`${completionRate}%`}
          description={`${formatNumber(
            completedTitlesCount
          )} completed titles`}
        />
      </section>

      <section className="grid gap-6 xl:grid-cols-[1fr_360px]">
        <SectionCard
          title="Audience Activity"
          description="How viewers are engaging with SourceTV."
        >
          <div className="grid gap-3 sm:grid-cols-2">
            <AudienceSignal
              label="Continue Watching"
              value={continueWatchingCount}
              description="Active playback records"
            />

            <AudienceSignal
              label="Watchlist Adds"
              value={watchlistCount}
              description={`${savedPerUser} saves per user`}
            />

            <AudienceSignal
              label="Positive Reactions"
              value={likesCount}
              description="Titles viewers liked"
            />

            <AudienceSignal
              label="Completed Titles"
              value={completedTitlesCount}
              description={`${completionRate}% completion rate`}
            />
          </div>
        </SectionCard>

        <SectionCard
          title="Audience Snapshot"
          description="Fast viewer health indicators."
        >
          <div className="space-y-2">
            <InfoRow
              label="Registered Users"
              value={formatNumber(totalUsers)}
            />

            <InfoRow
              label="Household Profiles"
              value={formatNumber(totalProfiles)}
            />

            <InfoRow
              label="New Users This Month"
              value={formatNumber(newUsersThisMonth)}
            />

            <InfoRow
              label="Watch Events Today"
              value={formatNumber(watchEventsToday)}
            />

            <InfoRow
              label="Average Saves Per User"
              value={savedPerUser}
            />

            <InfoRow
              label="Completion Rate"
              value={`${completionRate}%`}
            />
          </div>
        </SectionCard>
      </section>

      <section className="grid gap-6 xl:grid-cols-2">
        <SectionCard
          title="Genre Interests"
          description="Catalog genres generating the strongest audience signals."
        >
          {topGenres.length === 0 ? (
            <EmptyState text="No genre data available yet." />
          ) : (
            <div className="space-y-4">
              {topGenres.map(([label, value]) => (
                <ProgressRow
                  key={label}
                  label={label}
                  value={value}
                  total={maxGenreValue}
                />
              ))}
            </div>
          )}
        </SectionCard>

        <SectionCard
          title="Viewing Formats"
          description="Audience activity across films, shows, animation, and other formats."
        >
          {topTypes.length === 0 ? (
            <EmptyState text="No content type data available yet." />
          ) : (
            <div className="space-y-4">
              {topTypes.map(([label, value]) => (
                <ProgressRow
                  key={label}
                  label={label}
                  value={value}
                  total={maxTypeValue}
                />
              ))}
            </div>
          )}
        </SectionCard>
      </section>

      <section className="grid gap-6 xl:grid-cols-2">
        <SectionCard
          title="Most Watchlisted"
          description="Titles viewers are most interested in watching later."
        >
          <RankedAudienceList
            items={topWatchlistTitles}
            suffix="saves"
            empty="No watchlist activity yet."
          />
        </SectionCard>

        <SectionCard
          title="Most Liked"
          description="Titles receiving the strongest positive audience reaction."
        >
          <RankedAudienceList
            items={topLikedTitles}
            suffix="likes"
            empty="No reaction activity yet."
          />
        </SectionCard>
      </section>

      <section className="flex flex-col gap-4 rounded-3xl border border-white/10 bg-white/[0.025] p-5 sm:flex-row sm:items-center sm:justify-between md:p-6">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-sky-300">
            Viewer Management
          </p>

          <h2 className="mt-2 text-xl font-semibold text-white">
            Review SourceTV users and profiles
          </h2>

          <p className="mt-2 text-sm text-white/40">
            Inspect account status, subscriptions, household
            profiles, and recent activity.
          </p>
        </div>

        <Link
          href="/admin/users"
          className="shrink-0 rounded-xl border border-white/10 bg-white/[0.04] px-4 py-2.5 text-sm font-semibold text-white/75 transition hover:bg-white/[0.08] hover:text-white"
        >
          Open Users
        </Link>
      </section>
    </div>
  );
}

function AudienceMetric({
  label,
  value,
  description,
}: {
  label: string;
  value: string;
  description: string;
}) {
  return (
    <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-5">
      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-white/35">
        {label}
      </p>

      <p className="mt-3 text-3xl font-semibold text-white">
        {value}
      </p>

      <p className="mt-2 text-sm text-white/40">
        {description}
      </p>
    </div>
  );
}

function AudienceSignal({
  label,
  value,
  description,
}: {
  label: string;
  value: number;
  description: string;
}) {
  return (
    <div className="rounded-2xl border border-white/[0.08] bg-white/[0.025] p-4">
      <p className="text-xs font-semibold uppercase tracking-[0.15em] text-white/35">
        {label}
      </p>

      <p className="mt-3 text-2xl font-semibold text-white">
        {formatNumber(value)}
      </p>

      <p className="mt-2 text-xs text-white/35">
        {description}
      </p>
    </div>
  );
}

function RankedAudienceList({
  items,
  suffix,
  empty,
}: {
  items: Array<[string, number]>;
  suffix: string;
  empty: string;
}) {
  if (items.length === 0) {
    return <EmptyState text={empty} />;
  }

  return (
    <div className="space-y-3">
      {items.map(([label, value], index) => (
        <div
          key={`${label}-${index}`}
          className="flex items-center gap-4 rounded-2xl border border-white/[0.08] bg-white/[0.025] p-4"
        >
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-white/[0.05] text-sm font-semibold text-sky-300">
            {index + 1}
          </div>

          <p className="min-w-0 flex-1 truncate text-sm font-semibold text-white">
            {label}
          </p>

          <p className="shrink-0 text-xs font-medium text-white/45">
            {formatNumber(value)} {suffix}
          </p>
        </div>
      ))}
    </div>
  );
}

function EmptyState({ text }: { text: string }) {
  return (
    <div className="rounded-2xl border border-dashed border-white/10 p-8 text-center text-sm text-white/40">
      {text}
    </div>
  );
}

function percent(value: number, total: number) {
  if (!total) return 0;
  return Math.round((value / total) * 100);
}

function formatNumber(value: number) {
  return value.toLocaleString();
}