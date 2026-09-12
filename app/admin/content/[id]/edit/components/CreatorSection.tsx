import type { ContentEditorForm } from "../types";

import EditorSectionHeader from "./EditorSectionHeader";

type CreatorSectionProps = {
  form: ContentEditorForm;

  updateField: (
    name: string,
    value: unknown
  ) => void;
};

const inputClass =
  "mt-2 w-full rounded-2xl border border-white/10 bg-black px-4 py-3 text-white outline-none transition focus:border-sky-300/40";

export default function CreatorSection({
  form,
  updateField,
}: CreatorSectionProps) {
  return (
    <>
      <EditorSectionHeader
        title="Creator"
        description="Partner and creator information attached to this title."
        bordered
      />

      <div>
        <label className="block text-sm font-bold text-white/60">
          Creator Name
        </label>

        <input
          value={
            form.creatorName ||
            ""
          }
          onChange={(event) =>
            updateField(
              "creatorName",
              event.target.value
            )
          }
          className={inputClass}
        />
      </div>

      <div>
        <label className="block text-sm font-bold text-white/60">
          Creator Email
        </label>

        <input
          value={
            form.creatorEmail ||
            ""
          }
          onChange={(event) =>
            updateField(
              "creatorEmail",
              event.target.value
            )
          }
          className={inputClass}
        />
      </div>

      <div className="md:col-span-2">
        <label className="block text-sm font-bold text-white/60">
          Creator Company
        </label>

        <input
          value={
            form.creatorCompany ||
            ""
          }
          onChange={(event) =>
            updateField(
              "creatorCompany",
              event.target.value
            )
          }
          className={inputClass}
        />
      </div>
    </>
  );
}