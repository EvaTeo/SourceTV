import {
  SUBMISSION_SECTIONS,
} from "../constants";

import type {
  SubmissionSectionId,
} from "../types";

export default function SubmissionNavigator({
  activeSection,
  onSelect,
}: {
  activeSection: SubmissionSectionId;
  onSelect: (
    sectionId: SubmissionSectionId
  ) => void;
}) {
  const activeIndex =
    SUBMISSION_SECTIONS.findIndex(
      (section) =>
        section.id === activeSection
    );

  return (
    <nav
      aria-label="Submission sections"
      className="sticky top-4 z-30 rounded-[24px] border border-white/10 bg-[#070a0f]/90 p-2 shadow-[0_20px_70px_rgba(0,0,0,0.36)] backdrop-blur-2xl"
    >
      <div className="grid grid-cols-5 gap-1">
        {SUBMISSION_SECTIONS.map(
          (section, index) => {
            const active =
              section.id === activeSection;

            const complete =
              index < activeIndex;

            return (
              <button
                key={section.id}
                type="button"
                onClick={() =>
                  onSelect(section.id)
                }
                className={`group relative min-w-0 rounded-[18px] px-2 py-3 text-left transition sm:px-3 ${
                  active
                    ? "bg-white/[0.075] text-white shadow-inner"
                    : "text-white/34 hover:bg-white/[0.035] hover:text-white/65"
                }`}
              >
                <div className="flex items-center gap-2">
                  <span
                    className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full border text-[9px] font-black transition ${
                      active
                        ? "border-sky-300/45 bg-sky-300/15 text-sky-200 shadow-[0_0_18px_rgba(125,211,252,0.14)]"
                        : complete
                          ? "border-emerald-300/25 bg-emerald-300/10 text-emerald-200"
                          : "border-white/10 bg-white/[0.025] text-white/25"
                    }`}
                  >
                    {complete
                      ? "✓"
                      : String(index + 1).padStart(
                          2,
                          "0"
                        )}
                  </span>

                  <span className="min-w-0">
                    <span className="block truncate text-[9px] font-black uppercase tracking-[0.13em] sm:hidden">
                      {section.shortLabel}
                    </span>

                    <span className="hidden truncate text-[10px] font-black uppercase tracking-[0.14em] sm:block">
                      {section.label}
                    </span>
                  </span>
                </div>

                <span
                  className={`absolute inset-x-3 bottom-1 h-px rounded-full transition ${
                    active
                      ? "bg-sky-300/70"
                      : "bg-transparent"
                  }`}
                />
              </button>
            );
          }
        )}
      </div>
    </nav>
  );
}
