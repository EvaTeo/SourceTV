type EmptyPanelProps = {
  title: string;
  description: string;
};

export default function EmptyPanel({
  title,
  description,
}: EmptyPanelProps) {
  return (
    <section className="border-y border-white/10 py-14 text-white">
      <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-sky-300">
        SourceTV Rights
      </p>

      <h1 className="mt-2 text-2xl font-semibold">{title}</h1>

      <p className="mt-3 max-w-xl text-sm leading-6 text-white/45">
        {description}
      </p>
    </section>
  );
}