type Props = {
  value: string;
  onChange: (value: string) => void;
  onSend: () => void;
  sending: boolean;
};

export default function ReplyComposer({
  value,
  onChange,
  onSend,
  sending,
}: Props) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.035] p-4">
      <p className="text-[10px] font-black uppercase tracking-[0.22em] text-sky-300">
        Reply
      </p>

      <textarea
        rows={5}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Write a reply..."
        className="mt-4 w-full resize-none rounded-xl border border-white/10 bg-[#05070d] px-4 py-3 text-sm text-white outline-none focus:border-sky-300/40"
      />

      <div className="mt-4 flex justify-end">
        <button
          type="button"
          onClick={onSend}
          disabled={sending || !value.trim()}
          className="rounded-xl bg-sky-300 px-5 py-3 text-xs font-black text-black transition hover:bg-sky-200 disabled:opacity-40"
        >
          {sending ? "Sending..." : "Send Reply"}
        </button>
      </div>
    </div>
  );
}