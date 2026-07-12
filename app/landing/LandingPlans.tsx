import Link from "next/link";

const freeBenefits = [
  "Watch SourceTV for free",
  "Create and manage viewing profiles",
  "Save titles to My List",
  "Continue watching across sessions",
  "Personalized recommendations",
  "Supported by advertising",
];

const premiumBenefits = [
  "Everything included with Free",
  "Skippable advertising",
  "Early access to select premieres",
  "Premium collections and features",
  "Enhanced playback options",
  "Support SourceTV’s growing library",
];

function CheckIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      className="h-4 w-4 shrink-0 stroke-[2.2]"
      aria-hidden="true"
    >
      <path
        d="m5 12.5 4.2 4.2L19 7"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function PlanCard({
  name,
  price,
  priceSuffix,
  description,
  benefits,
  href,
  buttonLabel,
  premium = false,
}: {
  name: string;
  price: string;
  priceSuffix?: string;
  description: string;
  benefits: string[];
  href: string;
  buttonLabel: string;
  premium?: boolean;
}) {
  return (
    <article
      className={`relative overflow-hidden rounded-[1.7rem] border p-6 shadow-[0_28px_90px_rgba(0,0,0,0.4)] md:p-8 ${
        premium
          ? "border-sky-300/24 bg-gradient-to-br from-sky-400/[0.1] via-white/[0.035] to-black"
          : "border-white/[0.09] bg-white/[0.035]"
      }`}
    >
      {premium && (
        <>
          <div className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-sky-300/14 blur-3xl" />

          <div className="absolute right-5 top-5 rounded-full border border-sky-300/25 bg-sky-300/[0.1] px-3 py-1 text-[9px] font-black uppercase tracking-[0.15em] text-sky-200">
            Optional Upgrade
          </div>
        </>
      )}

      <div className="relative">
        <p className="text-[10px] font-black uppercase tracking-[0.3em] text-sky-300/80">
          {name}
        </p>

        <div className="mt-5 flex items-end gap-2">
          <p className="text-5xl font-black tracking-[-0.055em] text-white md:text-6xl">
            {price}
          </p>

          {priceSuffix && (
            <p className="pb-1.5 text-sm font-bold text-white/38">
              {priceSuffix}
            </p>
          )}
        </div>

        <p className="mt-4 max-w-md text-sm leading-7 text-white/48">
          {description}
        </p>

        <div className="my-7 h-px bg-white/[0.08]" />

        <ul className="space-y-3">
          {benefits.map((benefit) => (
            <li
              key={benefit}
              className="flex items-start gap-3 text-sm leading-6 text-white/68"
            >
              <span
                className={`mt-1 flex h-5 w-5 items-center justify-center rounded-full ${
                  premium
                    ? "bg-sky-300/14 text-sky-200"
                    : "bg-white/[0.07] text-white/60"
                }`}
              >
                <CheckIcon />
              </span>

              <span>{benefit}</span>
            </li>
          ))}
        </ul>

        <Link
          href={href}
          className={`mt-8 inline-flex w-full items-center justify-center rounded-md px-7 py-4 text-sm font-black transition hover:scale-[1.015] ${
            premium
              ? "bg-sky-300 text-black shadow-[0_0_32px_rgba(56,189,248,0.25)] hover:bg-sky-200"
              : "bg-white text-black hover:bg-sky-200"
          }`}
        >
          {buttonLabel}
        </Link>
      </div>
    </article>
  );
}

export default function LandingPlans() {
  return (
    <section className="relative overflow-hidden bg-black px-5 py-20 text-white md:px-12 md:py-28">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_70%_42%,rgba(56,189,248,0.1),transparent_32%),radial-gradient(circle_at_18%_65%,rgba(56,189,248,0.05),transparent_30%)]" />

      <div className="relative mx-auto max-w-6xl">
        <div className="mx-auto max-w-3xl text-center">
          <p className="text-[10px] font-black uppercase tracking-[0.36em] text-sky-300 md:text-xs">
            Choose How You Watch
          </p>

          <h2 className="mt-4 text-4xl font-black leading-[0.94] tracking-[-0.045em] md:text-6xl">
            Start free. Upgrade anytime.
          </h2>

          <p className="mx-auto mt-5 max-w-2xl text-sm leading-7 text-white/45 md:text-base">
            SourceTV remains free to watch. Premium is an
            optional upgrade for viewers who want an enhanced
            experience.
          </p>
        </div>

        <div className="mt-12 grid gap-5 lg:grid-cols-2">
          <PlanCard
            name="Free"
            price="$0"
            description="Create your account and enjoy the complete core SourceTV experience without entering a credit card."
            benefits={freeBenefits}
            href="/signup"
            buttonLabel="Watch Free"
          />

          <PlanCard
            name="Premium"
            price="$8.99"
            priceSuffix="/ month"
            description="Upgrade when you are ready for additional convenience, enhanced features, and fewer interruptions."
            benefits={premiumBenefits}
            href="/account/billing"
            buttonLabel="Explore Premium"
            premium
          />
        </div>
      </div>
    </section>
  );
}