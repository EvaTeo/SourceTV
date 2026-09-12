import {
  adTypeOptions,
  objectiveOptions,
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

export default function CampaignBasicsSection({
  form,
  updateForm,
}: Props) {
  return (
    <FormSection title="Campaign">
      <Field label="Campaign Name">
        <input
          value={form.name}
          onChange={(event) =>
            updateForm(
              "name",
              event.target.value
            )
          }
          className="input"
          placeholder="Summer launch campaign"
        />
      </Field>

      <Field label="Advertiser">
        <input
          value={form.advertiser}
          onChange={(event) =>
            updateForm(
              "advertiser",
              event.target.value
            )
          }
          className="input"
          placeholder="Brand, sponsor, or SourceTV"
        />
      </Field>

      <div className="grid gap-3 md:grid-cols-2">
        <Field label="Ad Type">
          <select
            value={form.adType}
            onChange={(event) =>
              updateForm(
                "adType",
                event.target.value
              )
            }
            className="input"
          >
            {adTypeOptions.map(
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

        <Field label="Objective">
          <select
            value={form.objective}
            onChange={(event) =>
              updateForm(
                "objective",
                event.target.value
              )
            }
            className="input"
          >
            {objectiveOptions.map(
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
      </div>
    </FormSection>
  );
}