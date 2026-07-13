"use client";

import {
  DndContext,
  PointerSensor,
  closestCenter,
  type DragEndEvent,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  SortableContext,
  arrayMove,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import type {
  CollectionItem,
  Project,
} from "../types";
import EmptyState from "./EmptyState";
import TitlePicker from "./TitlePicker";

type CollectionTitlesProps = {
  items: CollectionItem[];
  availableProjects: Project[];
  showTitlePicker: boolean;
  titleSearch: string;
  saving: boolean;
  onTogglePicker: () => void;
  onSearchChange: (value: string) => void;
  onAdd: (projectId: string) => void;
  onRemove: (itemId: string) => void;
  onReorder: (
    items: CollectionItem[]
  ) => void | Promise<void>;
};

type SortableTitleProps = {
  item: CollectionItem;
  index: number;
  saving: boolean;
  onRemove: (itemId: string) => void;
};

function SortableTitle({
  item,
  index,
  saving,
  onRemove,
}: SortableTitleProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: item.id,
    disabled: saving,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const imageUrl =
    item.project.thumbnailUrl ||
    item.project.backdropUrl ||
    "";

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`flex items-center gap-4 rounded-2xl border border-white/[0.07] bg-white/[0.025] p-3 transition ${
        isDragging
          ? "relative z-20 opacity-70 shadow-2xl"
          : "hover:border-white/15 hover:bg-white/[0.04]"
      }`}
    >
      <button
        type="button"
        disabled={saving}
        {...attributes}
        {...listeners}
        className="flex h-10 w-10 shrink-0 cursor-grab items-center justify-center rounded-xl border border-white/10 bg-white/[0.04] text-lg text-white/35 transition hover:bg-white/[0.07] hover:text-white active:cursor-grabbing disabled:cursor-not-allowed disabled:opacity-30"
        aria-label={`Drag ${item.project.title}`}
      >
        ☰
      </button>

      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-white/[0.05] text-sm font-semibold text-white/45">
        {index + 1}
      </div>

      <div className="h-16 w-12 shrink-0 overflow-hidden rounded-lg bg-white/[0.05]">
        {imageUrl ? (
          <img
            src={imageUrl}
            alt=""
            className="h-full w-full object-cover"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-[9px] text-white/20">
            No image
          </div>
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

      <button
        type="button"
        disabled={saving}
        onClick={() => onRemove(item.id)}
        className="rounded-xl border border-red-400/20 bg-red-500/10 px-3 py-2 text-xs font-semibold text-red-200 transition hover:bg-red-500/15 disabled:cursor-not-allowed disabled:opacity-40"
      >
        Remove
      </button>
    </div>
  );
}

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
  onReorder,
}: CollectionTitlesProps) {
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 6,
      },
    })
  );

  async function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;

    if (
      !over ||
      active.id === over.id ||
      saving
    ) {
      return;
    }

    const oldIndex = items.findIndex(
      (item) => item.id === active.id
    );

    const newIndex = items.findIndex(
      (item) => item.id === over.id
    );

    if (oldIndex === -1 || newIndex === -1) {
      return;
    }

    const reordered = arrayMove(
      items,
      oldIndex,
      newIndex
    );

    await onReorder(reordered);
  }

  return (
    <div className="mt-8 border-t border-white/[0.08] pt-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h3 className="text-lg font-semibold text-white">
            Titles
          </h3>

          <p className="mt-1 text-sm text-white/40">
            Drag titles into the exact order viewers
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

      <div className="mt-5">
        {items.length === 0 ? (
          <EmptyState
            compact
            title="No titles assigned"
            description="Use Add Titles to begin building this editorial row."
          />
        ) : (
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
          >
            <SortableContext
              items={items.map((item) => item.id)}
              strategy={verticalListSortingStrategy}
            >
              <div className="space-y-3">
                {items.map((item, index) => (
                  <SortableTitle
                    key={item.id}
                    item={item}
                    index={index}
                    saving={saving}
                    onRemove={onRemove}
                  />
                ))}
              </div>
            </SortableContext>
          </DndContext>
        )}
      </div>
    </div>
  );
}