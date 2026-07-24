import type {
  UploadFiles,
  UploadKey,
} from "../types";

import FileUpload from "./FileUpload";
import FormSection from "./FormSection";
import { CloudIcon } from "./Icons";

export default function VideoUploadsSection({
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
      id="video-uploads"
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
              Videos upload to Bunny Stream when the project
              is submitted. Keep this page open until
              SourceTV confirms that the upload is complete.
            </p>
          </div>
        </div>
      </div>
    </FormSection>
  );
}
