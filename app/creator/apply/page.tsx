import Link from "next/link";

export default function CreatorApplyPage() {
  return (
    <main className="min-h-screen bg-black px-6 py-10 text-white">
      <div className="mx-auto max-w-5xl">
        <Link href="/" className="text-2xl font-black">
          Source<span className="text-sky-400">TV</span>
        </Link>

        <section className="mt-14 grid gap-10 md:grid-cols-[1fr_420px] md:items-start">
          <div>
            <p className="mb-4 text-sm font-bold uppercase tracking-[0.35em] text-sky-300">
              Creator Access
            </p>

            <h1 className="text-5xl font-black leading-tight md:text-7xl">
              Apply to publish on SourceTV.
            </h1>

            <p className="mt-6 text-lg leading-8 text-white/65">
              SourceTV is curated. That means creators, directors, animators,
              and studios can submit projects, but content must be approved
              before it appears on the platform.
            </p>

            <div className="mt-8 grid gap-4 md:grid-cols-3">
              {["Apply", "Submit Project", "Admin Review"].map((step) => (
                <div key={step} className="rounded-3xl border border-white/10 bg-white/[0.04] p-5">
                  <h3 className="font-black text-sky-300">{step}</h3>
                  <p className="mt-2 text-sm text-white/55">
                    {step === "Apply"
                      ? "Tell us who you are."
                      : step === "Submit Project"
                      ? "Send the title, genre, poster, and video link."
                      : "Approved projects go live."}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <form className="rounded-[2rem] border border-sky-300/20 bg-white/[0.04] p-6 shadow-[0_0_45px_rgba(14,165,233,0.16)]">
            <h2 className="text-2xl font-black">Creator Application</h2>

            <label className="mt-6 block text-sm font-bold text-white/70">
              Creator / Studio Name
            </label>
            <input
              className="mt-2 w-full rounded-2xl border border-white/10 bg-black px-4 py-3 outline-none focus:border-sky-300"
              placeholder="Example: Source Star Films"
            />

            <label className="mt-5 block text-sm font-bold text-white/70">
              Email
            </label>
            <input
              className="mt-2 w-full rounded-2xl border border-white/10 bg-black px-4 py-3 outline-none focus:border-sky-300"
              placeholder="creator@email.com"
            />

            <label className="mt-5 block text-sm font-bold text-white/70">
              What do you create?
            </label>
            <select className="mt-2 w-full rounded-2xl border border-white/10 bg-black px-4 py-3 outline-none focus:border-sky-300">
              <option>Films</option>
              <option>Short Films</option>
              <option>Series</option>
              <option>Animation</option>
              <option>Documentaries</option>
              <option>Mixed Projects</option>
            </select>

            <label className="mt-5 block text-sm font-bold text-white/70">
              Why should your work be on SourceTV?
            </label>
            <textarea
              className="mt-2 min-h-32 w-full rounded-2xl border border-white/10 bg-black px-4 py-3 outline-none focus:border-sky-300"
              placeholder="Tell us about your creative work..."
            />

            <Link
              href="/creator/submit"
              className="mt-6 block rounded-full bg-sky-400 px-6 py-3 text-center font-black text-black shadow-[0_0_30px_rgba(56,189,248,0.45)]"
            >
              Continue to Project Submission
            </Link>

            <p className="mt-4 text-xs leading-5 text-white/40">
              For now this is frontend only. Later we connect it to the database and admin approvals.
            </p>
          </form>
        </section>
      </div>
    </main>
  );
}