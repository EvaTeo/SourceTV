"use client";

import { useCallback, useState } from "react";

export type ArtworkItem = {
  id: string;
  title: string;
  image: string;
};

export default function useArtworkLightbox(
  items: ArtworkItem[]
) {
  const [activeIndex, setActiveIndex] = useState<number | null>(
    null
  );

  const open = useCallback(
    (index: number) => {
      if (index < 0 || index >= items.length) {
        return;
      }

      setActiveIndex(index);
    },
    [items.length]
  );

  const close = useCallback(() => {
    setActiveIndex(null);
  }, []);

  const next = useCallback(() => {
    setActiveIndex((current) => {
      if (current === null || items.length === 0) {
        return null;
      }

      return (current + 1) % items.length;
    });
  }, [items.length]);

  const previous = useCallback(() => {
    setActiveIndex((current) => {
      if (current === null || items.length === 0) {
        return null;
      }

      return current === 0
        ? items.length - 1
        : current - 1;
    });
  }, [items.length]);

  const activeItem =
    activeIndex !== null
      ? items[activeIndex] ?? null
      : null;

  return {
    activeIndex,
    activeItem,
    open,
    close,
    next,
    previous,
  };
}