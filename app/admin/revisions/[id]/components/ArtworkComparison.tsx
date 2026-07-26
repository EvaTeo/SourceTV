"use client";

import ArtworkLightbox from "@/app/admin/components/lightbox/ArtworkLightbox";
import ArtworkThumbnail from "@/app/admin/components/lightbox/ArtworkThumbnail";
import useArtworkLightbox, {
  type ArtworkItem as LightboxArtworkItem,
} from "@/app/admin/components/lightbox/useArtworkLightbox";

type ArtworkComparisonItem = {
  label: string;
  live: string | null;
  proposed: string | null;
};

type ArtworkComparisonProps = {
  artwork: ArtworkComparisonItem[];
};

type ArtworkCardProps = {
  title: string;
  image: string | null;
  changed?: boolean;
  onInspect?: () => void;
};

function ArtworkCard({
  title,
  image,
  changed = false,
  onInspect,
}: ArtworkCardProps) {
  return (
    <div
      className={
        changed
          ? "rounded-2xl border border-sky-300/25 bg-sky-300/[0.05] p-4"
          : "rounded-2xl border border-white/10 bg-white/[0.03] p-4"
      }
    >
      <p
        className={
          changed
            ? "text-xs font-black uppercase tracking-[0.15em] text-sky-200"
            : "text-xs font-black uppercase tracking-[0.15em] text-white/35"
        }
      >
        {title}
      </p>

      <div className="mt-4">
        <ArtworkThumbnail
          src={image}
          title={title}
          onClick={image ? onInspect : undefined}
        />
      </div>
    </div>
  );
}

export default function ArtworkComparison({
  artwork,
}: ArtworkComparisonProps) {
  const lightboxItems: LightboxArtworkItem[] = artwork.flatMap((item) => {
    const items: LightboxArtworkItem[] = [];

    if (item.live) {
      items.push({
        id: `${item.label}-live`,
        title: `${item.label} — Live Project`,
        image: item.live,
      });
    }

    if (item.proposed) {
      items.push({
        id: `${item.label}-proposed`,
        title: `${item.label} — Proposed Revision`,
        image: item.proposed,
      });
    }

    return items;
  });

  const lightbox = useArtworkLightbox(lightboxItems);

  function openArtwork(id: string) {
    const index = lightboxItems.findIndex((item) => item.id === id);

    if (index >= 0) {
      lightbox.open(index);
    }
  }

  return (
    <>
      <section className="rounded-3xl border border-white/10 bg-white/[0.03] p-7">
        <div className="mb-8">
          <p className="text-xs font-black uppercase tracking-[0.18em] text-sky-300">
            Artwork Comparison
          </p>

          <h2 className="mt-2 text-2xl font-black text-white">
            Visual Changes
          </h2>

          <p className="mt-2 text-sm text-white/45">
            Compare the current SourceTV artwork with the partner&apos;s
            proposed revision. Select any available image to inspect it
            fullscreen.
          </p>
        </div>

        {artwork.length > 0 ? (
          <div className="space-y-10">
            {artwork.map((item) => {
              const changed = item.live !== item.proposed;

              return (
                <div key={item.label}>
                  <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
                    <h3 className="text-lg font-black text-white">
                      {item.label}
                    </h3>

                    {changed ? (
                      <span className="rounded-full border border-sky-300/20 bg-sky-300/10 px-3 py-1 text-[10px] font-black uppercase tracking-[0.15em] text-sky-200">
                        Updated
                      </span>
                    ) : (
                      <span className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 text-[10px] font-black uppercase tracking-[0.15em] text-white/35">
                        Unchanged
                      </span>
                    )}
                  </div>

                  <div className="grid gap-6 lg:grid-cols-2">
                    <ArtworkCard
                      title="Live Project"
                      image={item.live}
                      onInspect={() =>
                        openArtwork(`${item.label}-live`)
                      }
                    />

                    <ArtworkCard
                      title="Proposed Revision"
                      image={item.proposed}
                      changed={changed}
                      onInspect={() =>
                        openArtwork(`${item.label}-proposed`)
                      }
                    />
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="rounded-2xl border border-dashed border-white/10 bg-black/20 px-6 py-12 text-center">
            <p className="text-sm font-bold text-white/40">
              This revision does not contain artwork changes.
            </p>
          </div>
        )}
      </section>

      <ArtworkLightbox
        item={lightbox.activeItem}
        open={lightbox.activeIndex !== null}
        onClose={lightbox.close}
        onPrevious={lightbox.previous}
        onNext={lightbox.next}
      />
    </>
  );
}