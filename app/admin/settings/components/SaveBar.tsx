"use client";

type Props = {
  saving?: boolean;
  onSave: () => void;
};

export default function SaveBar({
  saving,
  onSave,
}: Props) {
  return (
    <div className="sticky bottom-6 z-20 flex justify-end">
      <button
        type="button"
        onClick={onSave}
        disabled={saving}
        className="rounded-xl bg-sky-300 px-6 py-3 text-sm font-semibold text-[#05070d] transition hover:bg-sky-200 disabled:opacity-50"
      >
        {saving ? "Saving..." : "Save Settings"}
      </button>
    </div>
  );
}