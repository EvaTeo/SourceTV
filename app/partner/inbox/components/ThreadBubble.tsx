import { formatDate } from "../utils";

type ThreadBubbleProps = {
  role: string;
  name: string;
  body: string;
  date: string;
};

export default function ThreadBubble({
  role,
  name,
  body,
  date,
}: ThreadBubbleProps) {
  const isPartner = role === "partner";

  return (
    <div
      className={`flex ${
        isPartner ? "justify-end" : "justify-start"
      }`}
    >
      <div
        className={`max-w-[88%] sm:max-w-[76%] ${
          isPartner ? "items-end" : "items-start"
        }`}
      >
        <div
          className={`mb-1.5 flex items-center gap-2 px-1 ${
            isPartner
              ? "justify-end"
              : "justify-start"
          }`}
        >
          <p
            className={`text-[10px] font-bold ${
              isPartner
                ? "text-sky-200/70"
                : "text-white/35"
            }`}
          >
            {isPartner ? "You" : name}
          </p>

          <span className="text-[9px] text-white/20">
            {formatDate(date)}
          </span>
        </div>

        <div
          className={`rounded-2xl px-4 py-3 ${
            isPartner
              ? "rounded-br-md bg-sky-300 text-[#071018]"
              : "rounded-bl-md border border-white/[0.07] bg-white/[0.055] text-white"
          }`}
        >
          <p
            className={`whitespace-pre-wrap break-words text-[14px] leading-6 ${
              isPartner
                ? "font-medium text-[#071018]"
                : "text-white/72"
            }`}
          >
            {body}
          </p>
        </div>
      </div>
    </div>
  );
}