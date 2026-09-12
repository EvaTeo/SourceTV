import type { ContentEditorForm } from "../types";

import EditorSectionHeader from "./EditorSectionHeader";

type MetadataSectionProps = {
  form: ContentEditorForm;
  updateField: (
    name: string,
    value: unknown
  ) => void;
};

const inputClass =
  "mt-2 w-full rounded-2xl border border-white/10 bg-black px-4 py-3 text-white outline-none transition focus:border-sky-300/40";

export default function MetadataSection({
  form,
  updateField,
}: MetadataSectionProps) {
  return (
    <>
      <EditorSectionHeader
        title="Metadata"
        description="Core title information shown across SourceTV."
      />

      <div className="md:col-span-2">
        <label className="block text-sm font-bold text-white/60">
          Title
        </label>

        <input
          value={form.title || ""}
          onChange={(event) =>
            updateField(
              "title",
              event.target.value
            )
          }
          className={inputClass}
        />
      </div>

      <div className="md:col-span-2">
        <label className="block text-sm font-bold text-white/60">
          Description
        </label>

        <textarea
          value={
            form.description || ""
          }
          onChange={(event) =>
            updateField(
              "description",
              event.target.value
            )
          }
          rows={6}
          className={inputClass}
        />
      </div>

      <div>
        <label className="block text-sm font-bold text-white/60">
          Type
        </label>

        <input
          value={form.type || ""}
          onChange={(event) =>
            updateField(
              "type",
              event.target.value
            )
          }
          className={inputClass}
        />
      </div>

      <div>
        <label className="block text-sm font-bold text-white/60">
          Genre
        </label>

        <input
          value={form.genre || ""}
          onChange={(event) =>
            updateField(
              "genre",
              event.target.value
            )
          }
          className={inputClass}
        />
      </div>

      <div>
        <label className="block text-sm font-bold text-white/60">
          Year
        </label>

        <input
          value={
            form.year !== null &&
            form.year !== undefined
              ? String(form.year)
              : ""
          }
          onChange={(event) =>
            updateField(
              "year",
              event.target.value
            )
          }
          className={inputClass}
        />
      </div>

      <div>
        <label className="block text-sm font-bold text-white/60">
          Runtime
        </label>

        <input
          value={form.runtime || ""}
          onChange={(event) =>
            updateField(
              "runtime",
              event.target.value
            )
          }
          className={inputClass}
        />
      </div>

      <div>
        <label className="block text-sm font-bold text-white/60">
          Maturity Rating
        </label>

        <input
          value={
            form.maturityRating || ""
          }
          onChange={(event) =>
            updateField(
              "maturityRating",
              event.target.value
            )
          }
          className={inputClass}
        />
      </div>

      <div>
        <label className="block text-sm font-bold text-white/60">
          Revenue Share
        </label>

        <input
          type="number"
          value={
            form.revenueShare ??
            ""
          }
          onChange={(event) =>
            updateField(
              "revenueShare",
              event.target.value
                ? Number(
                    event.target.value
                  )
                : null
            )
          }
          className={inputClass}
        />
      </div>
    </>
  );
}