"use client";

import type {
  CollectionForm as CollectionFormType,
  EditorialCollection,
  Project,
} from "../types";
import CollectionForm from "./CollectionForm";
import CollectionTitles from "./CollectionTitles";
import EmptyState from "./EmptyState";

type CollectionEditorProps = {
  collection: EditorialCollection | null;
  form: CollectionFormType;
  creating: boolean;
  saving: boolean;
  availableProjects: Project[];
  showTitlePicker: boolean;
  titleSearch: string;

  onFormChange: <K extends keyof CollectionFormType>(
    key: K,
    value: CollectionFormType[K]
  ) => void;

  onCreate: () => void;
  onSave: () => void;
  onDelete: () => void;
  onCancel: () => void;
  onStartNew: () => void;
  onToggleTitlePicker: () => void;
  onTitleSearchChange: (value: string) => void;
  onAddProject: (projectId: string) => void;
  onRemoveItem: (itemId: string) => void;
  onReorderItems: (
    items: EditorialCollection["items"]
  ) => void | Promise<void>;
};

export default function CollectionEditor({
  collection,
  form,
  creating,
  saving,
  availableProjects,
  showTitlePicker,
  titleSearch,
  onFormChange,
  onCreate,
  onSave,
  onDelete,
  onCancel,
  onStartNew,
  onToggleTitlePicker,
  onTitleSearchChange,
  onAddProject,
  onRemoveItem,
  onReorderItems,
}: CollectionEditorProps) {
  if (!creating && !collection) {
    return (
      <section className="min-w-0 rounded-3xl border border-white/10 bg-white/[0.025] p-5 md:p-6">
        <EmptyState
          title="Build the SourceTV experience"
          description="Create an editorial collection to curate seasonal rows, staff picks, award winners, hidden gems, and other viewing experiences."
          action={
            <button
              type="button"
              onClick={onStartNew}
              className="rounded-xl bg-sky-300 px-5 py-3 text-sm font-semibold text-[#05070d] transition hover:bg-sky-200"
            >
              Create First Collection
            </button>
          }
        />
      </section>
    );
  }

  return (
    <section className="min-w-0 rounded-3xl border border-white/10 bg-white/[0.025] p-5 md:p-6">
      <div className="flex flex-col gap-4 border-b border-white/[0.08] pb-6 md:flex-row md:items-start md:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-sky-300">
            {creating
              ? "New Editorial Row"
              : "Collection Editor"}
          </p>

          <h2 className="mt-2 text-2xl font-semibold text-white">
            {creating
              ? "Create Collection"
              : collection?.title}
          </h2>

          {!creating && collection && (
            <p className="mt-2 text-sm text-white/35">
              /{collection.slug}
            </p>
          )}
        </div>

        <div className="flex flex-wrap gap-2">
          {creating ? (
            <>
              <button
                type="button"
                onClick={onCancel}
                disabled={saving}
                className="rounded-xl border border-white/10 bg-white/[0.035] px-4 py-2.5 text-sm font-medium text-white/55 transition hover:bg-white/[0.06] hover:text-white disabled:cursor-not-allowed disabled:opacity-40"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={onCreate}
                disabled={saving}
                className="rounded-xl bg-sky-300 px-4 py-2.5 text-sm font-semibold text-[#05070d] transition hover:bg-sky-200 disabled:cursor-not-allowed disabled:opacity-40"
              >
                {saving
                  ? "Creating..."
                  : "Create Collection"}
              </button>
            </>
          ) : (
            <>
              <button
                type="button"
                onClick={onDelete}
                disabled={saving}
                className="rounded-xl border border-red-400/25 bg-red-500/10 px-4 py-2.5 text-sm font-medium text-red-200 transition hover:border-red-300/40 hover:bg-red-500/15 disabled:cursor-not-allowed disabled:opacity-40"
              >
                Delete
              </button>

              <button
                type="button"
                onClick={onSave}
                disabled={saving}
                className="rounded-xl bg-sky-300 px-4 py-2.5 text-sm font-semibold text-[#05070d] transition hover:bg-sky-200 disabled:cursor-not-allowed disabled:opacity-40"
              >
                {saving
                  ? "Saving..."
                  : "Save Changes"}
              </button>
            </>
          )}
        </div>
      </div>

      <CollectionForm
        form={form}
        disabled={saving}
        onChange={onFormChange}
      />

      {!creating && collection && (
        <CollectionTitles
          items={collection.items}
          availableProjects={availableProjects}
          showTitlePicker={showTitlePicker}
          titleSearch={titleSearch}
          saving={saving}
          onTogglePicker={onToggleTitlePicker}
          onSearchChange={onTitleSearchChange}
          onAdd={onAddProject}
          onRemove={onRemoveItem}
          onReorder={onReorderItems}
        />
      )}
    </section>
  );
}