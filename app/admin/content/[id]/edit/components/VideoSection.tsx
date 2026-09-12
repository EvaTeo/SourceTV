import type {
  ContentEditorForm,
  VideoAssetType,
} from "../types";

import EditorSectionHeader from "./EditorSectionHeader";

type VideoSectionProps = {
  form: ContentEditorForm;

  mainVideoFile:
    | File
    | null;

  trailerVideoFile:
    | File
    | null;

  videoUploading: string;

  setMainVideoFile: (
    file: File | null
  ) => void;

  setTrailerVideoFile: (
    file: File | null
  ) => void;

  uploadVideoAsset: (
    type: VideoAssetType
  ) => void;
};

const fileInputClass =
  "mt-4 w-full rounded-2xl border border-white/10 bg-black px-4 py-3 text-sm text-white/70 file:mr-4 file:rounded-full file:border-0 file:bg-white/10 file:px-4 file:py-2 file:text-xs file:font-bold file:text-white/70";

const uploadButtonClass =
  "mt-3 w-full rounded-full border border-white/15 bg-white/[0.04] px-5 py-2.5 text-xs font-black text-white/70 transition hover:border-sky-300/40 hover:bg-white/[0.07] hover:text-sky-200 disabled:cursor-not-allowed disabled:opacity-50";

export default function VideoSection({
  form,

  mainVideoFile,
  trailerVideoFile,

  videoUploading,

  setMainVideoFile,
  setTrailerVideoFile,

  uploadVideoAsset,
}: VideoSectionProps) {
  return (
    <>
      <EditorSectionHeader
        title="Video Assets"
        description="Replace the main title video or trailer."
        bordered
      />

      <VideoUpload
        label="Main Video"
        attachedUrl={
          form.mainVideoUrl ||
          form.videoUrl
        }
        file={mainVideoFile}
        uploading={
          videoUploading ===
          "main"
        }
        buttonLabel="Upload Main Video"
        onFileChange={
          setMainVideoFile
        }
        onUpload={() =>
          uploadVideoAsset("main")
        }
      />

      <VideoUpload
        label="Trailer"
        attachedUrl={
          form.trailerUrl
        }
        file={
          trailerVideoFile
        }
        uploading={
          videoUploading ===
          "trailer"
        }
        buttonLabel="Upload Trailer"
        onFileChange={
          setTrailerVideoFile
        }
        onUpload={() =>
          uploadVideoAsset(
            "trailer"
          )
        }
      />
    </>
  );
}

function VideoUpload({
  label,
  attachedUrl,
  file,
  uploading,
  buttonLabel,
  onFileChange,
  onUpload,
}: {
  label: string;
  attachedUrl?:
    | string
    | null;

  file: File | null;

  uploading: boolean;
  buttonLabel: string;

  onFileChange: (
    file: File | null
  ) => void;

  onUpload: () => void;
}) {
  return (
    <div>
      <label className="block text-sm font-bold text-white/60">
        {label}
      </label>

      <div className="mt-2 rounded-2xl border border-white/10 bg-black/25 p-4">
        <p className="text-xs font-bold text-white/45">
          {attachedUrl
            ? `${label} attached`
            : `No ${label.toLowerCase()} attached`}
        </p>

        {attachedUrl && (
          <p className="mt-2 break-all text-[10px] text-white/25">
            {attachedUrl}
          </p>
        )}
      </div>

      <input
        type="file"
        accept="video/*"
        onChange={(event) =>
          onFileChange(
            event.target
              .files?.[0] ||
              null
          )
        }
        className={fileInputClass}
      />

      <button
        type="button"
        disabled={
          !file || uploading
        }
        onClick={onUpload}
        className={
          uploadButtonClass
        }
      >
        {uploading
          ? "Uploading..."
          : buttonLabel}
      </button>
    </div>
  );
}