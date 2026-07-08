import ReplyComposer from "./ReplyComposer";

type Reply = {
  id: string;
  senderRole: string;
  senderName?: string | null;
  senderEmail?: string | null;
  body: string;
  createdAt: string;
};

type Message = {
  id: string;
  senderTeam: string;
  body: string;
  createdAt: string;
  replies?: Reply[];
};

type Props = {
  message: Message | null;
  reply: string;
  setReply: (value: string) => void;
  sending: boolean;
  onSend: () => void;
  formatDate: (date: string) => string;
};

export default function ThreadView({
  message,
  reply,
  setReply,
  sending,
  onSend,
  formatDate,
}: Props) {
  if (!message) {
    return (
      <div className="rounded-2xl border border-white/10 bg-white/[0.035] p-10 text-center text-white/40">
        Select a conversation.
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="rounded-2xl border border-white/10 bg-white/[0.035] p-5">
        <div className="space-y-4">
          <Bubble
            title={message.senderTeam}
            body={message.body}
            date={formatDate(message.createdAt)}
            admin
          />

          {(message.replies || []).map((replyItem) => (
            <Bubble
              key={replyItem.id}
              title={
                replyItem.senderName ||
                replyItem.senderEmail ||
                replyItem.senderRole
              }
              body={replyItem.body}
              date={formatDate(replyItem.createdAt)}
              admin={replyItem.senderRole !== "partner"}
            />
          ))}
        </div>
      </div>

      <ReplyComposer
        value={reply}
        onChange={setReply}
        onSend={onSend}
        sending={sending}
      />
    </div>
  );
}

function Bubble({
  title,
  body,
  date,
  admin,
}: {
  title: string;
  body: string;
  date: string;
  admin: boolean;
}) {
  return (
    <div
      className={`rounded-xl border p-4 ${
        admin
          ? "border-sky-300/20 bg-sky-300/10"
          : "border-emerald-300/20 bg-emerald-300/10"
      }`}
    >
      <div className="flex items-center justify-between">
        <p className="text-xs font-black uppercase tracking-[0.18em] text-white">
          {title}
        </p>

        <p className="text-[11px] text-white/40">{date}</p>
      </div>

      <p className="mt-3 whitespace-pre-wrap text-sm leading-7 text-white/75">
        {body}
      </p>
    </div>
  );
}