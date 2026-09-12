import type { ContentEditorForm } from "../types";

import EditorSectionHeader from "./EditorSectionHeader";
import SchedulePicker from "./SchedulePicker";

type TimeOption = {
  label: string;
  value: string;
};

type PublishingSectionProps = {
  form: ContentEditorForm;

  updateField: (
    name: string,
    value: unknown
  ) => void;

  calendarOpen: boolean;
  timeOpen: boolean;

  calendarMonth: Date;

  calendarDays: (
    | Date
    | null
  )[];

  timeOptions: TimeOption[];

  setCalendarOpen: (
    value: boolean
  ) => void;

  setTimeOpen: (
    value: boolean
  ) => void;

  setCalendarMonth: (
    value: Date
  ) => void;

  onSelectDate: (
    date: Date
  ) => void;

  onSelectTime: (
    value: string
  ) => void;
};

const inputClass =
  "mt-2 w-full rounded-2xl border border-white/10 bg-black px-4 py-3 text-white outline-none transition focus:border-sky-300/40";

export default function PublishingSection({
  form,
  updateField,

  calendarOpen,
  timeOpen,

  calendarMonth,
  calendarDays,
  timeOptions,

  setCalendarOpen,
  setTimeOpen,
  setCalendarMonth,

  onSelectDate,
  onSelectTime,
}: PublishingSectionProps) {
  return (
    <>
      <EditorSectionHeader
        title="Publishing"
        description="Manage workflow state, scheduling, and featured placement."
        bordered
      />

      <div>
        <label className="block text-sm font-bold text-white/60">
          Workflow Stage
        </label>

        <select
          value={
            form.workflowStage ||
            "submission"
          }
          onChange={(event) =>
            updateField(
              "workflowStage",
              event.target.value
            )
          }
          className={inputClass}
        >
          <option value="submission">
            Submission
          </option>

          <option value="metadata_review">
            Metadata Review
          </option>

          <option value="content_review">
            Content Review
          </option>

          <option value="rights_review">
            Rights Review
          </option>

          <option value="approved">
            Approved
          </option>

          <option value="scheduled">
            Scheduled
          </option>

          <option value="published">
            Published
          </option>

          <option value="archived">
            Archived
          </option>

          <option value="rejected">
            Rejected
          </option>
        </select>
      </div>

      <div>
        <label className="block text-sm font-bold text-white/60">
          Status
        </label>

        <input
          value={form.status || ""}
          onChange={(event) =>
            updateField(
              "status",
              event.target.value
            )
          }
          className={inputClass}
        />
      </div>

      <SchedulePicker
        scheduledAt={
          form.scheduledAt
        }
        calendarOpen={
          calendarOpen
        }
        timeOpen={timeOpen}
        calendarMonth={
          calendarMonth
        }
        calendarDays={
          calendarDays
        }
        timeOptions={
          timeOptions
        }
        setCalendarOpen={
          setCalendarOpen
        }
        setTimeOpen={
          setTimeOpen
        }
        setCalendarMonth={
          setCalendarMonth
        }
        onSelectDate={
          onSelectDate
        }
        onSelectTime={
          onSelectTime
        }
        onClear={() =>
          updateField(
            "scheduledAt",
            null
          )
        }
      />

      <div className="md:col-span-2 grid gap-4 sm:grid-cols-2">
        <label className="flex items-center justify-between rounded-2xl border border-white/10 bg-black px-4 py-3">
          <span className="text-sm font-bold text-white/60">
            Featured
          </span>

          <input
            type="checkbox"
            checked={Boolean(
              form.featured
            )}
            onChange={(event) =>
              updateField(
                "featured",
                event.target.checked
              )
            }
          />
        </label>

        <div>
          <label className="block text-sm font-bold text-white/60">
            Featured Rank
          </label>

          <input
            type="number"
            value={
              form.featuredRank ??
              ""
            }
            onChange={(event) =>
              updateField(
                "featuredRank",
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
      </div>
    </>
  );
}