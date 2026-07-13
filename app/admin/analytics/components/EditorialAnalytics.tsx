"use client";

import Link from "next/link";

const card =
  "rounded-3xl border border-white/10 bg-white/[0.03]";

const heroPerformance = [
  {
    label: "Hero CTR",
    value: "18.7%",
    change: "+4.2%",
  },
  {
    label: "Hero Completion",
    value: "71%",
    change: "+2.8%",
  },
  {
    label: "Avg Watch Time",
    value: "46 min",
    change: "+6.1%",
  },
  {
    label: "Hero Plays",
    value: "18,942",
    change: "+12.4%",
  },
];

const collections = [
  {
    title: "Trending Now",
    ctr: "24.8%",
    watch: "51 min",
    completion: "79%",
    status: "Excellent",
  },
  {
    title: "Action Classics",
    ctr: "22.1%",
    watch: "48 min",
    completion: "75%",
    status: "Strong",
  },
  {
    title: "Award Winners",
    ctr: "19.4%",
    watch: "43 min",
    completion: "71%",
    status: "Good",
  },
  {
    title: "Sci-Fi Weekend",
    ctr: "14.9%",
    watch: "37 min",
    completion: "63%",
    status: "Needs Attention",
  },
];

const heroes = [
  {
    title: "Sinners",
    badge: "Editor's Pick",
    ctr: "27.2%",
    watch: "58 min",
  },
  {
    title: "The Last Voyage",
    badge: "Trending",
    ctr: "24.6%",
    watch: "51 min",
  },
  {
    title: "Night Shift",
    badge: "New",
    ctr: "18.4%",
    watch: "39 min",
  },
];

export default function EditorialAnalytics() {
  return (
    <div className="space-y-6">
      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {heroPerformance.map((item) => (
          <div
            key={item.label}
            className={`${card} p-5`}
          >
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-white/35">
              {item.label}
            </p>

            <h2 className="mt-3 text-3xl font-bold text-white">
              {item.value}
            </h2>

            <p className="mt-2 text-sm text-emerald-300">
              ↑ {item.change}
            </p>
          </div>
        ))}
      </section>

      <section className="grid gap-6 xl:grid-cols-[1.3fr_.7fr]">
        <div className={`${card} p-6`}>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-sky-300">
                Homepage Performance
              </p>

              <h2 className="mt-2 text-2xl font-semibold text-white">
                Editorial Collections
              </h2>
            </div>

            <Link
              href="/admin/editorial"
              className="rounded-xl border border-white/10 bg-white/[0.04] px-4 py-2 text-sm font-semibold text-white transition hover:bg-white/[0.08]"
            >
              Open Editorial
            </Link>
          </div>

          <div className="mt-6 overflow-hidden rounded-2xl border border-white/10">
            <table className="w-full">
              <thead className="border-b border-white/10 bg-white/[0.02]">
                <tr>
                  <th className="px-5 py-4 text-left text-xs uppercase tracking-widest text-white/35">
                    Collection
                  </th>

                  <th className="text-left text-xs uppercase tracking-widest text-white/35">
                    CTR
                  </th>

                  <th className="text-left text-xs uppercase tracking-widest text-white/35">
                    Watch
                  </th>

                  <th className="text-left text-xs uppercase tracking-widest text-white/35">
                    Completion
                  </th>

                  <th className="text-left text-xs uppercase tracking-widest text-white/35">
                    Status
                  </th>
                </tr>
              </thead>

              <tbody>
                {collections.map((collection) => (
                  <tr
                    key={collection.title}
                    className="border-t border-white/10"
                  >
                    <td className="px-5 py-4 font-medium text-white">
                      {collection.title}
                    </td>

                    <td className="text-white/70">
                      {collection.ctr}
                    </td>

                    <td className="text-white/70">
                      {collection.watch}
                    </td>

                    <td className="text-white/70">
                      {collection.completion}
                    </td>

                    <td>
                      <span className="rounded-full bg-sky-300/10 px-3 py-1 text-xs font-semibold text-sky-300">
                        {collection.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className={`${card} p-6`}>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-sky-300">
            Hero Rotation
          </p>

          <h2 className="mt-2 text-2xl font-semibold text-white">
            Top Heroes
          </h2>

          <div className="mt-6 space-y-4">
            {heroes.map((hero, index) => (
              <div
                key={hero.title}
                className="rounded-2xl border border-white/10 bg-white/[0.03] p-4"
              >
                <div className="flex items-center justify-between">
                  <span className="text-sm font-semibold text-white">
                    #{index + 1}
                  </span>

                  <span className="rounded-full bg-sky-300/10 px-2 py-1 text-xs font-semibold text-sky-300">
                    {hero.badge}
                  </span>
                </div>

                <h3 className="mt-4 text-lg font-semibold text-white">
                  {hero.title}
                </h3>

                <div className="mt-4 flex justify-between text-sm text-white/55">
                  <span>CTR</span>
                  <span>{hero.ctr}</span>
                </div>

                <div className="mt-2 flex justify-between text-sm text-white/55">
                  <span>Watch Time</span>
                  <span>{hero.watch}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}