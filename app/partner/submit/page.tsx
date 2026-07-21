"use client";

import {
  ChangeEvent,
  DragEvent,
  FormEvent,
  ReactNode,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

type ProjectForm = {
  title: string;
  description: string;
  type: string;
  genre: string;
  year: string;
  maturityRating: string;
  runtime: string;
  creatorName: string;
  creatorCompany: string;
};

type UploadKey =
  | "mainVideoFile"
  | "trailerFile"
  | "thumbnailFile"
  | "backdropFile"
  | "titleLogoFile";

type UploadFiles = Record<UploadKey, File | null>;

type PreviewMode = "main" | "trailer";

const DEFAULT_FORM: ProjectForm = {
  title: "",
  description: "",
  type: "Film",
  genre: "Drama",
  year: "",
  maturityRating: "Not Rated",
  runtime: "",
  creatorName: "",
  creatorCompany: "",
};

const DEFAULT_FILES: UploadFiles = {
  mainVideoFile: null,
  trailerFile: null,
  thumbnailFile: null,
  backdropFile: null,
  titleLogoFile: null,
};

const PROJECT_TYPES = [
  "Film",
  "Short Film",
  "Series",
  "Animation",
  "Documentary",
  "Music Video",
  "Special",
];

const GENRES = [
  "Drama",
  "Comedy",
  "Action",
  "Adventure",
  "Horror",
  "Sci-Fi",
  "Fantasy",
  "Thriller",
  "Romance",
  "Animation",
  "Documentary",
  "Experimental",
  "Family",
  "Crime",
  "Mystery",
];

const MATURITY_RATINGS = [
  "Not Rated",
  "G",
  "PG",
  "PG-13",
  "R",
  "TV-Y",
  "TV-Y7",
  "TV-G",
  "TV-PG",
  "TV-14",
  "TV-MA",
];

const MAX_MAIN_VIDEO_SIZE = 10 * 1024 * 1024 * 1024;
const MAX_TRAILER_SIZE = 3 * 1024 * 1024 * 1024;
const MAX_IMAGE_SIZE = 20 * 1024 * 1024;

export default function SubmitPage() {
  const [checkingAccess, setCheckingAccess] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const [form, setForm] = useState<ProjectForm>(DEFAULT_FORM);
  const [files, setFiles] = useState<UploadFiles>(DEFAULT_FILES);

  const [previewMode, setPreviewMode] =
    useState<PreviewMode>("main");

  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const mainVideoPreview = useObjectUrl(files.mainVideoFile);
  const trailerPreview = useObjectUrl(files.trailerFile);
  const posterPreview = useObjectUrl(files.thumbnailFile);
  const backdropPreview = useObjectUrl(files.backdropFile);
  const titleLogoPreview = useObjectUrl(files.titleLogoFile);

  useEffect(() => {
    const userData = localStorage.getItem("sourcetvUser");

    if (!userData) {
      window.location.href = "/login";
      return;
    }

    try {
      const currentUser = JSON.parse(userData);

      if (
        currentUser.role !== "partner" &&
        currentUser.role !== "admin"
      ) {
        window.location.href = "/partner/apply";
        return;
      }

      setForm((current) => ({
        ...current,
        creatorName: currentUser.name || "",
      }));

      setCheckingAccess(false);
    } catch (error) {
      console.error("PARTNER ACCESS CHECK ERROR:", error);

      localStorage.removeItem("sourcetvUser");
      window.location.href = "/login";
    }
  }, []);

  function updateField(
    name: keyof ProjectForm,
    value: string
  ) {
    clearMessages();

    setForm((current) => ({
      ...current,
      [name]: value,
    }));
  }

  function updateFile(
    name: UploadKey,
    file: File | null
  ) {
    clearMessages();

    if (file) {
      const error = validateFile(name, file);

      if (error) {
        setErrorMessage(error);
        return;
      }
    }

    setFiles((current) => ({
      ...current,
      [name]: file,
    }));

    if (name === "mainVideoFile" && file) {
      setPreviewMode("main");
    }

    if (
      name === "trailerFile" &&
      file &&
      !files.mainVideoFile
    ) {
      setPreviewMode("trailer");
    }
  }

  function clearMessages() {
    setErrorMessage("");
    setSuccessMessage("");
  }

  const requiredComplete = Boolean(
    form.title.trim() &&
      form.description.trim() &&
      form.type &&
      form.genre &&
      files.mainVideoFile
  );

  const readinessItems = useMemo(
    () => [
      {
        label: "Project title",
        complete: Boolean(form.title.trim()),
        required: true,
      },
      {
        label: "Description",
        complete: Boolean(form.description.trim()),
        required: true,
      },
      {
        label: "Main video",
        complete: Boolean(files.mainVideoFile),
        required: true,
      },
      {
        label: "Trailer",
        complete: Boolean(files.trailerFile),
        required: false,
      },
      {
        label: "Poster artwork",
        complete: Boolean(files.thumbnailFile),
        required: false,
      },
      {
        label: "Backdrop artwork",
        complete: Boolean(files.backdropFile),
        required: false,
      },
      {
        label: "Title logo",
        complete: Boolean(files.titleLogoFile),
        required: false,
      },
    ],
    [
      files.backdropFile,
      files.mainVideoFile,
      files.thumbnailFile,
      files.titleLogoFile,
      files.trailerFile,
      form.description,
      form.title,
    ]
  );

  const completedItems = readinessItems.filter(
    (item) => item.complete
  ).length;

  const readinessPercent = Math.round(
    (completedItems / readinessItems.length) * 100
  );

  const activeVideoPreview =
    previewMode === "trailer"
      ? trailerPreview
      : mainVideoPreview;

  const activeVideoFile =
    previewMode === "trailer"
      ? files.trailerFile
      : files.mainVideoFile;

  async function handleSubmit(
    event: FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    if (submitting) {
      return;
    }

    clearMessages();

    if (!form.title.trim()) {
      setErrorMessage("Enter a project title.");
      return;
    }

    if (!form.description.trim()) {
      setErrorMessage("Enter a project description.");
      return;
    }

    if (!files.mainVideoFile) {
      setErrorMessage(
        "Upload the main project video before submitting."
      );
      return;
    }

    const payload = new FormData();

    payload.append("title", form.title.trim());
    payload.append("description", form.description.trim());
    payload.append("type", form.type);
    payload.append("genre", form.genre);
    payload.append("year", form.year.trim());
    payload.append(
      "maturityRating",
      form.maturityRating
    );
    payload.append("runtime", form.runtime.trim());
    payload.append(
      "creatorName",
      form.creatorName.trim()
    );
    payload.append(
      "creatorCompany",
      form.creatorCompany.trim()
    );

    payload.append("revenueShare", "50");

    payload.append(
      "mainVideoFile",
      files.mainVideoFile
    );

    if (files.trailerFile) {
      payload.append(
        "trailerFile",
        files.trailerFile
      );
    }

    if (files.thumbnailFile) {
      payload.append(
        "thumbnailFile",
        files.thumbnailFile
      );
    }

    if (files.backdropFile) {
      payload.append(
        "backdropFile",
        files.backdropFile
      );
    }

    if (files.titleLogoFile) {
      payload.append(
        "titleLogoFile",
        files.titleLogoFile
      );
    }

    try {
      setSubmitting(true);

      const response = await fetch("/api/submit", {
        method: "POST",
        body: payload,
      });

      const text = await response.text();

      let data: {
        error?: string;
        message?: string;
      } | null = null;

      try {
        data = text ? JSON.parse(text) : null;
      } catch {
        data = null;
      }

      if (response.status === 401) {
        window.location.href = "/login";
        return;
      }

      if (response.status === 403) {
        window.location.href = "/partner/apply";
        return;
      }

      if (!response.ok) {
        setErrorMessage(
          data?.message ||
            data?.error ||
            "SourceTV could not upload this project."
        );
        return;
      }

      const creatorName = form.creatorName;
      const creatorCompany = form.creatorCompany;

      setForm({
        ...DEFAULT_FORM,
        creatorName,
        creatorCompany,
      });

      setFiles(DEFAULT_FILES);
      setPreviewMode("main");

      setSuccessMessage(
        "Your project was uploaded successfully and entered the SourceTV review queue."
      );

      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    } catch (error) {
      console.error(
        "PROJECT SUBMISSION ERROR:",
        error
      );

      setErrorMessage(
        "The upload could not be completed. Check your connection and try again."
      );
    } finally {
      setSubmitting(false);
    }
  }

  if (checkingAccess) {
    return (
      <main className="flex min-h-[65vh] items-center justify-center px-6">
        <div className="rounded-3xl border border-white/10 bg-white/[0.035] px-10 py-8 text-center shadow-2xl">
          <div className="mx-auto h-8 w-8 animate-spin rounded-full border-2 border-white/15 border-t-sky-300" />

          <p className="mt-4 text-sm font-medium text-white/45">
            Opening submission studio...
          </p>
        </div>
      </main>
    );
  }

  return (
    <main className="mx-auto w-full max-w-[1540px] space-y-8 pb-16">
      <header className="relative mx-auto max-w-5xl overflow-hidden px-4 pb-4 pt-1 text-center">
        <div className="pointer-events-none absolute left-1/2 top-0 h-44 w-[620px] -translate-x-1/2 rounded-full bg-sky-300/[0.055] blur-[95px]" />

        <div className="relative">
          <p className="text-[11px] font-black uppercase tracking-[0.32em] text-sky-300">
            SourceTV Submission Studio
          </p>

          <h1 className="mt-4 text-4xl font-semibold tracking-[-0.055em] text-white sm:text-5xl lg:text-6xl">
            Submit a New Project
          </h1>

          <p className="mx-auto mt-5 max-w-2xl text-sm leading-7 text-white/46 sm:text-base">
            Create your SourceTV release exactly as viewers
            could experience it. Upload your media, shape the
            presentation, preview your title, and submit it for
            editorial review.
          </p>

          <div className="mx-auto mt-7 flex max-w-xl items-center gap-3">
            <div className="h-px flex-1 bg-gradient-to-r from-transparent to-white/10" />

            <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.18em] text-white/25">
              <span className="h-1.5 w-1.5 rounded-full bg-sky-300" />
              Private until approved
            </div>

            <div className="h-px flex-1 bg-gradient-to-l from-transparent to-white/10" />
          </div>
        </div>
      </header>

      {successMessage && (
        <StatusMessage
          type="success"
          title="Submission received"
          message={successMessage}
        />
      )}

      {errorMessage && (
        <StatusMessage
          type="error"
          title="Submission needs attention"
          message={errorMessage}
        />
      )}

      <form
        onSubmit={handleSubmit}
        className="grid items-start gap-7 xl:grid-cols-[minmax(0,0.78fr)_minmax(480px,1.22fr)]"
      >
        <div className="space-y-6">
          <FormSection
            number="01"
            title="Project Details"
            description="The essential information viewers and the SourceTV review team will see."
          >
            <div className="grid gap-5 sm:grid-cols-2">
              <TextField
                label="Project title"
                value={form.title}
                placeholder="Enter your title"
                required
                onChange={(value) =>
                  updateField("title", value)
                }
              />

              <TextField
                label="Release year"
                type="number"
                value={form.year}
                placeholder="2026"
                min="1888"
                max="2100"
                onChange={(value) =>
                  updateField("year", value)
                }
              />

              <SelectField
                label="Project type"
                value={form.type}
                options={PROJECT_TYPES}
                onChange={(value) =>
                  updateField("type", value)
                }
              />

              <SelectField
                label="Genre"
                value={form.genre}
                options={GENRES}
                onChange={(value) =>
                  updateField("genre", value)
                }
              />

              <SelectField
                label="Maturity rating"
                value={form.maturityRating}
                options={MATURITY_RATINGS}
                onChange={(value) =>
                  updateField(
                    "maturityRating",
                    value
                  )
                }
              />

              <TextField
                label="Runtime"
                value={form.runtime}
                placeholder="Example: 1h 42m"
                onChange={(value) =>
                  updateField("runtime", value)
                }
              />

              <TextField
                label="Creator or representative"
                value={form.creatorName}
                placeholder="Creator name"
                onChange={(value) =>
                  updateField(
                    "creatorName",
                    value
                  )
                }
              />

              <TextField
                label="Company or studio"
                value={form.creatorCompany}
                placeholder="Optional"
                onChange={(value) =>
                  updateField(
                    "creatorCompany",
                    value
                  )
                }
              />
            </div>

            <TextAreaField
              label="Project description"
              value={form.description}
              placeholder="Introduce the story, subject, audience, and tone of your project."
              required
              maxLength={1200}
              onChange={(value) =>
                updateField("description", value)
              }
            />
          </FormSection>

          <FormSection
            number="02"
            title="Video Uploads"
            description="Upload the finished project and an optional trailer. Selected videos can be played in the live preview."
          >
            <div className="space-y-4">
              <FileUpload
                icon="video"
                label="Main project video"
                description="Required. Upload the complete film, episode, special, or program."
                accept="video/*"
                file={files.mainVideoFile}
                required
                large
                buttonLabel="Choose Main Video"
                onFile={(file) =>
                  updateFile(
                    "mainVideoFile",
                    file
                  )
                }
              />

              <FileUpload
                icon="trailer"
                label="Trailer"
                description="Optional. Upload a shorter trailer or promotional preview."
                accept="video/*"
                file={files.trailerFile}
                buttonLabel="Choose Trailer"
                onFile={(file) =>
                  updateFile("trailerFile", file)
                }
              />
            </div>

            <div className="mt-5 rounded-2xl border border-sky-300/15 bg-gradient-to-br from-sky-300/[0.07] to-transparent p-4">
              <div className="flex items-start gap-3">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-sky-300/20 bg-sky-300/[0.08]">
                  <CloudIcon />
                </div>

                <div>
                  <p className="text-xs font-black uppercase tracking-[0.18em] text-sky-300">
                    Bunny Stream processing
                  </p>

                  <p className="mt-2 text-xs leading-5 text-white/43">
                    Videos upload to Bunny Stream when the
                    project is submitted. Keep this page open
                    until SourceTV confirms that the upload is
                    complete.
                  </p>
                </div>
              </div>
            </div>
          </FormSection>

          <FormSection
            number="03"
            title="Artwork"
            description="Add the visual assets used for Browse cards, title pages, and cinematic presentations."
          >
            <div className="grid gap-4 sm:grid-cols-2">
              <FileUpload
                icon="poster"
                label="Poster"
                description="Vertical artwork. A 2:3 ratio works best."
                accept="image/png,image/jpeg,image/webp"
                file={files.thumbnailFile}
                buttonLabel="Choose Poster"
                onFile={(file) =>
                  updateFile(
                    "thumbnailFile",
                    file
                  )
                }
              />

              <FileUpload
                icon="image"
                label="Backdrop"
                description="Wide cinematic artwork. A 16:9 ratio works best."
                accept="image/png,image/jpeg,image/webp"
                file={files.backdropFile}
                buttonLabel="Choose Backdrop"
                onFile={(file) =>
                  updateFile(
                    "backdropFile",
                    file
                  )
                }
              />

              <div className="sm:col-span-2">
                <FileUpload
                  icon="logo"
                  label="Transparent title logo"
                  description="Optional PNG or WebP logo displayed over your backdrop."
                  accept="image/png,image/webp"
                  file={files.titleLogoFile}
                  buttonLabel="Choose Title Logo"
                  onFile={(file) =>
                    updateFile(
                      "titleLogoFile",
                      file
                    )
                  }
                />
              </div>
            </div>
          </FormSection>

          <section className="relative overflow-hidden rounded-[30px] border border-white/10 bg-gradient-to-br from-white/[0.055] to-white/[0.018] p-5 shadow-[0_24px_80px_rgba(0,0,0,0.2)] sm:p-7">
            <div className="pointer-events-none absolute -right-20 -top-24 h-56 w-56 rounded-full bg-sky-300/[0.08] blur-[85px]" />

            <div className="relative flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-[11px] font-black uppercase tracking-[0.23em] text-sky-300">
                  Final submission
                </p>

                <h2 className="mt-3 text-2xl font-semibold tracking-[-0.03em] text-white">
                  Ready to Publish Your Vision
                </h2>

                <p className="mt-3 max-w-xl text-sm leading-6 text-white/44">
                  Your project will remain private while it
                  enters SourceTV&apos;s editorial review.
                  Nothing becomes public until it has been
                  approved.
                </p>
              </div>

              <button
                type="submit"
                disabled={
                  submitting || !requiredComplete
                }
                className="group inline-flex min-h-12 shrink-0 items-center justify-center gap-2 rounded-xl bg-sky-300 px-6 py-3 text-sm font-black text-[#05070d] shadow-[0_16px_45px_rgba(56,189,248,0.2)] transition hover:-translate-y-0.5 hover:bg-sky-200 hover:shadow-[0_20px_55px_rgba(56,189,248,0.28)] disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:translate-y-0"
              >
                {submitting ? (
                  <>
                    <span className="h-4 w-4 animate-spin rounded-full border-2 border-black/20 border-t-black" />
                    Uploading Project...
                  </>
                ) : (
                  <>
                    Submit Project
                    <span
                      aria-hidden="true"
                      className="transition-transform group-hover:translate-x-0.5"
                    >
                      →
                    </span>
                  </>
                )}
              </button>
            </div>
          </section>
        </div>

        <aside className="space-y-6 xl:sticky xl:top-24">
          <section className="overflow-hidden rounded-[32px] border border-white/10 bg-[#080b11] shadow-[0_32px_110px_rgba(0,0,0,0.42)]">
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
                    <span aria-hidden="true">▶</span>
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

          <section className="rounded-[28px] border border-white/10 bg-gradient-to-br from-white/[0.045] to-white/[0.018] p-5 shadow-[0_18px_65px_rgba(0,0,0,0.18)] sm:p-6">
            <div className="flex items-end justify-between gap-5">
              <div>
                <p className="text-[10px] font-black uppercase tracking-[0.22em] text-white/30">
                  Submission Readiness
                </p>

                <p className="mt-2 text-4xl font-semibold tracking-[-0.045em] text-white">
                  {readinessPercent}%
                </p>
              </div>

              <div className="text-right">
                <p className="text-sm font-semibold text-white/52">
                  {completedItems} of{" "}
                  {readinessItems.length}
                </p>

                <p className="mt-1 text-[10px] font-black uppercase tracking-[0.15em] text-white/24">
                  Assets complete
                </p>
              </div>
            </div>

            <div className="mt-5 h-2.5 overflow-hidden rounded-full border border-white/[0.04] bg-black/30 p-[2px]">
              <div
                className="h-full rounded-full bg-gradient-to-r from-sky-400 to-sky-200 shadow-[0_0_18px_rgba(125,211,252,0.4)] transition-all duration-500"
                style={{
                  width: `${readinessPercent}%`,
                }}
              />
            </div>

            <div className="mt-5 grid gap-2 sm:grid-cols-2">
              {readinessItems.map((item) => (
                <div
                  key={item.label}
                  className={`flex items-center justify-between rounded-xl border px-3 py-2.5 transition ${
                    item.complete
                      ? "border-emerald-300/12 bg-emerald-300/[0.025]"
                      : "border-white/[0.07] bg-black/15"
                  }`}
                >
                  <div className="min-w-0">
                    <p className="truncate text-xs font-semibold text-white/48">
                      {item.label}
                    </p>

                    {item.required && (
                      <p className="mt-0.5 text-[9px] font-black uppercase tracking-[0.13em] text-sky-300/70">
                        Required
                      </p>
                    )}
                  </div>

                  <span
                    className={`ml-3 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border text-[10px] ${
                      item.complete
                        ? "border-emerald-300/30 bg-emerald-300/15 text-emerald-200"
                        : "border-white/10 bg-white/[0.025] text-white/18"
                    }`}
                  >
                    {item.complete ? "✓" : "•"}
                  </span>
                </div>
              ))}
            </div>

            <p className="mt-5 text-xs leading-5 text-white/30">
              Title, description, and the main video are
              required. Additional artwork and trailer assets
              improve review and presentation readiness.
            </p>
          </section>
        </aside>
      </form>
    </main>
  );
}

