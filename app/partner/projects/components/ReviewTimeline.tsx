import {
  getStageIndex,
  reviewStages,
  stageLabels,
} from "../utils";

type ReviewTimelineProps = {
  currentStage: string;
  detailed?: boolean;
};

export default function ReviewTimeline({
  currentStage,
  detailed = false,
}: ReviewTimelineProps) {
  const currentIndex = getStageIndex(currentStage);
  const isRejected = currentStage === "rejected";
  const isArchived = currentStage === "archived";

  return (
    <div
      className={
        detailed
          ? ""
          : "mt-5 rounded-2xl border border-white/[0.07] bg-black/20 p-4"
      }
    >
      <p className="text-[10px] font-black uppercase tracking-[0.18em] text-white/35">
        Review Progress
      </p>

      <p className="mt-1 text-xs text-white/30">
        {isRejected
          ? "This submission was not approved."
          : isArchived
            ? "This project is archived."
            : stageLabels[currentStage] ||
              currentStage}
      </p>

      {!isRejected && !isArchived ? (
        <div className="mt-4 grid grid-cols-7 gap-1.5">
          {reviewStages.map((stage, index) => {
            const complete =
              index < currentIndex;

            const active =
              index === currentIndex;

            return (
              <div
                key={stage.value}
                className="min-w-0"
              >
                <div
                  className={`h-1.5 rounded-full ${
                    complete
                      ? "bg-emerald-300/75"
                      : active
                        ? "bg-sky-300 shadow-[0_0_12px_rgba(125,211,252,0.55)]"
                        : "bg-white/10"
                  }`}
                />

                <p
                  className={`mt-2 truncate text-[9px] font-black uppercase tracking-[0.08em] ${
                    active
                      ? "text-sky-200"
                      : complete
                        ? "text-white/40"
                        : "text-white/20"
                  }`}
                >
                  {stage.shortLabel}
                </p>
              </div>
            );
          })}
        </div>
      ) : null}
    </div>
  );
}