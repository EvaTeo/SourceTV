type ThreadBubbleProps = {
  role: string;
  name: string;
  body: string;
  date: string;
  isOwn?: boolean;
};

export default function ThreadBubble({
  role,
  name,
  body,
  date,
  isOwn,
}: ThreadBubbleProps) {
  const ownMessage = isOwn ?? role === "partner";

  return (
    <div
      className={`rounded-2xl border p-4 ${
        ownMessage
          ? "ml-0 border-sky-300/20 bg-sky-300/[0.065] md:ml-14"
          : "mr-0 border-white/10 bg-white/[0.025] md:mr-14"
      }`}
    >
      <div className="flex flex-col justify-between gap-2 sm:flex-row sm:items-center">
        <p
          className={`text-[9px] font-black uppercase tracking-[0.2em] ${
            ownMessage ? "text-sky-200" : "text-white/40"
          }`}
        >
          {ownMessage ? "You" : name}
        </p>

        <p className="text-[11px] font-semibold text-white/30">
          {new Date(date).toLocaleString([], {
            dateStyle: "medium",
            timeStyle: "short",
          })}
        </p>
      </div>

      <p className="mt-3 whitespace-pre-line text-sm leading-7 text-white/65">
        {body}
      </p>
    </div>
  );
}