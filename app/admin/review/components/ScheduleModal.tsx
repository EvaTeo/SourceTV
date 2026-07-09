import type { ContentItem } from "../types";
import { formatDate } from "../utils";

type Props = {
  item: ContentItem | null;
  date: string;
  time: string;
  setDate: (value: string) => void;
  setTime: (value: string) => void;
  onClose: () => void;
  onSave: () => void;
  onClear: () => void;
};

export default function ScheduleModal({
  item,
  date,
  time,
  setDate,
  setTime,
  onClose,
  onSave,
  onClear,
}: Props) {
  if (!item) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 px-4 backdrop-blur-sm">
      <div className="relative w-full max-w-lg overflow-hidden rounded-[2rem] border border-white/10 bg-black/88 p-6 shadow-[0_0_90px_rgba(0,0,0,0.72)] backdrop-blur-3xl">
        <div className="pointer-events-none absolute left-0 top-0 h-[1px] w-full bg-gradient-to-r from-transparent via-sky-300/60 to-transparent shadow-[0_0_22px_rgba(56,189,248,0.8)]" />

        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-[10px] font-black uppercase tracking-[0.3em] text-sky-300">
              Schedule Premiere
            </p>

            <h2 className="mt-3 text-3xl font-black text-white">
              {item.title}
            </h2>

            <p className="mt-2 text-sm leading-6 text-white/50">
              Pick the month, day, and time this title should become public.
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/[0.04] text-white/60 transition hover:border-sky-300/40 hover:text-white"
          >
            ✕
          </button>
        </div>

        <div className="mt-6 grid gap-4 md:grid-cols-2">
          <label>
            <span className="block text-sm font-bold text-white/60">Date</span>
            <input
              type="date"
              value={date}
              onChange={(event) => setDate(event.target.value)}
              className="mt-2 w-full rounded-2xl border border-white/10 bg-black/55 px-4 py-3 text-white outline-none focus:border-sky-300"
            />
          </label>

          <label>
            <span className="block text-sm font-bold text-white/60">Time</span>
            <input
              type="time"
              value={time}
              onChange={(event) => setTime(event.target.value)}
              className="mt-2 w-full rounded-2xl border border-white/10 bg-black/55 px-4 py-3 text-white outline-none focus:border-sky-300"
            />
          </label>
        </div>

        <div className="mt-6 rounded-2xl border border-white/10 bg-white/[0.035] p-4 text-sm leading-6 text-white/50">
          Scheduled content stays hidden from public browse until this date and
          time passes. Current schedule: {formatDate(item.scheduledAt)}
        </div>

        <div className="mt-6 flex flex-wrap gap-3">
          <button
            type="button"
            onClick={onSave}
            className="rounded-xl bg-sky-300 px-6 py-3 text-sm font-semibold text-[#05070d] transition hover:bg-sky-200"
          >
            Save Premiere
          </button>

          <button
            type="button"
            onClick={onClear}
            className="rounded-xl border border-white/10 bg-white/[0.04] px-6 py-3 text-sm font-semibold text-white/70 transition hover:border-white/25 hover:text-white"
          >
            Clear Schedule
          </button>

          <button
            type="button"
            onClick={onClose}
            className="rounded-xl border border-white/10 bg-white/[0.04] px-6 py-3 text-sm font-semibold text-white/50 transition hover:border-white/25 hover:text-white"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}