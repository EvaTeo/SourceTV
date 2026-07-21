type RequestChangesPanelProps = {
  changeNotes: string;
  saving: boolean;
  onChangeNotes: (value: string) => void;
  onCancel: () => void;
  onSubmit: () => void;
};

export default function RequestChangesPanel({
  changeNotes,
  saving,
  onChangeNotes,
  onCancel,
  onSubmit,
}: RequestChangesPanelProps) {
  return (
    <section className="border-l-2 border-yellow-300 bg-yellow-300/[0.035] px-5 py-6 md:px-7">
      <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-yellow-100">
        Request Contract Changes
      </p>

      <h2 className="mt-2 text-xl font-semibold text-white">
        What needs to be revised?
      </h2>

      <p className="mt-2 text-sm leading-6 text-white/45">
        Identify the specific language, dates, rights, or revenue terms you want
        SourceTV to review.
      </p>

      <textarea
        value={changeNotes}
        onChange={(event) => onChangeNotes(event.target.value)}
        placeholder="Describe the requested revisions..."
        className="mt-5 min-h-40 w-full resize-y border border-white/10 bg-black/20 px-4 py-4 text-sm leading-7 text-white outline-none placeholder:text-white/25 focus:border-yellow-300/60"
      />

      <div className="mt-4 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
        <button
          type="button"
          disabled={saving}
          onClick={onCancel}
          className="border border-white/10 px-5 py-3 text-sm font-semibold text-white/55 transition hover:border-white/25 hover:text-white disabled:opacity-40"
        >
          Cancel
        </button>

        <button
          type="button"
          disabled={saving}
          onClick={onSubmit}
          className="bg-yellow-300 px-5 py-3 text-sm font-black text-[#05070d] transition hover:bg-yellow-200 disabled:opacity-40"
        >
          {saving ? "Sending..." : "Send Request"}
        </button>
      </div>
    </section>
  );
}