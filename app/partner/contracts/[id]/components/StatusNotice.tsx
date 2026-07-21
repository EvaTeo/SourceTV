import type { ContractStatusTone } from "../../types";

type StatusNoticeProps = {
  eyebrow: string;
  title: string;
  description: string;
  tone: ContractStatusTone;
};

export default function StatusNotice({
  eyebrow,
  title,
  description,
  tone,
}: StatusNoticeProps) {
  const classes =
    tone === "green"
      ? "border-emerald-300 bg-emerald-300/[0.035] text-emerald-200"
      : tone === "red"
        ? "border-red-300 bg-red-300/[0.035] text-red-200"
        : "border-yellow-300 bg-yellow-300/[0.035] text-yellow-100";

  return (
    <section className={`border-l-2 px-5 py-5 ${classes}`}>
      <p className="text-[10px] font-bold uppercase tracking-[0.22em]">
        {eyebrow}
      </p>

      <h2 className="mt-2 text-lg font-semibold text-white">{title}</h2>

      <p className="mt-2 text-sm leading-6 text-white/55">{description}</p>
    </section>
  );
}