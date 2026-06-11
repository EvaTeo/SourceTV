import Link from "next/link";

export default function PrivacyPage() {
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

          <h1 className="mt-3 text-5xl font-black">Privacy Policy</h1>

          <div className="mt-8 space-y-6 text-sm leading-7 text-white/65">
            <p>
              SourceTV collects account information, viewing activity, saved
              titles, partner submissions, and platform usage data to operate
              and improve the service.
            </p>

            <p>
              We may use this information to provide streaming access, manage
              partner submissions, personalize recommendations, support platform
              security, and improve SourceTV features.
            </p>

            <p>
              SourceTV does not sell personal information. Data may be shared
              with trusted service providers only when needed to operate the
              platform, such as hosting, video delivery, analytics, moderation,
              or legal compliance.
            </p>

            <p>
              Partners submitting content are responsible for ensuring they have
              the rights and permissions needed for the materials they provide.
            </p>

            <p>
              This placeholder policy should be reviewed by a qualified attorney
              before public launch.
            </p>
          </div>
        </section>
      </div>
    </main>
  );
}