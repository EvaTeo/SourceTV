"use client";

import Link from "next/link";
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
  maturityRating: string;
  runtime: string;
  creatorName: string;
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
  maturityRating: "Not Rated",
  runtime: "",
  creatorName: "",
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

    if (name === "trailerFile" && file && !files.mainVideoFile) {
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

    if (submitting) return;

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
    payload.append(
      "maturityRating",
      form.maturityRating
    );
    payload.append("runtime", form.runtime.trim());
    payload.append(
      "creatorName",
      form.creatorName.trim()
    );

    // The API currently defaults partner submissions to 50.
    // Contract-driven revenue share can replace this later.
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

      setForm({
        ...DEFAULT_FORM,
        creatorName,
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
    <main className="mx-auto w-full max-w-[1540px] space-y-7 pb-16">
      <header className="mx-auto max-w-5xl text-center">
        <Link
          href="/partner"
          className="inline-flex items-center gap-2 text-sm font-semibold text-white/40 transition hover:text-sky-300"
        >
          <span aria-hidden="true">←</span>
          Partner Overview
        </Link>

        <p className="mt-7 text-[11px] font-black uppercase tracking-[0.3em] text-sky-300">
          SourceTV Submission Studio
        </p>

        <h1 className="mt-3 text-4xl font-semibold tracking-[-0.04em] text-white sm:text-5xl lg:text-6xl">
          Submit a New Project
        </h1>

        <p className="mx-auto mt-5 max-w-2xl text-sm leading-7 text-white/45 sm:text-base">
          Build your presentation, upload your media, and
          preview how your title could appear across SourceTV
          before submitting it for review.
        </p>
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
                label="Runtime"
                value={form.runtime}
                placeholder="Example: 1h 42m"
                onChange={(value) =>
                  updateField("runtime", value)
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
                label="Creator or studio"
                value={form.creatorName}
                placeholder="Creator name"
                onChange={(value) =>
                  updateField(
                    "creatorName",
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
            description="Upload the finished project and an optional trailer. Your selected video can be played in the live preview."
          >
            <div className="space-y-4">
              <FileUpload
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

            <div className="mt-5 rounded-2xl border border-sky-300/15 bg-sky-300/[0.055] p-4">
              <p className="text-xs font-black uppercase tracking-[0.18em] text-sky-300">
                Bunny Stream processing
              </p>

              <p className="mt-2 text-xs leading-5 text-white/43">
                Video files upload to Bunny Stream when you
                submit. Large projects may take longer to
                transfer and process. Keep this page open until
                SourceTV confirms the submission.
              </p>
            </div>
          </FormSection>

          <FormSection
            number="03"
            title="Artwork"
            description="Add the visual assets used for Browse cards, title pages, and cinematic presentations."
          >
            <div className="grid gap-4 sm:grid-cols-2">
              <FileUpload
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

          <section className="rounded-[28px] border border-white/10 bg-white/[0.032] p-5 sm:p-6">
            <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-[11px] font-black uppercase tracking-[0.22em] text-sky-300">
                  Final submission
                </p>

                <h2 className="mt-2 text-xl font-semibold tracking-tight text-white">
                  Send to SourceTV Review
                </h2>

                <p className="mt-2 max-w-xl text-sm leading-6 text-white/42">
                  Your project remains private and enters the
                  pending review queue. Submission does not
                  publish it automatically.
                </p>
              </div>

              <button
                type="submit"
                disabled={
                  submitting || !requiredComplete
                }
                className="inline-flex min-h-12 shrink-0 items-center justify-center rounded-xl bg-sky-300 px-6 py-3 text-sm font-black text-[#05070d] shadow-[0_14px_40px_rgba(56,189,248,0.16)] transition hover:bg-sky-200 disabled:cursor-not-allowed disabled:opacity-40"
              >
                {submitting
                  ? "Uploading Project..."
                  : "Submit Project"}
              </button>
            </div>
          </section>
        </div>

        <aside className="space-y-6 xl:sticky xl:top-24">
          <section className="overflow-hidden rounded-[30px] border border-white/10 bg-[#080b11] shadow-[0_28px_90px_rgba(0,0,0,0.34)]">
            <div className="flex flex-col gap-4 border-b border-white/10 px-5 py-5 sm:flex-row sm:items-center sm:justify-between sm:px-6">
              <div>
                <p className="text-[10px] font-black uppercase tracking-[0.23em] text-sky-300">
                  Live Project Preview
                </p>

                <p className="mt-1 text-xs text-white/35">
                  Updates automatically as you build.
                </p>
              </div>

              <div className="inline-flex rounded-xl border border-white/10 bg-black/30 p-1">
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
              <div className="relative aspect-video overflow-hidden rounded-2xl border border-white/10 bg-black">
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

                <div className="pointer-events-none absolute left-4 top-4 rounded-full border border-white/15 bg-black/55 px-3 py-1.5 text-[9px] font-black uppercase tracking-[0.16em] text-white/65 backdrop-blur-xl">
                  {activeVideoFile
                    ? previewMode === "main"
                      ? "Main Video Preview"
                      : "Trailer Preview"
                    : "Video Preview"}
                </div>
              </div>
            </div>

            <div
              className="relative min-h-[360px] overflow-hidden border-t border-white/10 bg-[#070a0f] bg-cover bg-center"
              style={{
                backgroundImage: backdropPreview
                  ? `url("${backdropPreview}")`
                  : "radial-gradient(circle at 72% 18%, rgba(56,189,248,0.18), transparent 32%), linear-gradient(135deg, #111827 0%, #070a0f 48%, #030407 100%)",
              }}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-black/95 via-black/52 to-black/10" />
              <div className="absolute inset-0 bg-gradient-to-t from-[#070a0f] via-transparent to-black/15" />

              <div className="relative flex min-h-[360px] max-w-[76%] flex-col justify-end p-6 sm:p-8">
                <p className="text-[10px] font-black uppercase tracking-[0.22em] text-sky-300">
                  SourceTV Preview
                </p>

                {titleLogoPreview ? (
                  <img
                    src={titleLogoPreview}
                    alt=""
                    className="mt-4 max-h-20 max-w-[85%] object-contain object-left"
                  />
                ) : (
                  <h2 className="mt-3 text-3xl font-semibold tracking-[-0.04em] text-white sm:text-4xl">
                    {form.title ||
                      "Your Project Title"}
                  </h2>
                )}

                <div className="mt-4 flex flex-wrap items-center gap-2 text-[10px] font-bold uppercase tracking-[0.13em] text-white/50">
                  <span className="text-sky-300">
                    {form.type}
                  </span>

                  <span>•</span>
                  <span>{form.genre}</span>

                  {form.runtime && (
                    <>
                      <span>•</span>
                      <span>{form.runtime}</span>
                    </>
                  )}

                  {form.maturityRating !==
                    "Not Rated" && (
                    <>
                      <span>•</span>
                      <span>
                        {form.maturityRating}
                      </span>
                    </>
                  )}
                </div>

                <p className="mt-4 line-clamp-3 max-w-xl text-sm leading-6 text-white/52">
                  {form.description ||
                    "Your project description will appear here as you complete the submission."}
                </p>

                <div className="mt-5 flex items-center gap-3">
                  <div className="rounded-lg bg-white px-4 py-2 text-xs font-black text-black">
                    ▶ Play
                  </div>

                  <div className="rounded-lg border border-white/15 bg-white/[0.07] px-4 py-2 text-xs font-bold text-white/70 backdrop-blur">
                    More Info
                  </div>
                </div>
              </div>
            </div>

            <div className="grid gap-5 border-t border-white/10 p-5 sm:grid-cols-[110px_1fr] sm:p-6">
              <div
                className="aspect-[2/3] overflow-hidden rounded-xl border border-white/10 bg-[#0c1018] bg-cover bg-center"
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

                <h3 className="mt-2 truncate text-lg font-semibold text-white">
                  {form.title ||
                    "Untitled Project"}
                </h3>

                <p className="mt-1 text-xs font-semibold text-white/35">
                  {form.creatorName ||
                    "SourceTV Partner"}
                </p>

                <div className="mt-4 grid grid-cols-2 gap-2">
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

          <section className="rounded-[28px] border border-white/10 bg-white/[0.032] p-5 sm:p-6">
            <div className="flex items-end justify-between gap-5">
              <div>
                <p className="text-[10px] font-black uppercase tracking-[0.22em] text-white/30">
                  Submission Readiness
                </p>

                <p className="mt-2 text-3xl font-semibold tracking-tight text-white">
                  {readinessPercent}%
                </p>
              </div>

              <p className="text-xs font-semibold text-white/35">
                {completedItems}/
                {readinessItems.length} complete
              </p>
            </div>

            <div className="mt-5 h-2 overflow-hidden rounded-full bg-white/8">
              <div
                className="h-full rounded-full bg-sky-300 transition-all duration-500"
                style={{
                  width: `${readinessPercent}%`,
                }}
              />
            </div>

            <div className="mt-5 grid gap-2 sm:grid-cols-2">
              {readinessItems.map((item) => (
                <div
                  key={item.label}
                  className="flex items-center justify-between rounded-xl border border-white/[0.07] bg-black/15 px-3 py-2.5"
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
                    className={`ml-3 h-2.5 w-2.5 shrink-0 rounded-full ${
                      item.complete
                        ? "bg-emerald-300 shadow-[0_0_12px_rgba(110,231,183,0.5)]"
                        : "bg-white/15"
                    }`}
                  />
                </div>
              ))}
            </div>
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
    <section className="rounded-[28px] border border-white/10 bg-white/[0.032] p-5 shadow-[0_20px_70px_rgba(0,0,0,0.16)] sm:p-7">
      <div className="flex items-start gap-4">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-sky-300/20 bg-sky-300/[0.075] text-xs font-black text-sky-300">
          {number}
        </div>

        <div>
          <h2 className="text-xl font-semibold tracking-tight text-white">
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
  onChange,
}: {
  label: string;
  value: string;
  placeholder: string;
  required?: boolean;
  onChange: (value: string) => void;
}) {
  return (
    <label className="block">
      <FieldLabel
        label={label}
        required={required}
      />

      <input
        type="text"
        value={value}
        required={required}
        placeholder={placeholder}
        onChange={(event) =>
          onChange(event.target.value)
        }
        className="mt-2 min-h-12 w-full rounded-xl border border-white/10 bg-black/20 px-4 text-sm text-white outline-none transition placeholder:text-white/18 hover:border-white/15 focus:border-sky-300/55 focus:bg-black/35"
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
        className="mt-2 min-h-12 w-full rounded-xl border border-white/10 bg-[#080b11] px-4 text-sm text-white outline-none transition hover:border-white/15 focus:border-sky-300/55"
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
        className="mt-2 w-full resize-y rounded-xl border border-white/10 bg-black/20 px-4 py-3 text-sm leading-6 text-white outline-none transition placeholder:text-white/18 hover:border-white/15 focus:border-sky-300/55 focus:bg-black/35"
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
  label,
  description,
  accept,
  file,
  required = false,
  large = false,
  buttonLabel,
  onFile,
}: {
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
      className={`rounded-2xl border p-4 transition sm:p-5 ${
        dragging
          ? "border-sky-300/60 bg-sky-300/[0.08]"
          : file
            ? "border-emerald-300/20 bg-emerald-300/[0.035]"
            : "border-white/10 bg-black/15 hover:border-white/16 hover:bg-black/20"
      } ${large ? "min-h-[155px]" : ""}`}
    >
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
            <div>
              <FieldLabel
                label={label}
                required={required}
              />

              <p className="mt-2 text-xs leading-5 text-white/35">
                {description}
              </p>
            </div>

            <div
              className={`mt-1 h-2.5 w-2.5 shrink-0 rounded-full ${
                file
                  ? "bg-emerald-300"
                  : "bg-white/14"
              }`}
            />
          </div>

          {file && (
            <div className="mt-4 rounded-xl border border-white/[0.07] bg-black/20 px-3 py-3">
              <p className="truncate text-sm font-semibold text-white/70">
                {file.name}
              </p>

              <p className="mt-1 text-[10px] font-bold uppercase tracking-[0.13em] text-white/28">
                {formatFileSize(file.size)}
              </p>
            </div>
          )}
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={chooseFile}
            className="rounded-xl bg-white px-4 py-2.5 text-xs font-black text-black transition hover:bg-sky-100"
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
          ? "bg-white text-black"
          : "text-white/35 hover:text-white/70"
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
          : "radial-gradient(circle at 70% 20%, rgba(56,189,248,0.18), transparent 34%), linear-gradient(135deg, #111827, #05070d)",
      }}
    >
      <div className="absolute inset-0 bg-black/55" />

      <div className="relative z-10 max-w-sm px-6 text-center">
        {titleLogoPreview ? (
          <img
            src={titleLogoPreview}
            alt=""
            className="mx-auto max-h-16 max-w-[80%] object-contain"
          />
        ) : (
          <p className="text-2xl font-semibold tracking-tight text-white/75">
            {title || "Video Preview"}
          </p>
        )}

        <div className="mx-auto mt-5 flex h-14 w-14 items-center justify-center rounded-full border border-white/20 bg-white/10 text-lg text-white/75 backdrop-blur-xl">
          ▶
        </div>

        <p className="mt-4 text-xs leading-5 text-white/38">
          Upload the main project video or trailer to
          preview it here before submission.
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
    <div className="rounded-xl border border-white/[0.07] bg-black/15 px-3 py-3">
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
      className={`mx-auto max-w-5xl rounded-2xl border px-5 py-4 ${
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
  if (bytes === 0) return "0 bytes";

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