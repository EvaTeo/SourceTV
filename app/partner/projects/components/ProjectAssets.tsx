import type { PartnerProject } from "../types";

import AssetCard from "./AssetCard";

type ProjectAssetsProps = {
  project: PartnerProject;
};

export default function ProjectAssets({
  project,
}: ProjectAssetsProps) {
  const hasArtwork = Boolean(
    project.thumbnailUrl || project.backdropUrl
  );

  const hasVideo = Boolean(
    project.trailerUrl ||
      project.mainVideoUrl ||
      project.videoUrl
  );

  const hasAnyAsset = hasArtwork || hasVideo;

  return (
    <section className="overflow-hidden rounded-2xl border border-white/[0.08] bg-white/[0.025]">
      <div className="border-b border-white/[0.07] px-5 py-4">
        <p className="text-[10px] font-black uppercase tracking-[0.22em] text-sky-300">
          Project Assets
        </p>

        <p className="mt-2 text-sm leading-6 text-white/38">
          Artwork and video files currently attached to this
          title.
        </p>
      </div>

      <div className="space-y-7 p-5">
        {!hasAnyAsset ? (
          <div className="rounded-2xl border border-dashed border-white/10 bg-black/20 p-8 text-center">
            <p className="text-sm font-black text-white/60">
              No project assets available
            </p>

            <p className="mx-auto mt-2 max-w-md text-xs leading-5 text-white/30">
              Artwork and video files will appear here after
              they are attached to the submission.
            </p>
          </div>
        ) : null}

        {hasArtwork ? (
          <div>
            <div className="mb-4">
              <p className="text-[9px] font-black uppercase tracking-[0.2em] text-white/30">
                Artwork
              </p>

              <p className="mt-1 text-xs text-white/25">
                Visual assets used throughout SourceTV.
              </p>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <AssetCard
                title="Poster / Thumbnail"
                url={project.thumbnailUrl}
                type="image"
                aspect="poster"
              />

              <AssetCard
                title="Backdrop"
                url={project.backdropUrl}
                type="image"
                aspect="wide"
              />
            </div>
          </div>
        ) : null}

        {hasArtwork && hasVideo ? (
          <div className="h-px bg-white/[0.07]" />
        ) : null}

        {hasVideo ? (
          <div>
            <div className="mb-4">
              <p className="text-[9px] font-black uppercase tracking-[0.2em] text-white/30">
                Video
              </p>

              <p className="mt-1 text-xs text-white/25">
                Playback assets connected to this project.
              </p>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <AssetCard
                title="Trailer"
                url={project.trailerUrl}
                type="link"
                aspect="wide"
              />

              <AssetCard
                title="Main Video"
                url={
                  project.mainVideoUrl ||
                  project.videoUrl
                }
                type="link"
                aspect="wide"
              />
            </div>
          </div>
        ) : null}
      </div>
    </section>
  );
}