function FormSection({
  number,
  title,
  description,
  children,
}: {
  number: string;
  title: string;
  description: string;
  children: ReactNode;
}) {
  return (
    <section className="rounded-[30px] border border-white/10 bg-gradient-to-br from-white/[0.046] to-white/[0.02] p-5 shadow-[0_22px_75px_rgba(0,0,0,0.18)] sm:p-7">
      <div className="flex items-start gap-4">
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border border-sky-300/20 bg-gradient-to-br from-sky-300/[0.11] to-sky-300/[0.035] text-xs font-black text-sky-300 shadow-[0_12px_30px_rgba(56,189,248,0.08)]">
          {number}
        </div>

        <div>
          <h2 className="text-xl font-semibold tracking-[-0.025em] text-white">
            {title}
          </h2>

          <p className="mt-1 max-w-xl text-sm leading-6 text-white/40">
            {description}
          </p>
        </div>
      </div>

      <div className="mt-7">{children}</div>
    </section>
  );
}

function TextField({
  label,
  value,
  placeholder,
  required = false,
  type = "text",
  min,
  max,
  onChange,
}: {
  label: string;
  value: string;
  placeholder: string;
  required?: boolean;
  type?: string;
  min?: string;
  max?: string;
  onChange: (value: string) => void;
}) {
  return (
    <label className="block">
      <FieldLabel
        label={label}
        required={required}
      />

      <input
        type={type}
        value={value}
        required={required}
        placeholder={placeholder}
        min={min}
        max={max}
        onChange={(event) =>
          onChange(event.target.value)
        }
        className="mt-2 min-h-12 w-full rounded-xl border border-white/10 bg-black/20 px-4 text-sm text-white outline-none transition placeholder:text-white/18 hover:border-white/16 hover:bg-black/25 focus:border-sky-300/55 focus:bg-black/35 focus:shadow-[0_0_0_3px_rgba(125,211,252,0.06)]"
      />
    </label>
  );
}

