import {
  targetOptions,
} from "../../constants";

import type {
  AdCampaignForm,
} from "../../types";

import {
  Field,
  FormSection,
} from "../CreateCampaignForm";

type Props = {
  form: AdCampaignForm;

  updateForm: (
    name: keyof AdCampaignForm,
    value: string | boolean
  ) => void;
};

export default function CampaignAudienceSection({
  form,
  updateForm,
}: Props) {
  return (
    <FormSection title="Audience">
      <Field label="Target Type">
        <select
          value={form.targetType}
          onChange={(event) =>
            updateForm(
              "targetType",
              event.target.value
            )
          }
          className="input"
        >
          {targetOptions.map(
            (option) => (
              <option
                key={option.value}
                value={option.value}
              >
                {option.label}
              </option>
            )
          )}
        </select>
      </Field>

      {form.targetType === "project" && (
        <Field label="Target Project ID">
          <input
            value={form.targetProjectId}
            onChange={(event) =>
              updateForm(
                "targetProjectId",
                event.target.value
              )
            }
            className="input"
            placeholder="ProjectSubmission ID"
          />
        </Field>
      )}

      <div className="grid gap-3 md:grid-cols-2">
        <Field label="Target Genres">
          <input
            value={form.targetGenres}
            onChange={(event) =>
              updateForm(
                "targetGenres",
                event.target.value
              )
            }
            className="input"
            placeholder="Drama, Horror, Comedy"
          />
        </Field>

        <Field label="Target Ratings">
          <input
            value={form.targetRatings}
            onChange={(event) =>
              updateForm(
                "targetRatings",
                event.target.value
              )
            }
            className="input"
            placeholder="PG-13, TV-MA, R"
          />
        </Field>
      </div>
    </FormSection>
  );
}