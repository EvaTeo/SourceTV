import type { AdCampaignForm } from "../../types";

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

export default function CampaignScheduleSection({
  form,
  updateForm,
}: Props) {
  return (
    <FormSection title="Schedule">
      <div className="grid gap-3 md:grid-cols-2">
        <Field label="Start Date">
          <input
            type="datetime-local"
            value={form.startDate}
            onChange={(event) =>
              updateForm(
                "startDate",
                event.target.value
              )
            }
            className="input"
          />
        </Field>

        <Field label="End Date">
          <input
            type="datetime-local"
            value={form.endDate}
            onChange={(event) =>
              updateForm(
                "endDate",
                event.target.value
              )
            }
            className="input"
          />
        </Field>
      </div>
    </FormSection>
  );
}