type InboxHeaderProps = {
  loading: boolean;
  onRefresh: () => void;
};

export default function InboxHeader({
  loading,
  onRefresh,
}: InboxHeaderProps) {
  return (
    <header className="flex flex-col justify-between gap-5 md:flex-row md:items-end">
      <div>
        <p className="text-[10px] font-black uppercase tracking-[0.28em] text-sky-300">
          SourceTV Partner Studio
        </p>

        <h1 className="mt-2 text-3xl font-black tracking-tight md:text-4xl">
          Inbox
        </h1>

        <p className="mt-2 max-w-2xl text-sm leading-6 text-white/45">
          Read messages from SourceTV review, rights, publishing, and partner
          operations teams.
        </p>
      </div>

      <button
        type="button"
        onClick={onRefresh}
        disabled={loading}
        className="w-fit rounded-xl border border-white/10 bg-white/[0.04] px-4 py-3 text-sm font-black text-white/65 transition hover:border-sky-300/30 hover:text-white disabled:cursor-not-allowed disabled:opacity-50"
      >
        {loading ? "Refreshing..." : "Refresh Inbox"}
      </button>
    </header>
  );
}