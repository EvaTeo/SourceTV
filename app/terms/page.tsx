import Link from "next/link";

export default function TermsPage() {
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

          <h1 className="mt-3 text-5xl font-black">Terms of Service</h1>

          <div className="mt-8 space-y-6 text-sm leading-7 text-white/65">
            <p>
              By accessing or using SourceTV, you agree to comply with these
              Terms of Service and all applicable laws and regulations.
            </p>

            <p>
              Users may not upload, distribute, or promote content they do not
              own or have authorization to distribute.
            </p>

            <p>
              SourceTV reserves the right to review, reject, remove, suspend,
              or restrict content and accounts that violate platform policies.
            </p>

            <p>
              Partner submissions may undergo editorial, metadata, content,
              rights, and compliance review before publication.
            </p>

            <p>
              SourceTV may modify, suspend, or discontinue portions of the
              service at any time without prior notice.
            </p>

            <p>
              Revenue participation programs, advertising arrangements, and
              partner compensation structures may be modified according to
              platform policies and agreements.
            </p>

            <p>
              These terms are a preliminary version and should be reviewed by
              legal counsel before public launch.
            </p>
          </div>
        </section>
      </div>
    </main>
  );
}