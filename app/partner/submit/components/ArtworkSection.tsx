import type {
  UploadFiles,
  UploadKey,
} from "../types";

import FileUpload from "./FileUpload";
import FormSection from "./FormSection";

export default function ArtworkSection({
  files,
  updateFile,
}: {
  files: UploadFiles;
  updateFile: (
    name: UploadKey,
    file: File | null
  ) => void;
}) {
  return (
    <FormSection
      id="artwork"
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
  );
}
