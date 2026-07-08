type ProjectOption = {
  id: string;
  title: string;
  creatorName?: string | null;
  creatorEmail?: string | null;
  creatorCompany?: string | null;
};

type Props = {
  projects: ProjectOption[];
  projectId: string;
  partnerEmail: string;
  partnerName: string;
  senderTeam: string;
  subject: string;
  message: string;
  sending: boolean;

  setProjectId: (v: string) => void;
  setPartnerEmail: (v: string) => void;
  setPartnerName: (v: string) => void;
  setSenderTeam: (v: string) => void;
  setSubject: (v: string) => void;
  setMessage: (v: string) => void;

  selectProject: (id: string) => void;
  sendMessage: () => void;
};

export default function ComposeMessageCard({
  projects,
  projectId,
  partnerEmail,
  partnerName,
  senderTeam,
  subject,
  message,
  sending,
  setPartnerEmail,
  setPartnerName,
  setSenderTeam,
  setSubject,
  setMessage,
  selectProject,
  sendMessage,
}: Props) {
  return (
    <section className="rounded-2xl border border-white/10 bg-white/[0.035] p-6">
      <p className="text-[10px] font-black uppercase tracking-[0.25em] text-sky-300">
        Send Message
      </p>

      <div className="mt-5 grid gap-4">

        <select
          value={projectId}
          onChange={(e) => selectProject(e.target.value)}
          className="rounded-xl border border-white/10 bg-[#05070d] px-4 py-3 text-white"
        >
          <option value="">Choose Project...</option>

          {projects.map((project) => (
            <option key={project.id} value={project.id}>
              {project.title}
            </option>
          ))}
        </select>

        <input
          value={partnerEmail}
          onChange={(e) => setPartnerEmail(e.target.value)}
          placeholder="Partner Email"
          className="rounded-xl border border-white/10 bg-[#05070d] px-4 py-3 text-white"
        />

        <input
          value={partnerName}
          onChange={(e) => setPartnerName(e.target.value)}
          placeholder="Partner Name"
          className="rounded-xl border border-white/10 bg-[#05070d] px-4 py-3 text-white"
        />

        <input
          value={senderTeam}
          onChange={(e) => setSenderTeam(e.target.value)}
          placeholder="Sender Team"
          className="rounded-xl border border-white/10 bg-[#05070d] px-4 py-3 text-white"
        />

        <input
          value={subject}
          onChange={(e) => setSubject(e.target.value)}
          placeholder="Subject"
          className="rounded-xl border border-white/10 bg-[#05070d] px-4 py-3 text-white"
        />

        <textarea
          rows={8}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Write your message..."
          className="rounded-xl border border-white/10 bg-[#05070d] px-4 py-3 text-white"
        />

        <button
          onClick={sendMessage}
          disabled={sending}
          className="rounded-xl bg-sky-300 py-3 font-black text-black transition hover:bg-sky-200 disabled:opacity-40"
        >
          {sending ? "Sending..." : "Send Message"}
        </button>

      </div>
    </section>
  );
}