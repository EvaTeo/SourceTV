type PartnerMessage = {
  id: string;
  senderTeam: string;
  subject: string;
  body: string;
  isRead?: boolean;
  createdAt: string;
};

function formatDate(date?: string | null) {
  if (!date) return "Not set";

  return new Date(date).toLocaleString([], {
    dateStyle: "medium",
    timeStyle: "short",
  });
}

export default function MessageHistoryBlock({
  messages,
}: {
  messages: PartnerMessage[];
}) {
  return (
    <div className="mt-6 rounded-2xl border border-white/10 bg-black/25 p-4">
      <div className="flex flex-col justify-between gap-2 border-b border-white/10 pb-4 md:flex-row md:items-end">
        <div>
          <p className="text-[10px] font-black uppercase tracking-[0.25em] text-sky-300">
            Message History
          </p>

          <p className="mt-2 text-sm font-bold text-white/55">
            Admin messages sent to the partner for this title.
          </p>
        </div>

        <p className="text-xs font-black uppercase tracking-[0.18em] text-white/28">
          {messages.length} Total
        </p>
      </div>

      {messages.length === 0 ? (
        <div className="mt-4 rounded-xl border border-dashed border-white/10 bg-white/[0.025] p-4">
          <p className="text-sm font-bold text-white/45">
            No messages have been sent for this title yet.
          </p>

          <p className="mt-2 text-xs leading-5 text-white/32">
            Use the Message button above to contact the partner. Once the admin
            content API includes partnerMessages, the sent history will appear
            here automatically.
          </p>
        </div>
      ) : (
        <div className="mt-4 space-y-3">
          {messages.map((message) => (
            <div
              key={message.id}
              className="rounded-xl border border-white/10 bg-white/[0.035] p-4"
            >
              <div className="flex flex-col justify-between gap-2 md:flex-row md:items-start">
                <div>
                  <p className="text-sm font-black text-white">
                    {message.subject}
                  </p>

                  <p className="mt-1 text-[11px] font-bold uppercase tracking-[0.16em] text-sky-300/75">
                    {message.senderTeam}
                  </p>
                </div>

                <p className="shrink-0 text-xs font-bold text-white/35">
                  {formatDate(message.createdAt)}
                </p>
              </div>

              <p className="mt-3 whitespace-pre-line text-sm leading-6 text-white/58">
                {message.body}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}