"use client";

import {
  useEffect,
  useState,
} from "react";

const FALLBACK_COLOR = {
  red: 14,
  green: 165,
  blue: 233,
};

type RGBColor = {
  red: number;
  green: number;
  blue: number;
};

function clampColor(value: number) {
  return Math.max(
    0,
    Math.min(255, Math.round(value))
  );
}

function extractDominantColor(
  image: HTMLImageElement
): RGBColor {
  const canvas =
    document.createElement("canvas");

  const context = canvas.getContext("2d", {
    willReadFrequently: true,
  });

  if (!context) {
    return FALLBACK_COLOR;
  }

  const sampleSize = 48;

  canvas.width = sampleSize;
  canvas.height = sampleSize;

  context.drawImage(
    image,
    0,
    0,
    sampleSize,
    sampleSize
  );

  const imageData = context.getImageData(
    0,
    0,
    sampleSize,
    sampleSize
  ).data;

  const buckets = new Map<
    string,
    {
      red: number;
      green: number;
      blue: number;
      count: number;
      score: number;
    }
  >();

  for (
    let index = 0;
    index < imageData.length;
    index += 16
  ) {
    const red = imageData[index];
    const green = imageData[index + 1];
    const blue = imageData[index + 2];
    const alpha = imageData[index + 3];

    if (alpha < 180) {
      continue;
    }

    const maximum = Math.max(
      red,
      green,
      blue
    );

    const minimum = Math.min(
      red,
      green,
      blue
    );

    const saturation = maximum - minimum;

    const brightness =
      red * 0.299 +
      green * 0.587 +
      blue * 0.114;

    if (
      brightness < 30 ||
      brightness > 238 ||
      saturation < 18
    ) {
      continue;
    }

    const quantizedRed =
      Math.round(red / 32) * 32;

    const quantizedGreen =
      Math.round(green / 32) * 32;

    const quantizedBlue =
      Math.round(blue / 32) * 32;

    const key = `${quantizedRed}-${quantizedGreen}-${quantizedBlue}`;

    const vibrance =
      saturation *
      (1 - Math.abs(brightness - 140) / 180);

    const current = buckets.get(key);

    if (current) {
      current.red += red;
      current.green += green;
      current.blue += blue;
      current.count += 1;
      current.score += vibrance;
    } else {
      buckets.set(key, {
        red,
        green,
        blue,
        count: 1,
        score: vibrance,
      });
    }
  }

  const strongest = Array.from(
    buckets.values()
  ).sort(
    (first, second) =>
      second.score * second.count -
      first.score * first.count
  )[0];

  if (!strongest) {
    return FALLBACK_COLOR;
  }

  const red =
    strongest.red / strongest.count;

  const green =
    strongest.green / strongest.count;

  const blue =
    strongest.blue / strongest.count;

  const maximum = Math.max(
    red,
    green,
    blue
  );

  const boost =
    maximum > 0
      ? Math.min(1.28, 220 / maximum)
      : 1;

  return {
    red: clampColor(red * boost),
    green: clampColor(green * boost),
    blue: clampColor(blue * boost),
  };
}

export default function DominantColorGlow({
  imageUrl,
  className = "",
}: {
  imageUrl?: string | null;
  className?: string;
}) {
  const [color, setColor] =
    useState<RGBColor>(FALLBACK_COLOR);

  useEffect(() => {
    if (!imageUrl) {
      setColor(FALLBACK_COLOR);
      return;
    }

    let cancelled = false;

    const image = new Image();

    image.crossOrigin = "anonymous";
    image.decoding = "async";
    image.src = imageUrl;

    image.onload = () => {
      if (cancelled) {
        return;
      }

      try {
        setColor(
          extractDominantColor(image)
        );
      } catch {
        setColor(FALLBACK_COLOR);
      }
    };

    image.onerror = () => {
      if (!cancelled) {
        setColor(FALLBACK_COLOR);
      }
    };

    return () => {
      cancelled = true;
    };
  }, [imageUrl]);

  const colorValue =
    `${color.red}, ${color.green}, ${color.blue}`;

  return (
    <div
      className={`pointer-events-none absolute transition-[background] duration-1000 ${className}`}
      style={{
        background: `
          radial-gradient(
            ellipse at center,
            rgba(${colorValue}, 0.34) 0%,
            rgba(${colorValue}, 0.17) 34%,
            rgba(${colorValue}, 0.06) 58%,
            transparent 76%
          )
        `,
      }}
      aria-hidden="true"
    />
  );
}