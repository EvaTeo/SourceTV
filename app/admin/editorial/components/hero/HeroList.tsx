"use client";

import {
  DndContext,
  closestCenter,
  DragEndEvent,
} from "@dnd-kit/core";

import {
  SortableContext,
  verticalListSortingStrategy,
  arrayMove,
} from "@dnd-kit/sortable";

import { useEffect, useState } from "react";

import HeroCard, { HeroProject } from "./HeroCard";

type HeroDraft = {
  heroBadge: string;
  heroPriority: string;
  heroStartDate: string;
  heroEndDate: string;
};

type Props = {
  heroes: HeroProject[];
  drafts: Record<string, HeroDraft>;
  savingId: string | null;

  onDraftChange: (
    projectId: string,
    key: keyof HeroDraft,
    value: string
  ) => void;

  onSave: (project: HeroProject) => void;

  onRemove: (project: HeroProject) => void;

  onReorder: (
    heroes: HeroProject[]
  ) => Promise<void>;
};

export default function HeroList({
  heroes,
  drafts,
  savingId,
  onDraftChange,
  onSave,
  onRemove,
  onReorder,
}: Props) {
  const [items, setItems] = useState(heroes);

  useEffect(() => {
    setItems(heroes);
  }, [heroes]);

  async function handleDragEnd(
    event: DragEndEvent
  ) {
    const { active, over } = event;

    if (!over) return;

    if (active.id === over.id) return;

    const oldIndex = items.findIndex(
      (item) => item.id === active.id
    );

    const newIndex = items.findIndex(
      (item) => item.id === over.id
    );

    const reordered = arrayMove(
      items,
      oldIndex,
      newIndex
    );

    setItems(reordered);

    await onReorder(reordered);
  }

  return (
    <DndContext
      collisionDetection={closestCenter}
      onDragEnd={handleDragEnd}
    >
      <SortableContext
        items={items.map((i) => i.id)}
        strategy={verticalListSortingStrategy}
      >
        <div className="space-y-5">
          {items.map((project, index) => (
            <HeroCard
              key={project.id}
              project={project}
              index={index}
              saving={savingId === project.id}
              draft={drafts[project.id]}
              onDraftChange={(key, value) =>
                onDraftChange(
                  project.id,
                  key,
                  value
                )
              }
              onSave={() => onSave(project)}
              onRemove={() => onRemove(project)}
            />
          ))}
        </div>
      </SortableContext>
    </DndContext>
  );
}