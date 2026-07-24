type SectionHeaderProps = {
  eyebrow: string;
  title: string;
  description: string;
};

export default function SectionHeader({
  eyebrow,
  title,
  description,
}: SectionHeaderProps) {
  return (
    <div>
      <p className="text-[10px] font-black uppercase tracking-[0.22em] text-sky-300">
        {eyebrow}
      </p>

      <h3 className="mt-2 text-lg font-black text-white">
        {title}
      </h3>

      <p className="mt-2 text-xs leading-5 text-white/35">
        {description}
      </p>
    </div>
  );
}