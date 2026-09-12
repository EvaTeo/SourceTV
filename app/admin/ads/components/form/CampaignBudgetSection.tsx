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

export default function CampaignBudgetSection({
  form,
  updateForm,
}: Props) {
  return (
    <FormSection title="Budget">
      <div className="grid gap-3 md:grid-cols-2">
        <Field label="Budget Dollars">
          <input
            type="number"
            value={form.budgetDollars}
            onChange={(event) =>
              updateForm(
                "budgetDollars",
                event.target.value
              )
            }
            className="input"
          />
        </Field>

        <Field label="CPM Dollars">
          <input
            type="number"
            value={form.cpmDollars}
            onChange={(event) =>
              updateForm(
                "cpmDollars",
                event.target.value
              )
            }
            className="input"
          />
        </Field>
      </div>

      <div className="grid gap-3 md:grid-cols-2">
        <Field label="Priority">
          <input
            type="number"
            value={form.priority}
            onChange={(event) =>
              updateForm(
                "priority",
                event.target.value
              )
            }
            className="input"
          />
        </Field>

        <Field label="Max Impressions">
          <input
            type="number"
            value={form.maxImpressions}
            onChange={(event) =>
              updateForm(
                "maxImpressions",
                event.target.value
              )
            }
            className="input"
            placeholder="Optional"
          />
        </Field>
      </div>
    </FormSection>
  );
}