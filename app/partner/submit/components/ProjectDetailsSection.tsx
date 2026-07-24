import {
  GENRES,
  MATURITY_RATINGS,
  PROJECT_TYPES,
} from "../constants";

import type {
  ProjectForm,
} from "../types";

import FormSection from "./FormSection";

import {
  SelectField,
  TextAreaField,
  TextField,
} from "./FormFields";

export default function ProjectDetailsSection({
  form,
  updateField,
}: {
  form: ProjectForm;
  updateField: (
    name: keyof ProjectForm,
    value: string
  ) => void;
}) {
  return (
    <FormSection
      id="project-details"
      number="01"
      title="Project Details"
      description="The essential information viewers and the SourceTV review team will see."
    >
      <div className="grid gap-5 sm:grid-cols-2">
        <TextField
          label="Project title"
          value={form.title}
          placeholder="Enter your title"
          required
          onChange={(value) =>
            updateField("title", value)
          }
        />

        <TextField
          label="Release year"
          type="number"
          value={form.year}
          placeholder="2026"
          min="1888"
          max="2100"
          onChange={(value) =>
            updateField("year", value)
          }
        />

        <SelectField
          label="Project type"
          value={form.type}
          options={PROJECT_TYPES}
          onChange={(value) =>
            updateField("type", value)
          }
        />

        <SelectField
          label="Genre"
          value={form.genre}
          options={GENRES}
          onChange={(value) =>
            updateField("genre", value)
          }
        />

        <SelectField
          label="Maturity rating"
          value={form.maturityRating}
          options={MATURITY_RATINGS}
          onChange={(value) =>
            updateField(
              "maturityRating",
              value
            )
          }
        />

        <TextField
          label="Runtime"
          value={form.runtime}
          placeholder="Example: 1h 42m"
          onChange={(value) =>
            updateField("runtime", value)
          }
        />

        <TextField
          label="Creator or representative"
          value={form.creatorName}
          placeholder="Creator name"
          onChange={(value) =>
            updateField(
              "creatorName",
              value
            )
          }
        />

        <TextField
          label="Company or studio"
          value={form.creatorCompany}
          placeholder="Optional"
          onChange={(value) =>
            updateField(
              "creatorCompany",
              value
            )
          }
        />
      </div>

      <TextAreaField
        label="Project description"
        value={form.description}
        placeholder="Introduce the story, subject, audience, and tone of your project."
        required
        maxLength={1200}
        onChange={(value) =>
          updateField("description", value)
        }
      />
    </FormSection>
  );
}
