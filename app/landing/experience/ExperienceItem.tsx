"use client";

import type { ExperienceItemData } from "./experienceData";

export default function ExperienceItem({
  item,
  open,
  onToggle,
}: {
  item: ExperienceItemData;
  open: boolean;
  onToggle: () => void;
}) {
  return (
    <article className="border-t border-white/[0.1] last:border-b">
      <button
        type="button"
        onClick={onToggle}
        className="group flex w-full items-center justify-between gap-6 py-6 text-left md:py-8"
        aria-expanded={open}
        aria-controls={`experience-panel-${item.id}`}
      >
        <h3
          className={`text-xl font-black tracking-[-0.025em] transition duration-300 md:text-3xl ${
            open
              ? "text-white"
              : "text-white/70 group-hover:text-white"
          }`}
        >
          {item.title}
        </h3>

        <span
          className={`relative flex h-9 w-9 shrink-0 items-center justify-center rounded-full border transition-all duration-300 md:h-10 md:w-10 ${
            open
              ? "rotate-45 border-sky-300/40 bg-sky-300/[0.12] text-sky-100"
              : "border-white/12 bg-white/[0.035] text-white/50 group-hover:border-white/25 group-hover:text-white"
          }`}
          aria-hidden="true"
        >
          <span className="absolute h-px w-4 bg-current" />
          <span className="absolute h-4 w-px bg-current" />
        </span>
      </button>

      <div
        id={`experience-panel-${item.id}`}
        className={`grid transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${
          open
            ? "grid-rows-[1fr] opacity-100"
            : "grid-rows-[0fr] opacity-0"
        }`}
      >
        <div className="overflow-hidden">
          <div className="max-w-3xl pb-8 md:pb-10">
            <p className="text-base font-bold leading-7 text-sky-100/90 md:text-lg">
              {item.intro}
            </p>

            {item.description && (
              <p className="mt-3 max-w-2xl text-sm leading-7 text-white/48 md:text-base md:leading-8">
                {item.description}
              </p>
            )}

            {item.benefits && (
              <ul className="mt-6 grid gap-x-8 gap-y-3 sm:grid-cols-2">
                {item.benefits.map((benefit) => (
                  <li
                    key={benefit}
                    className="flex items-start gap-3 text-sm leading-6 text-white/58"
                  >
                    <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-sky-300" />

                    <span>{benefit}</span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>
    </article>
  );
}