"use client";

import {
  DndContext,
  type DragEndEvent,
  PointerSensor,
  closestCenter,
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
import SearchInput from "@/app/components/admin/SearchInput";
import type { EditorialCollection } from "../types";
import {
  getCollectionSchedule,
  getStatusClassName,
} from "../utils";
import EmptyState from "./EmptyState";

type CollectionSidebarProps = {
  collections: EditorialCollection[];
  selectedId: string | null;
  creating: boolean;
  search: string;
  reordering?: boolean;
  onSearchChange: (value: string) => void;
  onSelect: (id: string) => void;
  onReorder: (
    collections: EditorialCollection[]
  ) => void | Promise<void>;
};

type SortableCollectionProps = {
  collection: EditorialCollection;
  active: boolean;
  disabled: boolean;
  onSelect: (id: string) => void;
};

function SortableCollection({
  collection,
  active,
  disabled,
  onSelect,
}: SortableCollectionProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: collection.id,
    disabled,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const schedule = getCollectionSchedule(collection);

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`rounded-2xl ${
        isDragging
          ? "relative z-20 opacity-70 shadow-2xl"
          : ""
      }`}
    >
      <div
        className={`flex w-full items-stretch overflow-hidden rounded-2xl border transition ${
          active
            ? "border-sky-300/35 bg-sky-300/10"
            : "border-white/[0.07] bg-white/[0.02] hover:border-white/15 hover:bg-white/[0.04]"
        }`}
      >
        <button
          type="button"
          disabled={disabled}
          {...attributes}
          {...listeners}
          className="flex w-11 shrink-0 cursor-grab items-center justify-center border-r border-white/[0.06] text-lg text-white/30 transition hover:bg-white/[0.04] hover:text-white/70 active:cursor-grabbing disabled:cursor-not-allowed disabled:opacity-30"
          aria-label={`Drag ${collection.title}`}
        >
          ☰
        </button>

        <button
          type="button"
          onClick={() => onSelect(collection.id)}
          className="min-w-0 flex-1 p-4 text-left"
        >
          <div className="flex items-start justify-between gap-4">
            <div className="min-w-0">
              <p className="truncate text-sm font-semibold text-white">
                {collection.title}
              </p>

              <p className="mt-1 text-xs text-white/35">
                {collection.items.length} title
                {collection.items.length === 1 ? "" : "s"}
              </p>
            </div>

            <span
              className={`shrink-0 rounded-full px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.14em] ${getStatusClassName(
                collection.status
              )}`}
            >
              {collection.status}
            </span>
          </div>

          <div className="mt-3 flex items-center justify-between text-xs text-white/30">
            <span className="capitalize">
              {collection.placement}
            </span>

            <span>Order {collection.sortOrder}</span>
          </div>

          {schedule && (
            <p className="mt-3 border-t border-white/[0.06] pt-3 text-xs text-white/35">
              {schedule}
            </p>
          )}
        </button>
      </div>
    </div>
  );
}

export default function CollectionSidebar({
  collections,
  selectedId,
  creating,
  search,
  reordering = false,
  onSearchChange,
  onSelect,
  onReorder,
}: CollectionSidebarProps) {
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 6,
      },
    })
  );

  async function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;

    if (!over || active.id === over.id || reordering) {
      return;
    }

    const oldIndex = collections.findIndex(
      (collection) => collection.id === active.id
    );

    const newIndex = collections.findIndex(
      (collection) => collection.id === over.id
    );

    if (oldIndex === -1 || newIndex === -1) {
      return;
    }

    const reordered = arrayMove(
      collections,
      oldIndex,
      newIndex
    ).map((collection, index) => ({
      ...collection,
      sortOrder: index + 1,
    }));

    await onReorder(reordered);
  }

  return (
    <aside className="self-start rounded-3xl border border-white/10 bg-white/[0.025] p-4">
      <SearchInput
        value={search}
        onChange={onSearchChange}
        placeholder="Search collections..."
      />

      {reordering && (
        <div className="mt-4 rounded-xl border border-sky-300/15 bg-sky-300/[0.06] px-3 py-2 text-xs font-medium text-sky-200">
          Saving collection order...
        </div>
      )}

      <div className="mt-4 max-h-[720px] overflow-y-auto pr-1">
        {collections.length === 0 ? (
          <EmptyState
            compact
            title="No collections found"
            description="Create a new collection or adjust your search."
          />
        ) : (
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
          >
            <SortableContext
              items={collections.map(
                (collection) => collection.id
              )}
              strategy={verticalListSortingStrategy}
            >
              <div className="space-y-2">
                {collections.map((collection) => (
                  <SortableCollection
                    key={collection.id}
                    collection={collection}
                    active={
                      !creating &&
                      selectedId === collection.id
                    }
                    disabled={reordering}
                    onSelect={onSelect}
                  />
                ))}
              </div>
            </SortableContext>
          </DndContext>
        )}
      </div>
    </aside>
  );
}