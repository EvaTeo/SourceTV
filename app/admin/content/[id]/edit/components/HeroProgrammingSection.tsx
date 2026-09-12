import type { ContentEditorForm } from "../types";

import EditorSectionHeader from "./EditorSectionHeader";

type HeroProgrammingSectionProps = {
  form: ContentEditorForm;

  updateField: (
    name: string,
    value: unknown
  ) => void;
};

const inputClass =
  "mt-2 w-full rounded-2xl border border-white/10 bg-black px-4 py-3 text-white outline-none transition focus:border-sky-300/40";

function toDateTimeLocal(
  value?: string | null
) {
  if (!value) {
    return "";
  }

  const date = new Date(value);

  if (
    Number.isNaN(
      date.getTime()
    )
  ) {
    return "";
  }

  return date
    .toISOString()
    .slice(0, 16);
}

export default function HeroProgrammingSection({
  form,
  updateField,
}: HeroProgrammingSectionProps) {
  return (
    <>
      <EditorSectionHeader
        title="Hero Programming"
        description="Control homepage hero presentation and scheduling."
        bordered
      />

      <div>
        <label className="block text-sm font-bold text-white/60">
          Hero Badge
        </label>

        <input
          value={
            form.heroBadge || ""
          }
          onChange={(event) =>
            updateField(
              "heroBadge",
              event.target.value
            )
          }
          className={inputClass}
        />
      </div>

      <div>
        <label className="block text-sm font-bold text-white/60">
          Hero Priority
        </label>

        <input
          type="number"
          value={
            form.heroPriority ??
            ""
          }
          onChange={(event) =>
            updateField(
              "heroPriority",
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

      <div>
        <label className="block text-sm font-bold text-white/60">
          Hero Start
        </label>

        <input
          type="datetime-local"
          value={toDateTimeLocal(
            form.heroStartDate
          )}
          onChange={(event) =>
            updateField(
              "heroStartDate",
              event.target.value
                ? new Date(
                    event.target.value
                  ).toISOString()
                : null
            )
          }
          className={inputClass}
        />
      </div>

      <div>
        <label className="block text-sm font-bold text-white/60">
          Hero End
        </label>

        <input
          type="datetime-local"
          value={toDateTimeLocal(
            form.heroEndDate
          )}
          onChange={(event) =>
            updateField(
              "heroEndDate",
              event.target.value
                ? new Date(
                    event.target.value
                  ).toISOString()
                : null
            )
          }
          className={inputClass}
        />
      </div>
    </>
  );
}