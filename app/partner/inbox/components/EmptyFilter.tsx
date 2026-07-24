export default function EmptyFilter() {
  return (
    <div className="rounded-2xl border border-white/10 bg-black/20 p-8 text-center">
      <h3 className="text-lg font-black text-white">
        No messages in this view
      </h3>

      <p className="mt-2 text-sm text-white/40">
        Select another inbox filter to see more messages.
      </p>
    </div>
  );
}