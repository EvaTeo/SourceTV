import Link from "next/link";

export default function DMCAPage() {
  return (
    <main className="min-h-screen bg-black px-6 py-10 text-white">
      <div className="mx-auto max-w-4xl">
        <Link href="/" className="text-sm font-bold text-sky-300">
          ← Back to SourceTV
        </Link>

        <section className="mt-8 rounded-[2rem] border border-white/10 bg-white/[0.04] p-8">
          <p className="text-sm font-black uppercase tracking-[0.35em] text-sky-300">
            SourceTV Legal
          </p>

          <h1 className="mt-3 text-5xl font-black">
            DMCA & Copyright Policy
          </h1>

          <div className="mt-8 space-y-6 text-sm leading-7 text-white/65">
            <p>
              SourceTV respects intellectual property rights and expects all
              users and partners to do the same.
            </p>

            <p>
              If you believe content available through SourceTV infringes your
              copyright, you may submit a DMCA takedown request.
            </p>

            <p>
              A valid notice should include:
            </p>

            <ul className="list-disc space-y-2 pl-6">
              <li>Your contact information</li>
              <li>Identification of the copyrighted work</li>
              <li>The location of the allegedly infringing material</li>
              <li>A statement of good-faith belief</li>
              <li>A statement made under penalty of perjury</li>
              <li>Your physical or electronic signature</li>
            </ul>

            <p>
              SourceTV may remove or disable access to content while claims are
              reviewed.
            </p>

            <p>
              Repeated copyright violations may result in account suspension,
              content removal, partner termination, or legal action.
            </p>

            <div className="rounded-2xl border border-sky-300/20 bg-sky-400/10 p-5">
              <p className="font-bold text-sky-200">
                DMCA Contact
              </p>

              <p className="mt-2">
                copyright@sourcetv.com
              </p>

              <p className="mt-2 text-white/50">
                Replace with your actual copyright contact before launch.
              </p>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}