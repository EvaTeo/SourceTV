type HeroDraft = {
  heroBadge: string;
  heroPriority: string;
  heroStartDate: string;
  heroEndDate: string;
};

type Props = {
  draft: HeroDraft;
  saving: boolean;
  onDraftChange: (
    key: keyof HeroDraft,
    value: string
  ) => void;
  onSave: () => void;
};

const inputClass =
  "w-full rounded-xl border border-white/10 bg-black/25 px-4 py-3 text-sm text-white outline-none transition placeholder:text-white/25 focus:border-sky-300/40";

export default function HeroEditor({
  draft,
  saving,
  onDraftChange,
  onSave,
}: Props) {
  return (
    <div className="grid gap-5 lg:grid-cols-2">
      <label>
        <span className="mb-2 block text-xs font-semibold uppercase tracking-[0.16em] text-white/40">
          Hero Badge
        </span>

        <input
          value={draft.heroBadge}
          onChange={(e) =>
            onDraftChange("heroBadge", e.target.value)
          }
          className={inputClass}
          placeholder="Editor's Pick"
        />
      </label>

      <label>
        <span className="mb-2 block text-xs font-semibold uppercase tracking-[0.16em] text-white/40">
          Hero Priority
        </span>

        <input
          type="number"
          min={1}
          value={draft.heroPriority}
          onChange={(e) =>
            onDraftChange("heroPriority", e.target.value)
          }
          className={inputClass}
        />
      </label>

      <label>
        <span className="mb-2 block text-xs font-semibold uppercase tracking-[0.16em] text-white/40">
          Start Date
        </span>

        <input
          type="date"
          value={draft.heroStartDate}
          onChange={(e) =>
            onDraftChange("heroStartDate", e.target.value)
          }
          className={inputClass}
        />
      </label>

      <label>
        <span className="mb-2 block text-xs font-semibold uppercase tracking-[0.16em] text-white/40">
          End Date
        </span>

        <input
          type="date"
          value={draft.heroEndDate}
          onChange={(e) =>
            onDraftChange("heroEndDate", e.target.value)
          }
          className={inputClass}
        />
      </label>

      <div className="lg:col-span-2 flex justify-end pt-2">
        <button
          type="button"
          disabled={saving}
          onClick={onSave}
          className="rounded-xl bg-sky-300 px-5 py-3 text-sm font-semibold text-[#05070d] transition hover:bg-sky-200 disabled:opacity-50"
        >
          {saving ? "Saving..." : "Save Changes"}
        </button>
      </div>
    </div>
  );
}