import { stageLabels } from "../utils";

type ProjectProgressProps = {
  currentStage: string;
};

const workflowStages = [
  {
    value: "submission",
    label: "Submitted",
  },
  {
    value: "metadata_review",
    label: "Metadata",
  },
  {
    value: "content_review",
    label: "Content",
  },
  {
    value: "rights_review",
    label: "Rights",
  },
  {
    value: "approved",
    label: "Approved",
  },
  {
    value: "scheduled",
    label: "Scheduled",
  },
  {
    value: "published",
    label: "Published",
  },
];

function normalizeStage(stage: string) {
  const aliases: Record<string, string> = {
    submitted: "submission",
    pending: "submission",
    metadata: "metadata_review",
    content: "content_review",
    rights: "rights_review",
    review: "content_review",
  };

  return aliases[stage] || stage;
}

export default function ProjectProgress({
  currentStage,
}: ProjectProgressProps) {
  const normalizedStage = normalizeStage(currentStage);

  const currentIndex = Math.max(
    workflowStages.findIndex(
      (stage) => stage.value === normalizedStage
    ),
    0
  );

  const percentage = Math.round(
    ((currentIndex + 1) / workflowStages.length) *
      100
  );

  const stageLabel =
    stageLabels[currentStage] ||
    workflowStages[currentIndex]?.label ||
    currentStage;

  return (
    <section className="overflow-hidden rounded-2xl border border-sky-300/20 bg-sky-300/[0.035]">
      <div className="border-b border-sky-300/10 p-5">
        <p className="text-[10px] font-black uppercase tracking-[0.22em] text-sky-300">
          Review Progress
        </p>

        <div className="mt-3 flex items-end justify-between gap-4">
          <div>
            <h3 className="text-xl font-black text-white">
              {stageLabel}
            </h3>

            <p className="mt-1 text-xs leading-5 text-white/35">
              Current SourceTV workflow position
            </p>
          </div>

          <p className="text-2xl font-black text-white">
            {percentage}%
          </p>
        </div>

        <div className="mt-5 h-1.5 overflow-hidden rounded-full bg-white/[0.08]">
          <div
            className="h-full rounded-full bg-sky-300 transition-[width] duration-700"
            style={{
              width: `${percentage}%`,
            }}
          />
        </div>
      </div>

      <div className="space-y-1 p-3">
        {workflowStages.map((stage, index) => {
          const complete = index < currentIndex;
          const current = index === currentIndex;

          return (
            <div
              key={stage.value}
              className={`flex items-center gap-3 rounded-xl px-3 py-2.5 ${
                current
                  ? "bg-sky-300/[0.08]"
                  : ""
              }`}
            >
              <span
                className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full border text-[10px] font-black ${
                  complete
                    ? "border-sky-300 bg-sky-300 text-black"
                    : current
                    ? "border-sky-300/60 bg-sky-300/10 text-sky-200"
                    : "border-white/10 bg-white/[0.025] text-white/20"
                }`}
              >
                {complete ? "✓" : index + 1}
              </span>

              <span
                className={`text-xs font-bold ${
                  current
                    ? "text-white"
                    : complete
                    ? "text-white/55"
                    : "text-white/25"
                }`}
              >
                {stage.label}
              </span>

              {current ? (
                <span className="ml-auto text-[9px] font-black uppercase tracking-[0.14em] text-sky-300">
                  Current
                </span>
              ) : null}
            </div>
          );
        })}
      </div>
    </section>
  );
}