"use client";

import AdminPageHeader from "@/app/components/admin/AdminPageHeader";
import Link from "next/link";
import { use } from "react";

import ArtworkSection from "./components/ArtworkSection";
import CreatorSection from "./components/CreatorSection";
import HeroProgrammingSection from "./components/HeroProgrammingSection";
import MetadataSection from "./components/MetadataSection";
import PartnerCommunicationSection from "./components/PartnerCommunicationSection";
import PublishingSection from "./components/PublishingSection";
import VideoSection from "./components/VideoSection";

import useContentEditor from "./hooks/useContentEditor";

export default function EditContentPage({
  params,
}: {
  params: Promise<{
    id: string;
  }>;
}) {
  const { id } = use(params);

  const editor =
    useContentEditor(id);

  if (editor.loading) {
    return (
      <main className="min-h-screen bg-black px-6 py-10 text-white">
        Loading editor...
      </main>
    );
  }

  if (!editor.form) {
    return (
      <main className="min-h-screen bg-black px-6 py-10 text-white">
        Content not found.
      </main>
    );
  }

  const { form } =
    editor;

  return (
    <main className="space-y-6">
      <AdminPageHeader
        eyebrow="SourceTV CMS"
        title="Edit Title"
        description="Manage metadata, artwork, video assets, publishing, scheduling, and creator details."
        actions={
          <>
            <Link
              href="/admin/review"
              className="rounded-xl border border-white/10 bg-white/[0.035] px-4 py-2.5 text-sm font-medium text-white/65 transition hover:border-white/20 hover:bg-white/[0.055] hover:text-white"
            >
              Review Queue
            </Link>

            <Link
              href={`/watch/${form.id}?preview=admin`}
              className="rounded-xl bg-sky-300 px-4 py-2.5 text-sm font-semibold text-[#05070d] transition hover:bg-sky-200"
            >
              Preview
            </Link>
          </>
        }
      />

      <form
        onSubmit={
          editor.saveChanges
        }
        className="grid gap-6 rounded-2xl border border-white/10 bg-white/[0.035] p-6 md:grid-cols-2"
      >
        <MetadataSection
          form={form}
          updateField={
            editor.updateField
          }
        />

        <ArtworkSection
          form={form}
          posterFile={
            editor.posterFile
          }
          backdropFile={
            editor.backdropFile
          }
          cardArtFile={
            editor.cardArtFile
          }
          titleLogoFile={
            editor.titleLogoFile
          }
          assetUploading={
            editor.assetUploading
          }
          setPosterFile={
            editor.setPosterFile
          }
          setBackdropFile={
            editor.setBackdropFile
          }
          setCardArtFile={
            editor.setCardArtFile
          }
          setTitleLogoFile={
            editor.setTitleLogoFile
          }
          uploadAsset={
            editor.uploadAsset
          }
        />

        <VideoSection
          form={form}
          mainVideoFile={
            editor.mainVideoFile
          }
          trailerVideoFile={
            editor.trailerVideoFile
          }
          videoUploading={
            editor.videoUploading
          }
          setMainVideoFile={
            editor.setMainVideoFile
          }
          setTrailerVideoFile={
            editor.setTrailerVideoFile
          }
          uploadVideoAsset={
            editor.uploadVideoAsset
          }
        />

        <CreatorSection
          form={form}
          updateField={
            editor.updateField
          }
        />

        <PartnerCommunicationSection
          subject={
            editor.messageSubject
          }
          senderTeam={
            editor.messageSenderTeam
          }
          message={
            editor.messageBody
          }
          sending={
            editor.sendingMessage
          }
          onSubjectChange={
            editor.setMessageSubject
          }
          onSenderTeamChange={
            editor.setMessageSenderTeam
          }
          onMessageChange={
            editor.setMessageBody
          }
          onSend={
            editor.sendPartnerMessage
          }
        />

        <PublishingSection
          form={form}
          updateField={
            editor.updateField
          }
          calendarOpen={
            editor.calendarOpen
          }
          timeOpen={
            editor.timeOpen
          }
          calendarMonth={
            editor.calendarMonth
          }
          calendarDays={
            editor.calendarDays
          }
          timeOptions={
            editor.timeOptions
          }
          setCalendarOpen={
            editor.setCalendarOpen
          }
          setTimeOpen={
            editor.setTimeOpen
          }
          setCalendarMonth={
            editor.setCalendarMonth
          }
          onSelectDate={
            editor.selectScheduleDate
          }
          onSelectTime={
            editor.selectScheduleTime
          }
        />

        <HeroProgrammingSection
          form={form}
          updateField={
            editor.updateField
          }
        />

        <div className="md:col-span-2 border-t border-white/10 pt-6">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-2xl font-black">
                Save Changes
              </h2>

              <p className="mt-2 text-white/50">
                Commit metadata, workflow, scheduling, and hero changes.
              </p>
            </div>

            <button
              type="submit"
              disabled={
                editor.saving
              }
              className="rounded-xl bg-sky-300 px-6 py-3 text-sm font-black text-black transition hover:bg-sky-200 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {editor.saving
                ? "Saving..."
                : "Save Changes"}
            </button>
          </div>
        </div>
      </form>
    </main>
  );
}