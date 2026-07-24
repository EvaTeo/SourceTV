export default function SubmissionHeader() {
  return (
    <header className="relative mx-auto max-w-5xl overflow-hidden px-4 pb-4 pt-1 text-center">
      <div className="pointer-events-none absolute left-1/2 top-0 h-44 w-[620px] -translate-x-1/2 rounded-full bg-sky-300/[0.055] blur-[95px]" />

      <div className="relative">
        <p className="text-[11px] font-black uppercase tracking-[0.32em] text-sky-300">
          SourceTV Submission Studio
        </p>

        <h1 className="mt-4 text-4xl font-semibold tracking-[-0.055em] text-white sm:text-5xl lg:text-6xl">
          Submit a New Project
        </h1>

        <p className="mx-auto mt-5 max-w-2xl text-sm leading-7 text-white/46 sm:text-base">
          Create your SourceTV release exactly as viewers
          could experience it. Upload your media, shape the
          presentation, preview your title, and submit it for
          editorial review.
        </p>

        <div className="mx-auto mt-7 flex max-w-xl items-center gap-3">
          <div className="h-px flex-1 bg-gradient-to-r from-transparent to-white/10" />

         <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-white/70">
  
  <span>Your project remains private until it's approved by the SourceTV team.</span>
</div>

          <div className="h-px flex-1 bg-gradient-to-l from-transparent to-white/10" />
        </div>
      </div>
    </header>
  );
}
