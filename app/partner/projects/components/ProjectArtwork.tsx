import ArtworkPlaceholder from "./ArtworkPlaceholder";

import type { PartnerProject } from "../types";

type ProjectArtworkProps = {
  project: PartnerProject;
};

export default function ProjectArtwork({
  project,
}: ProjectArtworkProps) {
  return (
    <div className="grid grid-cols-[88px_minmax(0,1fr)] gap-3 lg:block">
      <div className="aspect-[2/3] overflow-hidden rounded-xl border border-white/10 bg-[#070a10] lg:hidden">
        {project.thumbnailUrl ? (
          <img
            src={project.thumbnailUrl}
            alt={`${project.title} poster`}
            className="h-full w-full object-cover"
          />
        ) : (
          <ArtworkPlaceholder label="Poster" />
        )}
      </div>

      <div className="relative aspect-video overflow-hidden rounded-xl border border-white/10 bg-[#070a10]">
        {project.backdropUrl ||
        project.thumbnailUrl ? (
          <img
            src={
              project.backdropUrl ||
              project.thumbnailUrl ||
              ""
            }
            alt={`${project.title} artwork`}
            className="h-full w-full object-cover transition duration-500 group-hover:scale-[1.025]"
          />
        ) : (
          <ArtworkPlaceholder label="Project Artwork" />
        )}

        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/5 to-transparent" />

        <div className="absolute bottom-3 left-3 hidden lg:block">
          <div className="w-14 overflow-hidden rounded-lg border border-white/10 bg-black/50 shadow-2xl">
            <div className="aspect-[2/3]">
              {project.thumbnailUrl ? (
                <img
                  src={project.thumbnailUrl}
                  alt={`${project.title} poster thumbnail`}
                  className="h-full w-full object-cover"
                />
              ) : (
                <ArtworkPlaceholder
                  label="Poster"
                  compact
                />
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}