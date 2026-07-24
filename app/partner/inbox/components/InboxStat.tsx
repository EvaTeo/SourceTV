type InboxStatProps = {
  label: string;
  value: number;
  highlighted?: boolean;
};

export default function InboxStat({
  label,
  value,
  highlighted = false,
}: InboxStatProps) {
  return (
    <div
      className={`rounded-2xl border p-5 ${
        highlighted
          ? "border-sky-300/20 bg-sky-300/[0.07]"
          : "border-white/10 bg-white/[0.035]"
      }`}
    >
      <p
        className={`text-[10px] font-black uppercase tracking-[0.2em] ${
          highlighted ? "text-sky-200/65" : "text-white/35"
        }`}
      >
        {label}
      </p>

      <p
        className={`mt-3 text-2xl font-black ${
          highlighted ? "text-sky-200" : "text-white"
        }`}
      >
        {value}
      </p>
    </div>
  );
}