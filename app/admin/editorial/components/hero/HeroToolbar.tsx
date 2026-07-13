type HeroToolbarProps = {
  totalHeroes: number;
  onAddHero: () => void;
};

export default function HeroToolbar({
  totalHeroes,
  onAddHero,
}: HeroToolbarProps) {
  return (
    <div className="flex flex-col gap-6 border-b border-white/[0.08] pb-6 md:flex-row md:items-end md:justify-between">
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.22em] text-sky-300">
          Homepage Programming
        </p>

        <h2 className="mt-2 text-3xl font-semibold text-white">
          Hero Lineup
        </h2>

        <p className="mt-3 max-w-2xl text-sm leading-6 text-white/40">
          {totalHeroes} active hero title{totalHeroes === 1 ? "" : "s"}.
          Drag to reorder, edit scheduling, and control what viewers
          see first when SourceTV opens.
        </p>
      </div>

      <button
        type="button"
        onClick={onAddHero}
        className="rounded-xl bg-sky-300 px-5 py-3 text-sm font-semibold text-[#05070d] transition hover:bg-sky-200"
      >
        + Add Hero Title
      </button>
    </div>
  );
}