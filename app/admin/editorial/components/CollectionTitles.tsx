"use client";

import type {
  CollectionItem,
  MoveDirection,
  Project,
} from "../types";
import EmptyState from "./EmptyState";
import TitlePicker from "./TitlePicker";

export default function CollectionTitles({
  items,
  availableProjects,
  showTitlePicker,
  titleSearch,
  saving,
  onTogglePicker,
  onSearchChange,
  onAdd,
  onRemove,
  onMove,
}: {
  items: CollectionItem[];
  availableProjects: Project[];
  showTitlePicker: boolean;
  titleSearch: string;
  saving: boolean;
  onTogglePicker: () => void;
  onSearchChange: (value: string) => void;
  onAdd: (projectId: string) => void;
  onRemove: (itemId: string) => void;
  onMove: (
    itemId: string,
    direction: MoveDirection
  ) => void;
}) {
  return (
    <div className="mt-8 border-t border-white/[0.08] pt-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h3 className="text-lg font-semibold text-white">
            Titles
          </h3>

          <p className="mt-1 text-sm text-white/40">
            Arrange titles in the exact order viewers
            should see.
          </p>
        </div>

        <button
          type="button"
          onClick={onTogglePicker}
          className="rounded-xl border border-sky-300/25 bg-sky-300/10 px-4 py-2.5 text-sm font-semibold text-sky-200 transition hover:border-sky-300/45 hover:bg-sky-300/15"
        >
          {showTitlePicker
            ? "Close Picker"
            : "Add Titles"}
        </button>
      </div>

      {showTitlePicker && (
        <TitlePicker
          projects={availableProjects}
          search={titleSearch}
          saving={saving}
          onSearchChange={onSearchChange}
          onAdd={onAdd}
        />
      )}

      <div className="mt-5 space-y-3">
        {items.length === 0 ? (
          <EmptyState
            compact
            title="No titles assigned"
            description="Use Add Titles to begin building this editorial row."
          />
        ) : (
          items.map((item, index) => {
            const imageUrl =
              item.project.thumbnailUrl ||
              item.project.backdropUrl ||
              "";

            return (
              <div
                key={item.id}
                className="flex items-center gap-4 rounded-2xl border border-white/[0.07] bg-white/[0.025] p-3"
              >
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-white/[0.05] text-sm font-semibold text-white/45">
                  {index + 1}
                </div>

                <div className="h-16 w-12 shrink-0 overflow-hidden rounded-lg bg-white/[0.05]">
                  {imageUrl && (
                    <img
                      src={imageUrl}
                      alt=""
                      className="h-full w-full object-cover"
                    />
                  )}
                </div>

                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-semibold text-white">
                    {item.project.title}
                  </p>

                  <p className="mt-1 text-xs text-white/35">
                    {[
                      item.project.type,
                      item.project.genre,
                    ]
                      .filter(Boolean)
                      .join(" • ") || "SourceTV title"}
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    disabled={saving || index === 0}
                    onClick={() =>
                      onMove(item.id, "up")
                    }
                    className="flex h-9 w-9 items-center justify-center rounded-xl border border-white/10 bg-white/[0.035] text-white/55 transition hover:bg-white/[0.07] hover:text-white disabled:cursor-not-allowed disabled:opacity-20"
                    aria-label={`Move ${item.project.title} up`}
                  >
                    ↑
                  </button>

                  <button
                    type="button"
                    disabled={
                      saving ||
                      index === items.length - 1
                    }
                    onClick={() =>
                      onMove(item.id, "down")
                    }
                    className="flex h-9 w-9 items-center justify-center rounded-xl border border-white/10 bg-white/[0.035] text-white/55 transition hover:bg-white/[0.07] hover:text-white disabled:cursor-not-allowed disabled:opacity-20"
                    aria-label={`Move ${item.project.title} down`}
                  >
                    ↓
                  </button>

                  <button
                    type="button"
                    disabled={saving}
                    onClick={() => onRemove(item.id)}
                    className="rounded-xl border border-red-400/20 bg-red-500/10 px-3 py-2 text-xs font-semibold text-red-200 transition hover:bg-red-500/15 disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    Remove
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}