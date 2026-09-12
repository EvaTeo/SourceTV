import {
  placementOptions,
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

export default function CampaignMediaSection({
  form,
  updateForm,
}: Props) {
  return (
    <FormSection title="Media">
      <div className="grid gap-3 md:grid-cols-2">
        <Field label="Ad Source">
          <select
            value={form.adSource}
            onChange={(event) =>
              updateForm(
                "adSource",
                event.target.value
              )
            }
            className="input"
          >
            <option value="direct">
              SourceTV Direct
            </option>

            <option value="google">
              Google / VAST
            </option>
          </select>
        </Field>

        <Field label="Placement">
          <select
            value={form.placement}
            onChange={(event) =>
              updateForm(
                "placement",
                event.target.value
              )
            }
            className="input"
          >
            {placementOptions.map(
              (placement) => (
                <option
                  key={placement.value}
                  value={placement.value}
                >
                  {placement.label}
                </option>
              )
            )}
          </select>
        </Field>
      </div>

      {form.placement === "banner" && (
        <div className="mt-5 rounded-2xl border border-sky-300/20 bg-sky-300/10 p-4 text-xs font-bold leading-6 text-sky-100/75">
          Banner campaigns are meant for browse, home, search,
          and watch-page placements. Use an image URL for the
          cleanest launch-ready banner; video URL is supported
          for animated sponsored banners.
        </div>
      )}

      {form.adSource === "google" ? (
        <Field label="Google / VAST Tag URL">
          <input
            value={form.vastTagUrl}
            onChange={(event) =>
              updateForm(
                "vastTagUrl",
                event.target.value
              )
            }
            className="input"
            placeholder="https://pubads.g.doubleclick.net/gampad/ads?..."
          />
        </Field>
      ) : (
        <>
          <Field label="Ad Video URL">
            <input
              value={form.videoUrl}
              onChange={(event) =>
                updateForm(
                  "videoUrl",
                  event.target.value
                )
              }
              className="input"
              placeholder="Bunny HLS or Bunny embed URL"
            />
          </Field>

          <Field
            label={
              form.placement === "banner"
                ? "Banner Image URL"
                : "Image / Banner URL"
            }
          >
            <input
              value={form.imageUrl}
              onChange={(event) =>
                updateForm(
                  "imageUrl",
                  event.target.value
                )
              }
              className="input"
              placeholder={
                form.placement === "banner"
                  ? "https://.../banner.jpg"
                  : "Banner, thumbnail, or poster URL"
              }
            />
          </Field>
        </>
      )}

      <Field label="Click URL">
        <input
          value={form.clickUrl}
          onChange={(event) =>
            updateForm(
              "clickUrl",
              event.target.value
            )
          }
          className="input"
          placeholder="https://advertiser.com"
        />
      </Field>
    </FormSection>
  );
}