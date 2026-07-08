export default function DetailBlock({
  title,
  lines,
}: {
  title: string;
  lines: string[];
}) {
  return (
    <div>
      <p className="text-[10px] font-black uppercase tracking-[0.22em] text-sky-300">
        {title}
      </p>

      <div className="mt-3 space-y-2 text-xs leading-5 text-white/48">
        {lines.map((line, index) => (
          <p key={`${title}-${index}`}>{line}</p>
        ))}
      </div>
    </div>
  );
}