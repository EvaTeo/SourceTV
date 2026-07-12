import ExperienceAccordion from "./ExperienceAccordion";

export default function ExperienceSection() {
  return (
    <section className="relative overflow-hidden bg-black px-5 pb-28 pt-12 text-white md:px-12 md:pb-32 md:pt-20">
      <div className="pointer-events-none absolute left-[-20%] top-[5%] h-[520px] w-[620px] rounded-full bg-sky-300/[0.05] blur-[130px]" />

      <div className="relative mx-auto max-w-5xl">
        <div className="mb-10 max-w-3xl md:mb-14">
          <h2 className="text-4xl font-black leading-[0.94] tracking-[-0.05em] md:text-6xl">
            Everything you expect from streaming.
          </h2>

          <p className="mt-5 max-w-2xl text-sm leading-7 text-white/46 md:text-base">
            Personal profiles, saved titles, effortless discovery,
            and your place remembered.
          </p>
        </div>

        <ExperienceAccordion />
      </div>
    </section>
  );
}