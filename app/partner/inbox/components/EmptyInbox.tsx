export default function EmptyInbox() {
  return (
    <div className="rounded-2xl border border-white/10 bg-black/20 p-8">
      <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-sky-300/20 bg-sky-300/10 text-xl">
        ✉
      </div>

      <h3 className="mt-5 text-xl font-black text-white">
        Your inbox is empty
      </h3>

      <p className="mt-2 max-w-xl text-sm leading-6 text-white/40">
        Messages from SourceTV review, rights, publishing, and partner
        operations teams will appear here.
      </p>
    </div>
  );
}