type ContractsHeaderProps = {
  onRefresh: () => void;
};

export default function ContractsHeader({
  onRefresh,
}: ContractsHeaderProps) {
  return (
    <header className="flex flex-col justify-between gap-6 border-b border-white/10 pb-7 lg:flex-row lg:items-end">
      <div className="max-w-2xl">
        <p className="text-[10px] font-black uppercase tracking-[0.28em] text-sky-300">
          SourceTV Partner Studio
        </p>

        <h1 className="mt-3 text-3xl font-black tracking-tight text-white sm:text-4xl">
          Contracts
        </h1>

        <p className="mt-3 text-sm leading-6 text-white/45 sm:text-[15px]">
          Review agreements, confirm licensing terms, sign contracts, and
          request revisions before your titles move forward.
        </p>
      </div>

      <button
        type="button"
        onClick={onRefresh}
        className="w-fit rounded-xl border border-white/10 bg-white/[0.035] px-4 py-2.5 text-xs font-black text-white/65 transition hover:border-sky-300/30 hover:text-white"
      >
        Refresh Contracts
      </button>
    </header>
  );
}