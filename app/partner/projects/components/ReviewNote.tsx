type ReviewNoteProps = {
  title: string;
  description: string;
  value?: string | null;
  tone: string;
};

export default function ReviewNote({
  title,
  description,
  value,
  tone,
}: ReviewNoteProps) {
  const hasNote = Boolean(value);

  const toneClass =
    tone === "yellow"
      ? "border-yellow-300/15 bg-yellow-300/[0.035]"
      : tone === "violet"
        ? "border-violet-300/15 bg-violet-300/[0.035]"
        : tone === "sky"
          ? "border-sky-300/15 bg-sky-300/[0.035]"
          : "border-white/[0.08] bg-black/20";

  return (
    <div
      className={`rounded-2xl border p-4 ${toneClass}`}
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-sm font-black text-white/80">
            {title}
          </p>

          <p className="mt-1 text-[11px] leading-5 text-white/30">
            {description}
          </p>
        </div>

        <span
          className={`shrink-0 rounded-full border px-2 py-1 text-[8px] font-black uppercase tracking-[0.12em] ${
            hasNote
              ? "border-yellow-300/15 bg-yellow-300/[0.06] text-yellow-100"
              : "border-emerald-300/15 bg-emerald-300/[0.05] text-emerald-200"
          }`}
        >
          {hasNote ? "Review" : "Clear"}
        </span>
      </div>

      <div className="mt-4 border-t border-white/[0.07] pt-4">
        <p
          className={`text-sm leading-6 ${
            hasNote
              ? "text-white/60"
              : "text-white/30"
          }`}
        >
          {value || "No notes have been added."}
        </p>
      </div>
    </div>
  );
}