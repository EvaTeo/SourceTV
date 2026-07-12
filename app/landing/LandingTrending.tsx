import ContentRail from "@/app/components/ContentRail";
import type { LandingContentItem } from "./landingTypes";

export default function LandingTrending({
  items,
}: {
  items: LandingContentItem[];
}) {
  if (!items.length) {
    return null;
  }

  return (
    <section className="relative z-20 -mt-20 bg-gradient-to-b from-transparent via-black/92 to-black pb-5 pt-2 md:-mt-28 md:pb-8">
      <ContentRail
        title="Today’s Trending"
        items={items.slice(0, 12)}
      />
    </section>
  );
}