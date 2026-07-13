"use client";

import {
  editorialInputClassName,
  placementOptions,
  statusOptions,
} from "../constants";
import type { CollectionForm as CollectionFormType } from "../types";
import Field from "./Field";

export default function CollectionForm({
  form,
  disabled,
  onChange,
}: {
  form: CollectionFormType;
  disabled: boolean;
  onChange: <K extends keyof CollectionFormType>(
    key: K,
    value: CollectionFormType[K]
  ) => void;
}) {
  return (
    <div className="grid gap-5 pt-6 md:grid-cols-2">
      <Field label="Collection Title">
        <input
          value={form.title}
          disabled={disabled}
          onChange={(event) =>
            onChange("title", event.target.value)
          }
          className={editorialInputClassName}
          placeholder="Halloween Favorites"
        />
      </Field>

      <Field label="Placement">
        <select
          value={form.placement}
          disabled={disabled}
          onChange={(event) =>
            onChange("placement", event.target.value)
          }
          className={editorialInputClassName}
        >
          {placementOptions.map((option) => (
            <option
              key={option.value}
              value={option.value}
            >
              {option.label}
            </option>
          ))}
        </select>
      </Field>

      <Field label="Status">
        <select
          value={form.status}
          disabled={disabled}
          onChange={(event) =>
            onChange("status", event.target.value)
          }
          className={editorialInputClassName}
        >
          {statusOptions.map((option) => (
            <option
              key={option.value}
              value={option.value}
            >
              {option.label}
            </option>
          ))}
        </select>
      </Field>

      <Field label="Row Order">
        <input
          type="number"
          min={0}
          value={form.sortOrder}
          disabled={disabled}
          onChange={(event) =>
            onChange(
              "sortOrder",
              Number(event.target.value)
            )
          }
          className={editorialInputClassName}
        />
      </Field>

      <Field label="Start Date">
        <input
          type="date"
          value={form.startsAt}
          disabled={disabled}
          onChange={(event) =>
            onChange("startsAt", event.target.value)
          }
          className={editorialInputClassName}
        />
      </Field>

      <Field label="End Date">
        <input
          type="date"
          value={form.endsAt}
          disabled={disabled}
          onChange={(event) =>
            onChange("endsAt", event.target.value)
          }
          className={editorialInputClassName}
        />
      </Field>

      <div className="md:col-span-2">
        <Field label="Description">
          <textarea
            value={form.description}
            disabled={disabled}
            onChange={(event) =>
              onChange(
                "description",
                event.target.value
              )
            }
            className={`${editorialInputClassName} min-h-28 resize-none`}
            placeholder="Optional internal description for this editorial collection."
          />
        </Field>
      </div>
    </div>
  );
}