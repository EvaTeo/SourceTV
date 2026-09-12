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

export default function CampaignDeliverySection({
  form,
  updateForm,
}: Props) {
  return (
    <FormSection title="Skip Rules">
      <div className="grid gap-3 md:grid-cols-2">
        <Field label="Skip Policy">
          <select
            value={form.skipPolicy}
            onChange={(event) =>
              updateForm(
                "skipPolicy",
                event.target.value
              )
            }
            className="input"
          >
            <option value="after_delay">
              After Delay
            </option>

            <option value="never">
              Never Skippable
            </option>
          </select>
        </Field>

        <Field label="Skip After Seconds">
          <input
            type="number"
            value={form.skipAfterSeconds}
            onChange={(event) =>
              updateForm(
                "skipAfterSeconds",
                event.target.value
              )
            }
            className="input"
          />
        </Field>
      </div>

      <label className="mt-4 flex items-center gap-3 rounded-2xl border border-white/10 bg-black/25 p-4">
        <input
          type="checkbox"
          checked={form.premiumCanSkip}
          onChange={(event) =>
            updateForm(
              "premiumCanSkip",
              event.target.checked
            )
          }
          className="h-4 w-4 accent-sky-300"
        />

        <span className="text-sm font-bold text-white/65">
          Premium users can skip commercial ads after delay
        </span>
      </label>
    </FormSection>
  );
}