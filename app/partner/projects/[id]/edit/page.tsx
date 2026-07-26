"use client";

import Link from "next/link";
import { use } from "react";

import AdminPageHeader from "@/app/components/admin/AdminPageHeader";

import ArtworkSection from "@/app/partner/submit/components/ArtworkSection";
import LiveProjectPreview from "@/app/partner/submit/components/LiveProjectPreview";
import ProjectDetailsSection from "@/app/partner/submit/components/ProjectDetailsSection";
import StatusMessage from "@/app/partner/submit/components/StatusMessage";
import VideoUploadsSection from "@/app/partner/submit/components/VideoUploadsSection";

import useProjectSubmission from "@/app/partner/submit/hooks/useProjectSubmission";

export default function EditProjectPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);

  const submission = useProjectSubmission({
    projectId: id,
  });

  if (
    submission.checkingAccess ||
    submission.loadingProject
  ) {
    return (
      <main className="mx-auto w-full max-w-[1180px] px-5 py-8 sm:px-6 lg:px-8">
        <div className="overflow-hidden rounded-3xl border border-white/10 bg-white/[0.035]">
          <div className="h-px bg-gradient-to-r from-transparent via-sky-300/50 to-transparent" />

          <div className="flex min-h-[320px] items-center justify-center p-10">
            <div className="text-center">
              <div className="mx-auto h-9 w-9 animate-spin rounded-full border-2 border-white/10 border-t-sky-300" />

              <p className="mt-5 text-sm font-semibold text-white/55">
                Loading project details...
              </p>
            </div>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="mx-auto w-full max-w-[1180px] space-y-6 px-5 pb-16 pt-8 sm:px-6 lg:px-8">
      <AdminPageHeader
        eyebrow="Partner Studio"
        title="Propose Project Updates"
        description="Prepare changes to your project and submit them to SourceTV for review."
      />

      <section className="overflow-hidden rounded-3xl border border-sky-300/20 bg-sky-300/[0.055]">
        <div className="h-px bg-gradient-to-r from-transparent via-sky-300/70 to-transparent" />

        <div className="grid gap-5 p-5 sm:p-6 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-center">
          <div>
            <p className="text-[10px] font-black uppercase tracking-[0.22em] text-sky-200">
              Approval Required
            </p>

            <h2 className="mt-2 text-lg font-black text-white">
              Your live project will not change immediately
            </h2>

            <p className="mt-2 max-w-3xl text-sm leading-6 text-white/52">
              Updates submitted here must be reviewed and
              approved by the SourceTV team before they can
              replace the current project information or
              published assets.
            </p>
          </div>

          <Link
            href={`/partner/projects/${id}`}
            className="inline-flex h-11 items-center justify-center rounded-xl border border-white/10 bg-black/20 px-5 text-xs font-black text-white/70 transition hover:border-white/20 hover:bg-white/[0.06] hover:text-white"
          >
            View Current Project
          </Link>
        </div>
      </section>

      {submission.errorMessage ? (
        <StatusMessage
          type="error"
          title="Unable to submit updates"
          message={submission.errorMessage}
        />
      ) : null}

      {submission.successMessage ? (
        <StatusMessage
          type="success"
          title="Updates submitted for review"
          message={submission.successMessage}
        />
      ) : null}

      <form
        onSubmit={submission.handleSubmit}
        className="space-y-6"
      >
        <section className="overflow-hidden rounded-3xl border border-white/10 bg-white/[0.03]">
          <div className="border-b border-white/[0.08] p-5 sm:p-6">
            <p className="text-[10px] font-black uppercase tracking-[0.22em] text-sky-300">
              Project Information
            </p>

            <h2 className="mt-2 text-xl font-black text-white">
              Details and metadata
            </h2>

            <p className="mt-2 max-w-3xl text-sm leading-6 text-white/40">
              Update the information viewers may see on the
              SourceTV platform after approval.
            </p>
          </div>

          <div className="p-5 sm:p-6">
            <ProjectDetailsSection
              form={submission.form}
              updateField={submission.updateField}
            />
          </div>
        </section>

        <section className="overflow-hidden rounded-3xl border border-white/10 bg-white/[0.03]">
          <div className="border-b border-white/[0.08] p-5 sm:p-6">
            <p className="text-[10px] font-black uppercase tracking-[0.22em] text-sky-300">
              Media Update
            </p>

            <h2 className="mt-2 text-xl font-black text-white">
              Video files
            </h2>

            <p className="mt-2 max-w-3xl text-sm leading-6 text-white/40">
              Upload replacement video assets only when a
              change is necessary. Existing public media must
              remain active until the replacement is approved.
            </p>
          </div>

          <div className="p-5 sm:p-6">
            <VideoUploadsSection {...submission} />
          </div>
        </section>

        <section className="overflow-hidden rounded-3xl border border-white/10 bg-white/[0.03]">
          <div className="border-b border-white/[0.08] p-5 sm:p-6">
            <p className="text-[10px] font-black uppercase tracking-[0.22em] text-sky-300">
              Artwork Update
            </p>

            <h2 className="mt-2 text-xl font-black text-white">
              Promotional artwork
            </h2>

            <p className="mt-2 max-w-3xl text-sm leading-6 text-white/40">
              Submit replacement posters, backdrops, thumbnails,
              or title artwork for approval.
            </p>
          </div>

          <div className="p-5 sm:p-6">
            <ArtworkSection {...submission} />
          </div>
        </section>

        <section className="overflow-hidden rounded-3xl border border-white/10 bg-white/[0.03]">
          <div className="border-b border-white/[0.08] p-5 sm:p-6">
            <p className="text-[10px] font-black uppercase tracking-[0.22em] text-sky-300">
              Proposed Appearance
            </p>

            <h2 className="mt-2 text-xl font-black text-white">
              Review your proposed changes
            </h2>

            <p className="mt-2 max-w-3xl text-sm leading-6 text-white/40">
              This preview represents the proposed version. It
              does not replace the current SourceTV listing
              until approval.
            </p>
          </div>

          <div className="p-5 sm:p-6">
            <LiveProjectPreview {...submission} />
          </div>
        </section>

        <section className="overflow-hidden rounded-3xl border border-white/10 bg-white/[0.035]">
          <div className="grid gap-6 p-5 sm:p-6 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-center">
            <div>
              <p className="text-[10px] font-black uppercase tracking-[0.22em] text-amber-200">
                Final Review
              </p>

              <h2 className="mt-2 text-lg font-black text-white">
                Submit these updates to SourceTV
              </h2>

              <p className="mt-2 max-w-2xl text-sm leading-6 text-white/42">
                SourceTV will review the proposed information
                and assets. Your current approved project
                remains unchanged while the request is pending.
              </p>
            </div>

            <div className="flex flex-col-reverse gap-3 sm:flex-row lg:justify-end">
              <Link
                href="/partner/projects"
                className="inline-flex h-12 items-center justify-center rounded-xl border border-white/10 bg-white/[0.035] px-6 text-sm font-black text-white/65 transition hover:border-white/20 hover:bg-white/[0.06] hover:text-white"
              >
                Cancel
              </Link>

              <button
                type="submit"
                disabled={submission.submitting}
                className="inline-flex h-12 items-center justify-center rounded-xl bg-sky-300 px-6 text-sm font-black text-black transition hover:bg-sky-200 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {submission.submitting
                  ? "Submitting Updates..."
                  : "Submit Updates for Review"}
              </button>
            </div>
          </div>
        </section>
      </form>
    </main>
  );
}