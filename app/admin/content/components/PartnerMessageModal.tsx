"use client";

import ModalField from "./ModalField";

type MessageForm = {
  senderTeam: string;
  subject: string;
  message: string;
};

type PartnerMessageModalProps = {
  title: string;
  saving: boolean;

  form: MessageForm;

  setForm: React.Dispatch<
    React.SetStateAction<MessageForm>
  >;

  onClose: () => void;
  onSend: () => void;
};

export default function PartnerMessageModal({
  title,
  saving,
  form,
  setForm,
  onClose,
  onSend,
}: PartnerMessageModalProps) {
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/75 p-4 backdrop-blur-sm">
      <div className="w-full max-w-xl rounded-[28px] border border-white/10 bg-[#0b0d12] p-5 shadow-2xl sm:p-6">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-sky-300">
              Partner Communication
            </p>

            <h2 className="mt-2 text-2xl font-black text-white">
              Message Partner
            </h2>

            <p className="mt-2 text-sm text-white/40">
              Send a SourceTV message about{" "}
              <span className="font-semibold text-white/65">
                {title}
              </span>
              .
            </p>
          </div>

          <button
            type="button"
            disabled={saving}
            onClick={onClose}
            className="rounded-lg p-2 text-white/30 transition hover:bg-white/[0.05] hover:text-white"
          >
            ×
          </button>
        </div>

        <div className="mt-6 space-y-4">
          <ModalField label="Sender Team">
            <input
              value={form.senderTeam}
              onChange={(event) =>
                setForm((current) => ({
                  ...current,
                  senderTeam: event.target.value,
                }))
              }
              className="w-full rounded-xl border border-white/10 bg-black/30 px-4 py-3 text-sm text-white outline-none focus:border-sky-300/40"
            />
          </ModalField>

          <ModalField label="Subject">
            <input
              value={form.subject}
              onChange={(event) =>
                setForm((current) => ({
                  ...current,
                  subject: event.target.value,
                }))
              }
              className="w-full rounded-xl border border-white/10 bg-black/30 px-4 py-3 text-sm text-white outline-none focus:border-sky-300/40"
            />
          </ModalField>

          <ModalField label="Message">
            <textarea
              value={form.message}
              onChange={(event) =>
                setForm((current) => ({
                  ...current,
                  message: event.target.value,
                }))
              }
              rows={7}
              className="w-full rounded-xl border border-white/10 bg-black/30 px-4 py-3 text-sm leading-6 text-white outline-none focus:border-sky-300/40"
            />
          </ModalField>
        </div>

        <div className="mt-6 flex justify-end gap-2">
          <button
            type="button"
            disabled={saving}
            onClick={onClose}
            className="rounded-xl border border-white/10 px-4 py-2.5 text-sm font-semibold text-white/55 transition hover:border-white/20 hover:text-white"
          >
            Cancel
          </button>

          <button
            type="button"
            disabled={
              saving ||
              !form.message.trim()
            }
            onClick={onSend}
            className="rounded-xl bg-sky-300 px-4 py-2.5 text-sm font-black text-black transition hover:bg-sky-200 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {saving
              ? "Sending..."
              : "Send Message"}
          </button>
        </div>
      </div>
    </div>
  );
}