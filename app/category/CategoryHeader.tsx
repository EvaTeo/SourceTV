export default function CategoryHeader({
  eyebrow = "SourceTV Collection",
  title,
  description,
}: {
  eyebrow?: string;
  title: string;
  description: string;
}) {
  return (
    <div className="max-w-3xl">
      <p className="text-[10px] font-black uppercase tracking-[0.34em] text-sky-300 md:text-xs">
        {eyebrow}
      </p>

      <h1 className="mt-3 text-4xl font-black leading-[0.92] tracking-[-0.045em] text-white md:text-7xl">
        {title}
      </h1>

      <p className="mt-4 max-w-2xl text-sm leading-7 text-white/55 md:text-base md:leading-8">
        {description}
      </p>
    </div>
  );
}