function SelectField({
  label,
  value,
  options,
  onChange,
}: {
  label: string;
  value: string;
  options: string[];
  onChange: (value: string) => void;
}) {
  return (
    <label className="block">
      <FieldLabel label={label} />

      <select
        value={value}
        onChange={(event) =>
          onChange(event.target.value)
        }
        className="mt-2 min-h-12 w-full rounded-xl border border-white/10 bg-[#080b11] px-4 text-sm text-white outline-none transition hover:border-white/16 focus:border-sky-300/55 focus:shadow-[0_0_0_3px_rgba(125,211,252,0.06)]"
      >
        {options.map((option) => (
          <option
            key={option}
            value={option}
          >
            {option}
          </option>
        ))}
      </select>
    </label>
  );
}

function TextAreaField({
  label,
  value,
  placeholder,
  required = false,
  maxLength,
  onChange,
}: {
  label: string;
  value: string;
  placeholder: string;
  required?: boolean;
  maxLength: number;
  onChange: (value: string) => void;
}) {
  return (
    <label className="mt-5 block">
      <div className="flex items-center justify-between gap-4">
        <FieldLabel
          label={label}
          required={required}
        />

        <span className="text-[10px] font-bold text-white/22">
          {value.length}/{maxLength}
        </span>
      </div>

      <textarea
        value={value}
        required={required}
        maxLength={maxLength}
        rows={6}
        placeholder={placeholder}
        onChange={(event) =>
          onChange(event.target.value)
        }
        className="mt-2 w-full resize-y rounded-xl border border-white/10 bg-black/20 px-4 py-3 text-sm leading-6 text-white outline-none transition placeholder:text-white/18 hover:border-white/16 hover:bg-black/25 focus:border-sky-300/55 focus:bg-black/35 focus:shadow-[0_0_0_3px_rgba(125,211,252,0.06)]"
      />
    </label>
  );
}

