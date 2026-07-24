"use client";

import EmptyCatalog from "./components/EmptyCatalog";
import EmptySearch from "./components/EmptySearch";
import FilterSelect from "./components/FilterSelect";
import LoadingState from "./components/LoadingState";
import MetricCard from "./components/MetricCard";
import ProjectCard from "./components/ProjectCard";
import ProjectHeader from "./components/ProjectHeader";

import AttentionIcon from "./components/icons/AttentionIcon";
import CatalogIcon from "./components/icons/CatalogIcon";
import PublishedIcon from "./components/icons/PublishedIcon";
import ReviewIcon from "./components/icons/ReviewIcon";
import SearchIcon from "./components/icons/SearchIcon";

import usePartnerProjects from "./hooks/usePartnerProjects";
import { stageOptions } from "./utils";

export default function PartnerProjectsPage() {
  const {
    projects,
    loading,

    search,
    setSearch,

    statusFilter,
    setStatusFilter,

    typeFilter,
    setTypeFilter,

    sortOrder,
    setSortOrder,

    expandedProjectId,

    projectTypes,
    stats,
    filteredProjects,
    filtersActive,

    clearFilters,
    toggleProject,
  } = usePartnerProjects();

  return (
    <div className="mx-auto w-full max-w-[1180px] space-y-6 pb-16">
      <ProjectHeader />

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <MetricCard
          label="Total Projects"
          value={loading ? "—" : stats.total}
          detail="All submitted titles"
          icon={<CatalogIcon />}
        />

        <MetricCard
          label="In Review"
          value={loading ? "—" : stats.reviewing}
          detail="Currently moving through review"
          icon={<ReviewIcon />}
        />

        <MetricCard
          label="Published"
          value={loading ? "—" : stats.published}
          detail="Live on SourceTV"
          icon={<PublishedIcon />}
        />

        <MetricCard
          label="Needs Attention"
          value={loading ? "—" : stats.attention}
          detail="Updates or notes requested"
          attention={stats.attention > 0}
          icon={<AttentionIcon />}
        />
      </section>

      <section className="overflow-hidden rounded-3xl border border-white/10 bg-white/[0.035]">
        <div className="border-b border-white/[0.07] p-5">
          <p className="text-[10px] font-black uppercase tracking-[0.22em] text-white/35">
            Find a Project
          </p>

          <p className="mt-2 text-sm text-white/40">
            Search your catalog or narrow the list by
            workflow stage, project type, or sort order.
          </p>
        </div>

        <div className="p-5">
          <div className="grid gap-3 lg:grid-cols-[minmax(0,1fr)_190px_170px_160px]">
            <label className="relative block">
              <span className="sr-only">
                Search projects
              </span>

              <SearchIcon />

              <input
                value={search}
                onChange={(event) =>
                  setSearch(event.target.value)
                }
                placeholder="Search projects"
                className="h-12 w-full rounded-xl border border-white/10 bg-black/25 pl-11 pr-4 text-sm text-white outline-none transition placeholder:text-white/25 hover:border-white/15 focus:border-sky-300/40"
              />
            </label>

            <FilterSelect
              label="Filter by status"
              value={statusFilter}
              onChange={setStatusFilter}
              options={stageOptions}
            />

            <FilterSelect
              label="Filter by type"
              value={typeFilter}
              onChange={setTypeFilter}
              options={[
                {
                  label: "All Types",
                  value: "all",
                },
                ...projectTypes.map((type) => ({
                  label: type,
                  value: type,
                })),
              ]}
            />

            <FilterSelect
              label="Sort projects"
              value={sortOrder}
              onChange={setSortOrder}
              options={[
                {
                  label: "Most Recent",
                  value: "recent",
                },
                {
                  label: "Title A–Z",
                  value: "title",
                },
                {
                  label: "Review Stage",
                  value: "status",
                },
              ]}
            />
          </div>

          {filtersActive ? (
            <div className="mt-4 flex justify-end">
              <button
                type="button"
                onClick={clearFilters}
                className="text-xs font-black text-sky-200 transition hover:text-sky-100"
              >
                Clear Filters
              </button>
            </div>
          ) : null}
        </div>
      </section>

      <section>
        <div className="flex flex-col justify-between gap-3 border-b border-white/10 pb-5 sm:flex-row sm:items-end">
          <div>
            <p className="text-[10px] font-black uppercase tracking-[0.22em] text-sky-300">
              Catalog
            </p>

            <h2 className="mt-2 text-2xl font-black text-white">
              My Projects
            </h2>

            <p className="mt-2 text-sm text-white/38">
              {loading
                ? "Loading your catalog..."
                : `${filteredProjects.length} ${
                    filteredProjects.length === 1
                      ? "project"
                      : "projects"
                  } shown`}
            </p>
          </div>

          {!loading && filteredProjects.length > 0 ? (
            <p className="text-xs font-semibold text-white/25">
              Select a project to view its full details
            </p>
          ) : null}
        </div>

        <div className="mt-5">
          {loading ? (
            <LoadingState />
          ) : projects.length === 0 ? (
            <EmptyCatalog />
          ) : filteredProjects.length === 0 ? (
            <EmptySearch onClear={clearFilters} />
          ) : (
            <div className="space-y-4">
              {filteredProjects.map((project) => (
                <ProjectCard
                  key={project.id}
                  project={project}
                  expanded={
                    expandedProjectId === project.id
                  }
                  onToggle={() =>
                    toggleProject(project.id)
                  }
                />
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}