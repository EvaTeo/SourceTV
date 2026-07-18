import ReplyComposer from "./ReplyComposer";

export type ConversationItem = {
  id: string;
  title: string;
  body: string;
  date: string;
  isOwn: boolean;
};

type Props = {
  conversation: ConversationItem[];
  reply: string;
  setReply: (value: string) => void;
  sending: boolean;
  onSend: () => void;
  emptyMessage?: string;
};

export default function ThreadView({
  conversation,
  reply,
  setReply,
  sending,
  onSend,
  emptyMessage = "Select a conversation.",
}: Props) {
  if (!conversation.length) {
    return (
      <div className="rounded-2xl border border-white/10 bg-white/[0.035] p-10 text-center text-white/40">
        {emptyMessage}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="rounded-2xl border border-white/10 bg-white/[0.035] p-5">
        <div className="space-y-4">
          {conversation.map((item) => (
            <ConversationBubble
              key={item.id}
              title={item.title}
              body={item.body}
              date={item.date}
              isOwn={item.isOwn}
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

function ConversationBubble({
  title,
  body,
  date,
  isOwn,
}: {
  title: string;
  body: string;
  date: string;
  isOwn: boolean;
}) {
  return (
    <div
      className={`rounded-xl border p-4 ${
        isOwn
          ? "border-sky-300/20 bg-sky-300/10"
          : "border-emerald-300/20 bg-emerald-300/10"
      }`}
    >
      <div className="flex items-start justify-between gap-4">
        <p className="text-xs font-black uppercase tracking-[0.18em] text-white">
          {title}
        </p>

        <p className="shrink-0 text-[11px] text-white/40">
          {date}
        </p>
      </div>

      <p className="mt-3 whitespace-pre-wrap text-sm leading-7 text-white/75">
        {body}
      </p>
    </div>
  );
}