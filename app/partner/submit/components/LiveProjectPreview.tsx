import type {
  PreviewMode,
  ProjectForm,
  UploadFiles,
} from "../types";

import { MetadataDot } from "./Icons";

import {
  EmptyVideoPreview,
  MediaStatus,
  PreviewTab,
} from "./PreviewParts";

export default function LiveProjectPreview({
  form,
  files,
  previewMode,
  activeVideoPreview,
  activeVideoFile,
  posterPreview,
  backdropPreview,
  titleLogoPreview,
  setPreviewMode,
}: {
  form: ProjectForm;
  files: UploadFiles;
  previewMode: PreviewMode;
  activeVideoPreview: string;
  activeVideoFile: File | null;
  posterPreview: string;
  backdropPreview: string;
  titleLogoPreview: string;
  setPreviewMode: (
    mode: PreviewMode
  ) => void;
}) {
  return (
    <section
      id="live-preview"
      className="scroll-mt-32 overflow-hidden rounded-[32px] border border-white/10 bg-[#080b11] shadow-[0_32px_110px_rgba(0,0,0,0.42)]"
    >
      <div className="flex flex-col gap-4 border-b border-white/10 bg-white/[0.018] px-5 py-5 sm:flex-row sm:items-center sm:justify-between sm:px-6">
        <div>
          <p className="text-[10px] font-black uppercase tracking-[0.24em] text-sky-300">
            Live Project Preview
          </p>

          <p className="mt-1 text-xs text-white/35">
            See your release take shape in real time.
          </p>
        </div>

        <div className="inline-flex rounded-xl border border-white/10 bg-black/35 p-1 shadow-inner">
          <PreviewTab
            active={previewMode === "main"}
            disabled={!files.mainVideoFile}
            onClick={() =>
              setPreviewMode("main")
            }
          >
            Main Video
          </PreviewTab>

          <PreviewTab
            active={
              previewMode === "trailer"
            }
            disabled={!files.trailerFile}
            onClick={() =>
              setPreviewMode("trailer")
            }
          >
            Trailer
          </PreviewTab>
        </div>
      </div>

      <div className="p-4 sm:p-5">
        <div className="relative aspect-video overflow-hidden rounded-[22px] border border-white/10 bg-black shadow-[0_24px_70px_rgba(0,0,0,0.38)]">
          {activeVideoPreview ? (
            <video
              key={activeVideoPreview}
              src={activeVideoPreview}
              poster={
                backdropPreview ||
                posterPreview ||
                undefined
              }
              controls
              playsInline
              preload="metadata"
              className="h-full w-full object-contain"
            />
          ) : (
            <EmptyVideoPreview
              backdropPreview={
                backdropPreview
              }
              titleLogoPreview={
                titleLogoPreview
              }
              title={form.title}
            />
          )}

          <div className="pointer-events-none absolute left-4 top-4 rounded-full border border-white/15 bg-black/55 px-3 py-1.5 text-[9px] font-black uppercase tracking-[0.16em] text-white/65 shadow-lg backdrop-blur-xl">
            {activeVideoFile
              ? previewMode === "main"
                ? "Main Video Preview"
                : "Trailer Preview"
              : "Video Preview"}
          </div>
        </div>
      </div>

      <div
        className="relative min-h-[430px] overflow-hidden border-t border-white/10 bg-[#070a0f] bg-cover bg-center"
        style={{
          backgroundImage: backdropPreview
            ? `url("${backdropPreview}")`
            : "radial-gradient(circle at 74% 15%, rgba(56,189,248,0.2), transparent 32%), linear-gradient(135deg, #111827 0%, #070a0f 48%, #030407 100%)",
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-black via-black/64 to-black/5" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#070a0f] via-black/10 to-black/28" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_68%_42%,transparent_0%,rgba(0,0,0,0.15)_45%,rgba(0,0,0,0.62)_100%)]" />

        <div className="relative flex min-h-[430px] max-w-[82%] flex-col justify-end p-6 sm:p-9">
          <div className="inline-flex w-fit items-center gap-2 rounded-full border border-sky-300/18 bg-sky-300/[0.07] px-3 py-1.5 backdrop-blur-xl">
            <span className="h-1.5 w-1.5 rounded-full bg-sky-300 shadow-[0_0_12px_rgba(125,211,252,0.8)]" />

            <p className="text-[9px] font-black uppercase tracking-[0.2em] text-sky-200">
              SourceTV Preview
            </p>
          </div>

          {titleLogoPreview ? (
            <img
              src={titleLogoPreview}
              alt=""
              className="mt-5 max-h-24 max-w-[88%] object-contain object-left drop-shadow-[0_10px_28px_rgba(0,0,0,0.65)]"
            />
          ) : (
            <h2 className="mt-5 text-4xl font-semibold tracking-[-0.055em] text-white sm:text-5xl">
              {form.title ||
                "Your Project Title"}
            </h2>
          )}

          <div className="mt-5 flex flex-wrap items-center gap-2.5 text-[10px] font-bold uppercase tracking-[0.12em] text-white/53">
            <span className="text-sky-300">
              {form.type}
            </span>

            <MetadataDot />

            <span>{form.genre}</span>

            {form.year && (
              <>
                <MetadataDot />
                <span>{form.year}</span>
              </>
            )}

            {form.runtime && (
              <>
                <MetadataDot />
                <span>{form.runtime}</span>
              </>
            )}

            {form.maturityRating !==
              "Not Rated" && (
              <>
                <MetadataDot />

                <span className="rounded border border-white/18 px-1.5 py-0.5 text-[9px]">
                  {form.maturityRating}
                </span>
              </>
            )}
          </div>

          <p className="mt-5 line-clamp-3 max-w-xl text-sm leading-6 text-white/56">
            {form.description ||
              "Your project description will appear here as you complete the submission."}
          </p>

          <div className="mt-6 flex items-center gap-3">
            <div className="flex items-center gap-2 rounded-xl bg-white px-5 py-2.5 text-xs font-black text-black shadow-[0_12px_32px_rgba(255,255,255,0.12)]">
              <span aria-hidden="true">
                ▶
              </span>
              Play
            </div>

            <div className="rounded-xl border border-white/15 bg-white/[0.08] px-5 py-2.5 text-xs font-bold text-white/76 shadow-lg backdrop-blur-xl">
              More Info
            </div>
          </div>
        </div>
      </div>

      <div className="grid gap-5 border-t border-white/10 bg-white/[0.015] p-5 sm:grid-cols-[118px_1fr] sm:p-6">
        <div
          className="aspect-[2/3] overflow-hidden rounded-2xl border border-white/10 bg-[#0c1018] bg-cover bg-center shadow-[0_16px_45px_rgba(0,0,0,0.28)]"
          style={{
            backgroundImage: posterPreview
              ? `url("${posterPreview}")`
              : "linear-gradient(145deg, #172033, #080b11)",
          }}
        >
          {!posterPreview && (
            <div className="flex h-full items-center justify-center px-3 text-center text-[9px] font-black uppercase tracking-[0.16em] text-white/20">
              Poster Preview
            </div>
          )}
        </div>

        <div className="min-w-0">
          <p className="text-[10px] font-black uppercase tracking-[0.2em] text-white/28">
            Browse Presentation
          </p>

          <h3 className="mt-2 truncate text-xl font-semibold tracking-tight text-white">
            {form.title ||
              "Untitled Project"}
          </h3>

          <p className="mt-1 text-xs font-semibold text-white/35">
            {form.creatorCompany ||
              form.creatorName ||
              "SourceTV Partner"}
          </p>

          <div className="mt-5 grid grid-cols-2 gap-2">
            <MediaStatus
              label="Main video"
              ready={Boolean(
                files.mainVideoFile
              )}
            />

            <MediaStatus
              label="Trailer"
              ready={Boolean(
                files.trailerFile
              )}
            />

            <MediaStatus
              label="Poster"
              ready={Boolean(
                files.thumbnailFile
              )}
            />

            <MediaStatus
              label="Backdrop"
              ready={Boolean(
                files.backdropFile
              )}
            />
          </div>
        </div>
      </div>
    </section>
  );
}
