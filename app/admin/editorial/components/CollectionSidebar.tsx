"use client";

import SearchInput from "@/app/components/admin/SearchInput";
import type { EditorialCollection } from "../types";
import {
  getCollectionSchedule,
  getStatusClassName,
} from "../utils";
import EmptyState from "./EmptyState";

export default function CollectionSidebar({
  collections,
  selectedId,
  creating,
  search,
  onSearchChange,
  onSelect,
}: {
  collections: EditorialCollection[];
  selectedId: string | null;
  creating: boolean;
  search: string;
  onSearchChange: (value: string) => void;
  onSelect: (id: string) => void;
}) {
  return (
    <aside className="self-start rounded-3xl border border-white/10 bg-white/[0.025] p-4">
      <SearchInput
        value={search}
        onChange={onSearchChange}
        placeholder="Search collections..."
      />

      <div className="mt-4 max-h-[720px] space-y-2 overflow-y-auto pr-1">
        {collections.length === 0 ? (
          <EmptyState
            compact
            title="No collections found"
            description="Create a new collection or adjust your search."
          />
        ) : (
          collections.map((collection) => {
            const active =
              !creating && selectedId === collection.id;

            const schedule =
              getCollectionSchedule(collection);

            return (
              <button
                key={collection.id}
                type="button"
                onClick={() => onSelect(collection.id)}
                className={`w-full rounded-2xl border p-4 text-left transition ${
                  active
                    ? "border-sky-300/35 bg-sky-300/10"
                    : "border-white/[0.07] bg-white/[0.02] hover:border-white/15 hover:bg-white/[0.04]"
                }`}
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="min-w-0">
                    <p className="truncate text-sm font-semibold text-white">
                      {collection.title}
                    </p>

                    <p className="mt-1 text-xs text-white/35">
                      {collection.items.length} title
                      {collection.items.length === 1
                        ? ""
                        : "s"}
                    </p>
                  </div>

                  <span
                    className={`rounded-full px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.14em] ${getStatusClassName(
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
            );
          })
        )}
      </div>
    </aside>
  );
}