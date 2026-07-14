import Link from "next/link";
import { prisma } from "@/app/lib/prisma";
import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";

export default async function MaintenancePage() {
  const settings =
    await prisma.platformSettings.findFirst({
      select: {
        platformName: true,
        tagline: true,
        maintenanceMode: true,
        supportEmail: true,
      },
    });

  if (!settings?.maintenanceMode) {
    redirect("/");
  }

  const platformName =
    settings.platformName || "SourceTV";

  const logoEndsWithTV =
    platformName
      .toLowerCase()
      .endsWith("tv");

  const logoMain = logoEndsWithTV
    ? platformName.slice(0, -2)
    : platformName;

  const logoAccent = logoEndsWithTV
    ? platformName.slice(-2)
    : "";

  return (
    <main className="fixed inset-0 z-[100] flex min-h-screen items-center justify-center overflow-hidden bg-[#02040a] px-6 text-white">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_38%,rgba(56,189,248,0.16),transparent_30%),radial-gradient(circle_at_15%_85%,rgba(14,165,233,0.08),transparent_30%),linear-gradient(to_bottom,#02040a,#000)]" />

      <div className="pointer-events-none absolute left-1/2 top-1/2 h-[520px] w-[520px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-sky-300/10 shadow-[0_0_160px_rgba(56,189,248,0.12)]" />

      <section className="relative z-10 mx-auto max-w-2xl text-center">
        <Link
          href="/login"
          aria-label={`${platformName} administrator login`}
          className="inline-flex items-baseline text-3xl font-black tracking-[-0.05em] md:text-4xl"
        >
          {logoMain}

          {logoAccent && (
            <span className="text-sky-400">
              {logoAccent}
            </span>
          )}
        </Link>

        <p className="mt-12 text-[10px] font-black uppercase tracking-[0.4em] text-sky-300 md:text-xs">
          Scheduled Maintenance
        </p>

        <h1 className="mt-5 text-4xl font-black leading-[0.95] tracking-[-0.045em] md:text-7xl">
          We’ll be back shortly.
        </h1>

        <p className="mx-auto mt-7 max-w-xl text-base leading-8 text-white/55 md:text-lg">
          We’re currently improving the{" "}
          {platformName} experience. Thank
          you for your patience while we
          complete this update.
        </p>

        {settings.tagline && (
          <p className="mt-5 text-sm font-semibold text-white/30">
            {settings.tagline}
          </p>
        )}

        <div className="mx-auto mt-10 h-px w-24 bg-gradient-to-r from-transparent via-sky-300/60 to-transparent" />

        <p className="mt-8 text-xs text-white/30">
          Need assistance?{" "}
          <a
            href={`mailto:${
              settings.supportEmail ||
              "support@sourcetv.com"
            }`}
            className="font-semibold text-sky-300 transition hover:text-sky-200"
          >
            {settings.supportEmail ||
              "support@sourcetv.com"}
          </a>
        </p>
      </section>
    </main>
  );
}