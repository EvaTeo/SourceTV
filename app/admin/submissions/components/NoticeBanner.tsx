import type { Notice } from "../types";

type NoticeBannerProps = {
  notice: Notice;
  onDismiss: () => void;
};

export default function NoticeBanner({
  notice,
  onDismiss,
}: NoticeBannerProps) {
  const success =
    notice.type === "success";

  return (
    <section
      className={`flex items-start justify-between gap-4 rounded-2xl border px-4 py-3.5 ${
        success
          ? "border-emerald-300/18 bg-emerald-300/[0.055]"
          : "border-red-300/18 bg-red-300/[0.055]"
      }`}
    >
      <div>
        <p
          className={`text-xs font-black uppercase tracking-[0.14em] ${
            success
              ? "text-emerald-200"
              : "text-red-200"
          }`}
        >
          {success
            ? "Updated"
            : "Action Required"}
        </p>

        <p
          className={`mt-1 text-sm ${
            success
              ? "text-emerald-100/55"
              : "text-red-100/55"
          }`}
        >
          {notice.message}
        </p>
      </div>

      <button
        type="button"
        aria-label="Dismiss message"
        onClick={onDismiss}
        className="rounded-lg p-1 text-white/30 transition hover:bg-white/[0.05] hover:text-white/70"
      >
        ×
      </button>
    </section>
  );
}