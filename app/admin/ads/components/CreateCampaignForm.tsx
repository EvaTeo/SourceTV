import type {
  FormEvent,
  ReactNode,
} from "react";

import type { AdCampaignForm } from "../types";

import CampaignAudienceSection from "./form/CampaignAudienceSection";
import CampaignBasicsSection from "./form/CampaignBasicsSection";
import CampaignBudgetSection from "./form/CampaignBudgetSection";
import CampaignDeliverySection from "./form/CampaignDeliverySection";
import CampaignMediaSection from "./form/CampaignMediaSection";
import CampaignScheduleSection from "./form/CampaignScheduleSection";

type CreateCampaignFormProps = {
  form: AdCampaignForm;
  saving: boolean;

  updateForm: (
    name: keyof AdCampaignForm,
    value: string | boolean
  ) => void;

  onSubmit: (
    event: FormEvent
  ) => void;
};

export default function CreateCampaignForm({
  form,
  saving,
  updateForm,
  onSubmit,
}: CreateCampaignFormProps) {
  return (
    <form
      onSubmit={onSubmit}
      className="rounded-[2rem] border border-white/10 bg-white/[0.045] p-5 shadow-2xl backdrop-blur-xl md:p-6"
    >
      <p className="text-[10px] font-black uppercase tracking-[0.3em] text-sky-300">
        Create Campaign
      </p>

      <h2 className="mt-2 text-2xl font-black">
        New Campaign
      </h2>

      <CampaignBasicsSection
        form={form}
        updateForm={updateForm}
      />

      <CampaignMediaSection
        form={form}
        updateForm={updateForm}
      />

      <CampaignAudienceSection
        form={form}
        updateForm={updateForm}
      />

      <CampaignDeliverySection
        form={form}
        updateForm={updateForm}
      />

      <CampaignBudgetSection
        form={form}
        updateForm={updateForm}
      />

      <CampaignScheduleSection
        form={form}
        updateForm={updateForm}
      />

      <button
        type="submit"
        disabled={saving}
        className="mt-6 w-full rounded-full bg-sky-400 px-6 py-3 text-sm font-black text-black shadow-[0_0_30px_rgba(56,189,248,0.35)] transition hover:bg-sky-300 disabled:cursor-not-allowed disabled:opacity-45"
      >
        {saving
          ? "Saving..."
          : "Create Campaign"}
      </button>
    </form>
  );
}

export function FormSection({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) {
  return (
    <section className="mt-6 rounded-[1.5rem] border border-white/10 bg-black/20 p-4">
      <p className="text-[10px] font-black uppercase tracking-[0.25em] text-sky-300">
        {title}
      </p>

      {children}
    </section>
  );
}

export function Field({
  label,
  children,
}: {
  label: string;
  children: ReactNode;
}) {
  return (
    <label className="mt-5 block">
      <span className="mb-2 block text-[10px] font-black uppercase tracking-[0.22em] text-white/35">
        {label}
      </span>

      {children}
    </label>
  );
}