function FieldLabel({
  label,
  required = false,
}: {
  label: string;
  required?: boolean;
}) {
  return (
    <span className="text-[11px] font-black uppercase tracking-[0.17em] text-white/38">
      {label}

      {required && (
        <span className="ml-1 text-sky-300">
          *
        </span>
      )}
    </span>
  );
}

function FileUpload({
  icon,
  label,
  description,
  accept,
  file,
  required = false,
  large = false,
  buttonLabel,
  onFile,
}: {
  icon: UploadIconType;
  label: string;
  description: string;
  accept: string;
  file: File | null;
  required?: boolean;
  large?: boolean;
  buttonLabel: string;
  onFile: (file: File | null) => void;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [dragging, setDragging] = useState(false);

  function chooseFile() {
    inputRef.current?.click();
  }

  function handleInput(
    event: ChangeEvent<HTMLInputElement>
  ) {
    const selectedFile =
      event.target.files?.[0] || null;

    onFile(selectedFile);

    event.target.value = "";
  }

  function handleDrop(
    event: DragEvent<HTMLDivElement>
  ) {
    event.preventDefault();
    setDragging(false);

    const selectedFile =
      event.dataTransfer.files?.[0];

    if (selectedFile) {
      onFile(selectedFile);
    }
  }

  return (
    <div
      onDragOver={(event) => {
        event.preventDefault();
        setDragging(true);
      }}
      onDragLeave={() => setDragging(false)}
      onDrop={handleDrop}
      className={`group relative overflow-hidden rounded-2xl border p-4 transition duration-300 sm:p-5 ${
        dragging
          ? "border-sky-300/65 bg-sky-300/[0.085] shadow-[0_0_0_4px_rgba(125,211,252,0.04)]"
          : file
            ? "border-emerald-300/22 bg-gradient-to-br from-emerald-300/[0.055] to-transparent shadow-[0_16px_45px_rgba(0,0,0,0.15)]"
            : "border-white/10 bg-black/15 hover:-translate-y-0.5 hover:border-white/18 hover:bg-black/23 hover:shadow-[0_18px_50px_rgba(0,0,0,0.2)]"
      } ${large ? "min-h-[175px]" : ""}`}
    >
      <div
        className={`pointer-events-none absolute inset-x-0 top-0 h-px transition ${
          file
            ? "bg-gradient-to-r from-transparent via-emerald-300/45 to-transparent"
            : "bg-gradient-to-r from-transparent via-white/10 to-transparent opacity-0 group-hover:opacity-100"
        }`}
      />

      <input
        ref={inputRef}
        type="file"
        accept={accept}
        className="hidden"
        onChange={handleInput}
      />

      <div className="flex h-full flex-col justify-between gap-5">
        <div>
          <div className="flex items-start justify-between gap-4">
            <div className="flex min-w-0 items-start gap-3">
              <div
                className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border transition ${
                  file
                    ? "border-emerald-300/25 bg-emerald-300/10 text-emerald-200"
                    : "border-white/10 bg-white/[0.035] text-white/36 group-hover:border-sky-300/20 group-hover:bg-sky-300/[0.055] group-hover:text-sky-200"
                }`}
              >
                {file ? (
                  <CheckIcon />
                ) : (
                  <UploadTypeIcon type={icon} />
                )}
              </div>

              <div className="min-w-0">
                <FieldLabel
                  label={label}
                  required={required}
                />

                <p className="mt-2 text-xs leading-5 text-white/35">
                  {description}
                </p>
              </div>
            </div>

            <div
              className={`mt-1 h-2.5 w-2.5 shrink-0 rounded-full transition ${
                file
                  ? "bg-emerald-300 shadow-[0_0_14px_rgba(110,231,183,0.55)]"
                  : "bg-white/14"
              }`}
            />
          </div>

          {file && (
            <div className="mt-4 rounded-xl border border-white/[0.07] bg-black/25 px-3 py-3">
              <p className="truncate text-sm font-semibold text-white/72">
                {file.name}
              </p>

              <div className="mt-1.5 flex items-center justify-between gap-3">
                <p className="text-[10px] font-bold uppercase tracking-[0.13em] text-white/28">
                  {formatFileSize(file.size)}
                </p>

                <p className="text-[9px] font-black uppercase tracking-[0.14em] text-emerald-300/75">
                  Ready
                </p>
              </div>
            </div>
          )}
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={chooseFile}
            className="rounded-xl bg-white px-4 py-2.5 text-xs font-black text-black shadow-[0_8px_24px_rgba(255,255,255,0.08)] transition hover:-translate-y-0.5 hover:bg-sky-100"
          >
            {file ? "Replace File" : buttonLabel}
          </button>

          {file && (
            <button
              type="button"
              onClick={() => onFile(null)}
              className="rounded-xl border border-white/10 bg-white/[0.035] px-4 py-2.5 text-xs font-bold text-white/50 transition hover:border-red-300/25 hover:bg-red-300/[0.06] hover:text-red-200"
            >
              Remove
            </button>
          )}

          {!file && (
            <span className="text-[10px] font-semibold text-white/22">
              or drag and drop
            </span>
          )}
        </div>
      </div>
    </div>
  );
}

function PreviewTab({
  active,
  disabled,
  onClick,
  children,
}: {
  active: boolean;
  disabled: boolean;
  onClick: () => void;
  children: ReactNode;
}) {
  return (
    <button
      type="button"
      disabled={disabled}
      onClick={onClick}
      className={`rounded-lg px-3 py-2 text-[10px] font-black uppercase tracking-[0.13em] transition ${
        active
          ? "bg-white text-black shadow-md"
          : "text-white/35 hover:bg-white/[0.04] hover:text-white/70"
      } disabled:cursor-not-allowed disabled:opacity-25`}
    >
      {children}
    </button>
  );
}

function EmptyVideoPreview({
  backdropPreview,
  titleLogoPreview,
  title,
}: {
  backdropPreview: string;
  titleLogoPreview: string;
  title: string;
}) {
  return (
    <div
      className="relative flex h-full w-full items-center justify-center bg-cover bg-center"
      style={{
        backgroundImage: backdropPreview
          ? `url("${backdropPreview}")`
          : "radial-gradient(circle at 70% 20%, rgba(56,189,248,0.2), transparent 34%), linear-gradient(135deg, #111827, #05070d)",
      }}
    >
      <div className="absolute inset-0 bg-black/58" />
      <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-transparent to-black/20" />

      <div className="relative z-10 max-w-sm px-6 text-center">
        {titleLogoPreview ? (
          <img
            src={titleLogoPreview}
            alt=""
            className="mx-auto max-h-16 max-w-[80%] object-contain drop-shadow-[0_10px_30px_rgba(0,0,0,0.7)]"
          />
        ) : (
          <p className="text-2xl font-semibold tracking-[-0.03em] text-white/78">
            {title || "Video Preview"}
          </p>
        )}

        <div className="mx-auto mt-5 flex h-16 w-16 items-center justify-center rounded-full border border-white/20 bg-white/10 text-xl text-white/80 shadow-[0_12px_40px_rgba(0,0,0,0.35)] backdrop-blur-xl">
          ▶
        </div>

        <p className="mt-4 text-xs leading-5 text-white/38">
          Upload the main project video or trailer to preview
          it here before submission.
        </p>
      </div>
    </div>
  );
}

function MediaStatus({
  label,
  ready,
}: {
  label: string;
  ready: boolean;
}) {
  return (
    <div
      className={`rounded-xl border px-3 py-3 ${
        ready
          ? "border-emerald-300/12 bg-emerald-300/[0.025]"
          : "border-white/[0.07] bg-black/15"
      }`}
    >
      <p className="text-[9px] font-black uppercase tracking-[0.14em] text-white/25">
        {label}
      </p>

      <p
        className={`mt-1 text-xs font-semibold ${
          ready
            ? "text-emerald-300"
            : "text-white/32"
        }`}
      >
        {ready ? "Ready" : "Not added"}
      </p>
    </div>
  );
}

function StatusMessage({
  type,
  title,
  message,
}: {
  type: "success" | "error";
  title: string;
  message: string;
}) {
  const success = type === "success";

  return (
    <section
      className={`mx-auto max-w-5xl rounded-2xl border px-5 py-4 shadow-[0_16px_50px_rgba(0,0,0,0.16)] ${
        success
          ? "border-emerald-300/20 bg-emerald-300/[0.07]"
          : "border-red-300/20 bg-red-300/[0.07]"
      }`}
    >
      <p
        className={`text-sm font-semibold ${
          success
            ? "text-emerald-100"
            : "text-red-100"
        }`}
      >
        {title}
      </p>

      <p
        className={`mt-1 text-xs leading-5 ${
          success
            ? "text-emerald-100/55"
            : "text-red-100/55"
        }`}
      >
        {message}
      </p>
    </section>
  );
}

function MetadataDot() {
  return (
    <span
      aria-hidden="true"
      className="h-1 w-1 rounded-full bg-white/35"
    />
  );
}

type UploadIconType =
  | "video"
  | "trailer"
  | "poster"
  | "image"
  | "logo";

function UploadTypeIcon({
  type,
}: {
  type: UploadIconType;
}) {
  if (type === "video" || type === "trailer") {
    return (
      <svg
        aria-hidden="true"
        viewBox="0 0 24 24"
        className="h-5 w-5"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
      >
        <rect
          x="3"
          y="5"
          width="14"
          height="14"
          rx="2.5"
        />
        <path d="m17 10 4-2v8l-4-2" />
        <path d="m9 9 4 3-4 3V9Z" />
      </svg>
    );
  }

  if (type === "logo") {
    return (
      <svg
        aria-hidden="true"
        viewBox="0 0 24 24"
        className="h-5 w-5"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
      >
        <path d="M4 18 9.5 6h5L20 18" />
        <path d="M7 14h10" />
      </svg>
    );
  }

  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      className="h-5 w-5"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
    >
      <rect
        x="3"
        y="4"
        width="18"
        height="16"
        rx="2.5"
      />
      <circle cx="8.5" cy="9" r="1.5" />
      <path d="m4 17 5-5 3.5 3.5 2-2L20 19" />
    </svg>
  );
}

function CloudIcon() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      className="h-5 w-5 text-sky-300"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
    >
      <path d="M7 18a4 4 0 0 1-.8-7.92A6 6 0 0 1 17.7 8.3 4.5 4.5 0 0 1 17.5 18H7Z" />
      <path d="m12 15 0-6" />
      <path d="m9.5 11.5 2.5-2.5 2.5 2.5" />
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      className="h-5 w-5"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <path d="m5 12 4 4L19 6" />
    </svg>
  );
}

function useObjectUrl(file: File | null) {
  const [url, setUrl] = useState("");

  useEffect(() => {
    if (!file) {
      setUrl("");
      return;
    }

    const objectUrl = URL.createObjectURL(file);
    setUrl(objectUrl);

    return () => {
      URL.revokeObjectURL(objectUrl);
    };
  }, [file]);

  return url;
}

function validateFile(
  key: UploadKey,
  file: File
) {
  const videoUpload =
    key === "mainVideoFile" ||
    key === "trailerFile";

  if (videoUpload && !file.type.startsWith("video/")) {
    return "Please choose a valid video file.";
  }

  if (
    !videoUpload &&
    !file.type.startsWith("image/")
  ) {
    return "Please choose a valid image file.";
  }

  if (
    key === "mainVideoFile" &&
    file.size > MAX_MAIN_VIDEO_SIZE
  ) {
    return "The main video is larger than the current 10 GB upload limit.";
  }

  if (
    key === "trailerFile" &&
    file.size > MAX_TRAILER_SIZE
  ) {
    return "The trailer is larger than the current 3 GB upload limit.";
  }

  if (
    !videoUpload &&
    file.size > MAX_IMAGE_SIZE
  ) {
    return "Artwork files must be smaller than 20 MB.";
  }

  return "";
}

function formatFileSize(bytes: number) {
  if (bytes === 0) {
    return "0 bytes";
  }

  const units = ["bytes", "KB", "MB", "GB"];
  const index = Math.floor(
    Math.log(bytes) / Math.log(1024)
  );

  const value =
    bytes / Math.pow(1024, index);

  return `${value.toFixed(index === 0 ? 0 : 1)} ${
    units[index]
  }`;
}