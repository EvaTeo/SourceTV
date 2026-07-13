"use client";

import { useEffect, useState } from "react";

type PreviewProject = {
  id: string;
  title: string;
  type?: string | null;
  genre?: string | null;
  thumbnailUrl?: string | null;
  backdropUrl?: string | null;
  titleLogoUrl?: string | null;
  heroBadge?: string | null;
};

type PreviewCollection = {
  id: string;
  title: string;
  slug: string;
  description?: string | null;
  placement: string;
  sortOrder: number;
  items: PreviewProject[];
};

export default function HomepagePreview() {
  const [collections, setCollections] = useState<
    PreviewCollection[]
  >([]);
  const [heroTitles, setHeroTitles] = useState<
    PreviewProject[]
  >([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadPreview() {
      try {
        setLoading(true);

        const [collectionsResponse, contentResponse] =
          await Promise.all([
            fetch("/api/collections", {
              cache: "no-store",
            }),
            fetch("/api/admin/content", {
              cache: "no-store",
            }),
          ]);

        const collectionsData =
          await collectionsResponse.json();

        const contentData =
          await contentResponse.json();

        if (!collectionsResponse.ok) {
          throw new Error(
            collectionsData?.error ||
              "Failed to load homepage collections."
          );
        }

        if (!contentResponse.ok) {
          throw new Error(
            contentData?.error ||
              contentData?.message ||
              "Failed to load hero programming."
          );
        }

        setCollections(
          Array.isArray(collectionsData)
            ? collectionsData
            : []
        );

        const heroes = (
          Array.isArray(contentData)
            ? contentData
            : []
        )
          .filter(
            (project: PreviewProject & {
              featured?: boolean;
            }) => project.featured
          )
          .sort(
            (
              a: PreviewProject & {
                heroPriority?: number | null;
                featuredRank?: number | null;
              },
              b: PreviewProject & {
                heroPriority?: number | null;
                featuredRank?: number | null;
              }
            ) =>
              (a.heroPriority ??
                a.featuredRank ??
                999) -
              (b.heroPriority ??
                b.featuredRank ??
                999)
          );

        setHeroTitles(heroes);
      } catch (error) {
        console.error(
          "HOMEPAGE PREVIEW LOAD ERROR:",
          error
        );

        window.alert(
          error instanceof Error
            ? error.message
            : "Could not load homepage preview."
        );
      } finally {
        setLoading(false);
      }
    }

    void loadPreview();
  }, []);

  if (loading) {
    return (
      <section className="rounded-3xl border border-white/10 bg-white/[0.025] p-10 text-white/45">
        Loading homepage preview...
      </section>
    );
  }

  const primaryHero = heroTitles[0] || null;

  return (
    <section className="overflow-hidden rounded-3xl border border-white/10 bg-[#05070d]">
      <header className="flex flex-col gap-4 border-b border-white/10 p-5 md:flex-row md:items-center md:justify-between md:p-6">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-sky-300">
            Live Programming Preview
          </p>

          <h2 className="mt-2 text-2xl font-semibold text-white">
            SourceTV Homepage
          </h2>

          <p className="mt-2 text-sm text-white/40">
            This preview uses the same active collections
            shown to viewers.
          </p>
        </div>

        <a
          href="/browse"
          target="_blank"
          rel="noreferrer"
          className="rounded-xl border border-white/10 bg-white/[0.04] px-4 py-2.5 text-sm font-semibold text-white/70 transition hover:bg-white/[0.08] hover:text-white"
        >
          Open Browse
        </a>
      </header>

      <div className="relative min-h-[720px] overflow-hidden">
        {primaryHero ? (
          <div className="relative min-h-[390px] overflow-hidden">
            {(
              primaryHero.backdropUrl ||
              primaryHero.thumbnailUrl
            ) && (
              <img
                src={
                  primaryHero.backdropUrl ||
                  primaryHero.thumbnailUrl ||
                  ""
                }
                alt=""
                className="absolute inset-0 h-full w-full object-cover"
              />
            )}

            <div className="absolute inset-0 bg-gradient-to-r from-[#05070d] via-[#05070d]/70 to-transparent" />
            <div className="absolute inset-0 bg-gradient-to-t from-[#05070d] via-transparent to-black/20" />

            <div className="relative flex min-h-[390px] max-w-xl flex-col justify-end p-6 pb-14 md:p-10 md:pb-16">
              {primaryHero.heroBadge && (
                <p className="text-xs font-semibold uppercase tracking-[0.22em] text-sky-300">
                  {primaryHero.heroBadge}
                </p>
              )}

              {primaryHero.titleLogoUrl ? (
                <img
                  src={primaryHero.titleLogoUrl}
                  alt={primaryHero.title}
                  className="mt-4 max-h-24 max-w-[320px] object-contain object-left"
                />
              ) : (
                <h3 className="mt-3 text-4xl font-semibold text-white md:text-5xl">
                  {primaryHero.title}
                </h3>
              )}

              <p className="mt-4 text-sm text-white/55">
                {[
                  primaryHero.type,
                  primaryHero.genre,
                ]
                  .filter(Boolean)
                  .join(" • ") ||
                  "SourceTV featured title"}
              </p>

              <div className="mt-6 flex gap-3">
                <div className="rounded-xl bg-white px-5 py-2.5 text-sm font-semibold text-[#05070d]">
                  Play
                </div>

                <div className="rounded-xl border border-white/15 bg-white/10 px-5 py-2.5 text-sm font-semibold text-white">
                  More Info
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="flex min-h-[300px] items-center justify-center border-b border-white/10 text-sm text-white/35">
            No active hero title.
          </div>
        )}

        <div className="-mt-6 space-y-8 px-5 pb-10 md:px-8">
          {collections.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-white/10 p-10 text-center text-sm text-white/40">
              No active homepage collections.
            </div>
          ) : (
            collections.map((collection) => (
              <div key={collection.id}>
                <div className="mb-3 flex items-end justify-between gap-4">
                  <div>
                    <h3 className="text-lg font-semibold text-white">
                      {collection.title}
                    </h3>

                    {collection.description && (
                      <p className="mt-1 text-xs text-white/35">
                        {collection.description}
                      </p>
                    )}
                  </div>

                  <span className="text-xs text-white/25">
                    Order {collection.sortOrder}
                  </span>
                </div>

                <div className="flex gap-3 overflow-hidden">
                  {collection.items
                    .slice(0, 6)
                    .map((project) => {
                      const image =
                        project.thumbnailUrl ||
                        project.backdropUrl ||
                        "";

                      return (
                        <div
                          key={project.id}
                          className="w-[145px] shrink-0 md:w-[170px]"
                        >
                          <div className="aspect-[2/3] overflow-hidden rounded-xl border border-white/[0.08] bg-white/[0.04]">
                            {image ? (
                              <img
                                src={image}
                                alt=""
                                className="h-full w-full object-cover"
                              />
                            ) : (
                              <div className="flex h-full items-center justify-center px-3 text-center text-xs text-white/25">
                                No artwork
                              </div>
                            )}
                          </div>

                          <p className="mt-2 truncate text-xs font-semibold text-white/70">
                            {project.title}
                          </p>
                        </div>
                      );
                    })}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </section>
  );
}