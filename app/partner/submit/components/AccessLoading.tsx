export default function AccessLoading() {
  return (
    <main className="flex min-h-[65vh] items-center justify-center px-6">
      <div className="rounded-3xl border border-white/10 bg-white/[0.035] px-10 py-8 text-center shadow-2xl">
        <div className="mx-auto h-8 w-8 animate-spin rounded-full border-2 border-white/15 border-t-sky-300" />

        <p className="mt-4 text-sm font-medium text-white/45">
          Opening submission studio...
        </p>
      </div>
    </main>
  );
}
