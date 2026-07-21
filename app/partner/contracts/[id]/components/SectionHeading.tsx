type SectionHeadingProps = {
  eyebrow: string;
  title: string;
  description: string;
};

export default function SectionHeading({
  eyebrow,
  title,
  description,
}: SectionHeadingProps) {
  return (
    <div>
      <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-sky-300">
        {eyebrow}
      </p>

      <h2 className="mt-2 text-2xl font-semibold tracking-tight text-white">
        {title}
      </h2>

      <p className="mt-2 text-sm leading-6 text-white/45">{description}</p>
    </div>
  );
}