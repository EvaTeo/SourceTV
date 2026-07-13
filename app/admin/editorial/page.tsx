"use client";

import AdminPageHeader from "@/app/components/admin/AdminPageHeader";
import { useState } from "react";
import CollectionEditor from "./components/CollectionEditor";
import CollectionSidebar from "./components/CollectionSidebar";
import HeroManager from "./components/HeroManager";
import HomepagePreview from "./components/HomepagePreview";
import ProgrammingCalendar from "./components/ProgrammingCalendar";
import ProgrammingOverview from "./components/ProgrammingOverview";
import useEditorialCollections from "./hooks/useEditorialCollections";

type EditorialTab =
  | "overview"
  | "collections"
  | "hero"
  | "preview"
  | "calendar";

export default function EditorialPage() {
  const editorial = useEditorialCollections();
  const [activeTab, setActiveTab] =
    useState<EditorialTab>("overview");

  return (
    <main className="space-y-6">
      <AdminPageHeader
        eyebrow="SourceTV Editorial"
        title="Editorial"
        description="Manage homepage programming, curated rows, hero rotation, seasonal scheduling, and how content is presented across SourceTV."
        actions={
          activeTab === "collections" ? (
            <button
              type="button"
              onClick={editorial.startNewCollection}
              className="rounded-xl bg-sky-300 px-4 py-2.5 text-sm font-semibold text-[#05070d] transition hover:bg-sky-200"
            >
              New Collection
            </button>
          ) : null
        }
      />

      <div className="flex flex-wrap items-center gap-1 rounded-2xl border border-white/10 bg-white/[0.025] p-1.5">
        <TabButton
          active={activeTab === "overview"}
          onClick={() => setActiveTab("overview")}
        >
          Overview
        </TabButton>

        <TabButton
          active={activeTab === "collections"}
          onClick={() => setActiveTab("collections")}
        >
          Collections
        </TabButton>

        <TabButton
          active={activeTab === "hero"}
          onClick={() => setActiveTab("hero")}
        >
          Hero
        </TabButton>

        <TabButton
          active={activeTab === "preview"}
          onClick={() => setActiveTab("preview")}
        >
          Homepage Preview
        </TabButton>

        <TabButton
          active={activeTab === "calendar"}
          onClick={() => setActiveTab("calendar")}
        >
          Calendar
        </TabButton>
      </div>

      {activeTab === "overview" ? (
        <ProgrammingOverview />
      ) : activeTab === "collections" ? (
        editorial.loading ? (
          <div className="rounded-3xl border border-white/10 bg-white/[0.035] p-10 text-white/45">
            Loading editorial tools...
          </div>
        ) : (
          <div className="grid gap-6 xl:grid-cols-[360px_minmax(0,1fr)]">
            <CollectionSidebar
              collections={editorial.filteredCollections}
              selectedId={
                editorial.selectedCollection?.id || null
              }
              creating={editorial.creating}
              search={editorial.collectionSearch}
              reordering={editorial.saving}
              onSearchChange={
                editorial.setCollectionSearch
              }
              onSelect={editorial.selectCollection}
              onReorder={
                editorial.reorderCollections
              }
            />

            <CollectionEditor
              collection={editorial.selectedCollection}
              form={editorial.form}
              creating={editorial.creating}
              saving={editorial.saving}
              availableProjects={
                editorial.availableProjects
              }
              showTitlePicker={
                editorial.showTitlePicker
              }
              titleSearch={editorial.titleSearch}
              onFormChange={editorial.updateForm}
              onCreate={editorial.createCollection}
              onSave={editorial.saveCollection}
              onDelete={editorial.deleteCollection}
              onCancel={editorial.cancelCreating}
              onStartNew={
                editorial.startNewCollection
              }
              onToggleTitlePicker={
                editorial.toggleTitlePicker
              }
              onTitleSearchChange={
                editorial.setTitleSearch
              }
              onAddProject={editorial.addProject}
              onRemoveItem={editorial.removeItem}
              onReorderItems={editorial.reorderItems}
            />
          </div>
        )
      ) : activeTab === "hero" ? (
        <HeroManager />
      ) : activeTab === "preview" ? (
        <HomepagePreview />
      ) : (
        <ProgrammingCalendar />
      )}
    </main>
  );
}

function TabButton({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-xl px-4 py-2.5 text-sm font-semibold transition ${
        active
          ? "bg-white/[0.08] text-sky-300 shadow-[inset_0_1px_0_rgba(255,255,255,0.06)]"
          : "text-white/45 hover:bg-white/[0.04] hover:text-white"
      }`}
    >
      {children}
    </button>
  );
}