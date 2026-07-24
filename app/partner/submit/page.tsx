"use client";

import AccessLoading from "./components/AccessLoading";
import ArtworkSection from "./components/ArtworkSection";
import LiveProjectPreview from "./components/LiveProjectPreview";
import ProjectDetailsSection from "./components/ProjectDetailsSection";
import StatusMessage from "./components/StatusMessage";
import SubmissionHeader from "./components/SubmissionHeader";
import SubmissionNavigator from "./components/SubmissionNavigator";
import SubmissionReadiness from "./components/SubmissionReadiness";
import SubmitSection from "./components/SubmitSection";
import VideoUploadsSection from "./components/VideoUploadsSection";

import useProjectSubmission from "./hooks/useProjectSubmission";
import useSubmissionNavigator from "./hooks/useSubmissionNavigator";

export default function SubmitPage() {
  const submission =
    useProjectSubmission();

  const navigator =
    useSubmissionNavigator(
      submission.checkingAccess
    );

  if (submission.checkingAccess) {
    return <AccessLoading />;
  }

  return (
    <main className="mx-auto w-full max-w-[1540px] space-y-8 pb-16">
      <SubmissionHeader />

      <SubmissionNavigator
        activeSection={
          navigator.activeSection
        }
        onSelect={
          navigator.selectSection
        }
      />

      {submission.successMessage && (
        <StatusMessage
          type="success"
          title="Submission received"
          message={
            submission.successMessage
          }
        />
      )}

      {submission.errorMessage && (
        <StatusMessage
          type="error"
          title="Submission needs attention"
          message={
            submission.errorMessage
          }
        />
      )}

      <form
        onSubmit={
          submission.handleSubmit
        }
        className="grid items-start gap-7 xl:grid-cols-[minmax(0,0.78fr)_minmax(480px,1.22fr)]"
      >
        <div className="space-y-6">
          <ProjectDetailsSection
            form={submission.form}
            updateField={
              submission.updateField
            }
          />

          <VideoUploadsSection
            files={submission.files}
            updateFile={
              submission.updateFile
            }
          />

          <ArtworkSection
            files={submission.files}
            updateFile={
              submission.updateFile
            }
          />

          <SubmitSection
            submitting={
              submission.submitting
            }
            requiredComplete={
              submission.requiredComplete
            }
          />
        </div>

        <aside className="space-y-6 xl:sticky xl:top-24">
          <LiveProjectPreview
            form={submission.form}
            files={submission.files}
            previewMode={
              submission.previewMode
            }
            activeVideoPreview={
              submission.activeVideoPreview
            }
            activeVideoFile={
              submission.activeVideoFile
            }
            posterPreview={
              submission.posterPreview
            }
            backdropPreview={
              submission.backdropPreview
            }
            titleLogoPreview={
              submission.titleLogoPreview
            }
            setPreviewMode={
              submission.setPreviewMode
            }
          />

          <SubmissionReadiness
            readinessItems={
              submission.readinessItems
            }
            completedItems={
              submission.completedItems
            }
            readinessPercent={
              submission.readinessPercent
            }
          />
        </aside>
      </form>
    </main>
  );
}