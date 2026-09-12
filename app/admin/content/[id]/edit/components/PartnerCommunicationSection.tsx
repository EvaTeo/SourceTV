import EditorSectionHeader from "./EditorSectionHeader";

type PartnerCommunicationSectionProps = {
  subject: string;
  senderTeam: string;
  message: string;

  sending: boolean;

  onSubjectChange: (
    value: string
  ) => void;

  onSenderTeamChange: (
    value: string
  ) => void;

  onMessageChange: (
    value: string
  ) => void;

  onSend: () => void;
};

const inputClass =
  "mt-2 w-full rounded-2xl border border-white/10 bg-black px-4 py-3 text-white outline-none transition focus:border-sky-300/40";

export default function PartnerCommunicationSection({
  subject,
  senderTeam,
  message,
  sending,

  onSubjectChange,
  onSenderTeamChange,
  onMessageChange,
  onSend,
}: PartnerCommunicationSectionProps) {
  return (
    <>
      <EditorSectionHeader
        title="Partner Communication"
        description="Send a direct message to the creator or partner tied to this title."
        bordered
      />

      <div>
        <label className="block text-sm font-bold text-white/60">
          Subject
        </label>

        <input
          value={subject}
          onChange={(event) =>
            onSubjectChange(
              event.target.value
            )
          }
          className={inputClass}
        />
      </div>

      <div>
        <label className="block text-sm font-bold text-white/60">
          Sender Team
        </label>

        <input
          value={senderTeam}
          onChange={(event) =>
            onSenderTeamChange(
              event.target.value
            )
          }
          className={inputClass}
        />
      </div>

      <div className="md:col-span-2">
        <label className="block text-sm font-bold text-white/60">
          Message
        </label>

        <textarea
          value={message}
          onChange={(event) =>
            onMessageChange(
              event.target.value
            )
          }
          rows={6}
          className={inputClass}
        />

        <button
          type="button"
          disabled={sending}
          onClick={onSend}
          className="mt-3 rounded-full border border-sky-300/25 bg-sky-300/[0.08] px-5 py-2.5 text-xs font-black text-sky-200 transition hover:bg-sky-300/[0.12] disabled:cursor-not-allowed disabled:opacity-50"
        >
          {sending
            ? "Sending..."
            : "Send Partner Message"}
        </button>
      </div>
    </>
  );
}