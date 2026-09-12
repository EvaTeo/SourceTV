import type {
  ArtworkAssetType,
  ContentEditorForm,
} from "../types";

import EditorSectionHeader from "./EditorSectionHeader";

type ArtworkSectionProps = {
  form: ContentEditorForm;

  posterFile: File | null;
  backdropFile: File | null;
  cardArtFile: File | null;
  titleLogoFile: File | null;

  assetUploading: string;

  setPosterFile: (
    file: File | null
  ) => void;

  setBackdropFile: (
    file: File | null
  ) => void;

  setCardArtFile: (
    file: File | null
  ) => void;

  setTitleLogoFile: (
    file: File | null
  ) => void;

  uploadAsset: (
    type: ArtworkAssetType
  ) => void;
};

const fileInputClass =
  "mt-4 w-full rounded-2xl border border-white/10 bg-black px-4 py-3 text-sm text-white/70 file:mr-4 file:rounded-full file:border-0 file:bg-white/10 file:px-4 file:py-2 file:text-xs file:font-bold file:text-white/70";

const uploadButtonClass =
  "mt-3 w-full rounded-full border border-white/15 bg-white/[0.04] px-5 py-2.5 text-xs font-black text-white/70 transition hover:border-sky-300/40 hover:bg-white/[0.07] hover:text-sky-200 disabled:cursor-not-allowed disabled:opacity-50";

export default function ArtworkSection({
  form,

  posterFile,
  backdropFile,
  cardArtFile,
  titleLogoFile,

  assetUploading,

  setPosterFile,
  setBackdropFile,
  setCardArtFile,
  setTitleLogoFile,

  uploadAsset,
}: ArtworkSectionProps) {
  return (
    <>
      <EditorSectionHeader
        title="Artwork"
        description="Replace title artwork without touching the rest of the metadata."
        bordered
      />

      <ArtworkUpload
        label="Poster"
        imageUrl={form.thumbnailUrl}
        imageAlt="Poster"
        emptyText="No Poster Uploaded"
        previewClassName="aspect-[2/3] w-full object-cover"
        file={posterFile}
        accept="image/*"
        uploading={
          assetUploading ===
          "poster"
        }
        buttonLabel="Upload Poster"
        onFileChange={
          setPosterFile
        }
        onUpload={() =>
          uploadAsset("poster")
        }
      />

      <ArtworkUpload
        label="Backdrop"
        imageUrl={form.backdropUrl}
        imageAlt="Backdrop"
        emptyText="No Backdrop Uploaded"
        previewClassName="aspect-video w-full object-cover"
        file={backdropFile}
        accept="image/*"
        uploading={
          assetUploading ===
          "backdrop"
        }
        buttonLabel="Upload Backdrop"
        onFileChange={
          setBackdropFile
        }
        onUpload={() =>
          uploadAsset("backdrop")
        }
      />

      <ArtworkUpload
        label="Card Art"
        imageUrl={form.cardArtUrl}
        imageAlt="Card Artwork"
        emptyText="No Card Artwork Uploaded"
        previewClassName="aspect-video w-full object-cover"
        file={cardArtFile}
        accept="image/*"
        uploading={
          assetUploading ===
          "cardArt"
        }
        buttonLabel="Upload Card Art"
        helper="Horizontal artwork for Continue Watching and resume rows."
        onFileChange={
          setCardArtFile
        }
        onUpload={() =>
          uploadAsset("cardArt")
        }
      />

      <ArtworkUpload
        label="Title Logo"
        imageUrl={form.titleLogoUrl}
        imageAlt="Title Artwork"
        emptyText="No Title Artwork Uploaded"
        previewClassName="max-h-40 w-auto object-contain"
        file={titleLogoFile}
        accept="image/png,image/webp,image/svg+xml"
        uploading={
          assetUploading ===
          "titleLogo"
        }
        buttonLabel="Upload Title Logo"
        helper="Transparent artwork is recommended for hero presentation."
        contain
        onFileChange={
          setTitleLogoFile
        }
        onUpload={() =>
          uploadAsset(
            "titleLogo"
          )
        }
      />
    </>
  );
}

function ArtworkUpload({
  label,
  imageUrl,
  imageAlt,
  emptyText,
  previewClassName,
  file,
  accept,
  uploading,
  buttonLabel,
  helper,
  contain = false,
  onFileChange,
  onUpload,
}: {
  label: string;
  imageUrl?: string | null;
  imageAlt: string;
  emptyText: string;
  previewClassName: string;
  file: File | null;
  accept: string;
  uploading: boolean;
  buttonLabel: string;
  helper?: string;
  contain?: boolean;

  onFileChange: (
    file: File | null
  ) => void;

  onUpload: () => void;
}) {
  return (
    <div>
      <p className="mb-3 text-sm font-bold text-white/60">
        {label}
      </p>

      <div
        className={
          contain
            ? "flex min-h-[220px] items-center justify-center rounded-3xl border border-white/10 bg-black p-8"
            : "overflow-hidden rounded-3xl border border-white/10 bg-black"
        }
      >
        {imageUrl ? (
          <img
            src={imageUrl}
            alt={imageAlt}
            className={
              previewClassName
            }
          />
        ) : (
          <div
            className={
              contain
                ? "text-white/30"
                : "flex h-[220px] items-center justify-center text-white/30"
            }
          >
            {emptyText}
          </div>
        )}
      </div>

      <input
        type="file"
        accept={accept}
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

      {helper && (
        <p className="mt-2 text-xs text-white/40">
          {helper}
        </p>
      )}
    </div>
  );
}