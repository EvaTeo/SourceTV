"use client";

import { useState } from "react";
import ExperienceItem from "./ExperienceItem";
import {
  experienceItems,
  type ExperienceItemData,
} from "./experienceData";

export default function ExperienceAccordion({
  items = experienceItems,
}: {
  items?: ExperienceItemData[];
}) {
  const [openId, setOpenId] = useState<string | null>(
    items[0]?.id || null
  );

  return (
    <div>
      {items.map((item) => (
        <ExperienceItem
          key={item.id}
          item={item}
          open={openId === item.id}
          onToggle={() =>
            setOpenId((current) =>
              current === item.id ? null : item.id
            )
          }
        />
      ))}
    </div>
  );
}