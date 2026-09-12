"use client";

import Link from "next/link";

import AdminPageHeader from "@/app/components/admin/AdminPageHeader";
import MetricCard from "@/app/components/admin/MetricCard";

import ContentCard from "./components/ContentCard";
import ContentFilters from "./components/ContentFilters";
import PartnerMessageModal from "./components/PartnerMessageModal";
import RejectContentModal from "./components/RejectContentModal";

import {
  recognitionLevels,
  stageLabels,
} from "./constants";

import useAdminContent from "./hooks/useAdminContent";

import {
  formatDate,
  getMessageHistory,
  stageBadgeClass,
} from "./utils";

export default function AdminContentPage() {
  const content =
    useAdminContent();

  return (
    <main className="space-y-6">
      <AdminPageHeader
        eyebrow="SourceTV Operations"
        title="Content Library"
        description="Manage submissions, metadata review, content review, rights, scheduling, publishing, featuring, recognition, and archive decisions."
        actions={
          <>
            <Link
              href="/admin/review"
              className="rounded-xl border border-white/10 bg-white/[0.035] px-4 py-2.5 text-sm font-medium text-white/65 transition hover:border-white/20 hover:bg-white/[0.055] hover:text-white"
            >
              Review Queue
            </Link>

            <Link
              href="/admin/upload"
              className="rounded-xl bg-sky-300 px-4 py-2.5 text-sm font-semibold text-[#05070d] transition hover:bg-sky-200"
            >
              Upload Title
            </Link>
          </>
        }
      />

      <section className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {content.stats.map(
          (stat) => (
            <MetricCard
              key={stat.label}
              label={stat.label}
              value={stat.value}
            />
          )
        )}
      </section>

      <ContentFilters
        search={content.search}
        activeFilter={
          content.activeFilter
        }
        activeType={
          content.activeType
        }
        showFilters={
          content.showFilters
        }
        contentTypes={
          content.contentTypes
        }
        counts={content.counts}
        setSearch={
          content.setSearch
        }
        setActiveFilter={
          content.setActiveFilter
        }
        setActiveType={
          content.setActiveType
        }
        setShowFilters={
          content.setShowFilters
        }
      />

      <div className="flex justify-end">
        <button
          type="button"
          onClick={() =>
            void content.loadContent()
          }
          className="h-11 rounded-xl border border-white/10 bg-white/[0.035] px-4 text-sm font-medium text-white/65 transition hover:border-white/20 hover:bg-white/[0.055] hover:text-white"
        >
          Refresh
        </button>
      </div>

      {content.loading ? (
        <section className="rounded-[2rem] border border-white/10 bg-white/[0.04] p-10 text-white/50">
          Loading admin
          content...
        </section>
      ) : content.filteredContent
          .length === 0 ? (
        <section className="rounded-[2rem] border border-white/10 bg-white/[0.04] p-10 text-white/50">
          No titles found for
          this view.
        </section>
      ) : (
        <section className="grid gap-5">
          {content.filteredContent.map(
            (item) => {
              const saving =
                content.savingId ===
                item.id;

              const expanded =
                content.expandedId ===
                item.id;

              const messageHistory =
                getMessageHistory(
                  item
                );

              const latestMessage =
                messageHistory[0];

              return (
                <ContentCard
                  key={item.id}
                  item={item}
                  saving={saving}
                  expanded={
                    expanded
                  }
                  messageHistory={
                    messageHistory
                  }
                  latestMessage={
                    latestMessage
                  }
                  recognitionLevels={
                    recognitionLevels
                  }
                  stageLabels={
                    stageLabels
                  }
                  stageBadgeClass={
                    stageBadgeClass
                  }
                  formatDate={
                    formatDate
                  }
                  onMoveForward={() =>
                    void content.updateContent(
                      item.id,
                      {
                        action:
                          "move_forward",
                      }
                    )
                  }
                  onPublish={() =>
                    void content.updateContent(
                      item.id,
                      {
                        action:
                          "publish",
                      }
                    )
                  }
                  onFeature={() =>
                    void content.updateContent(
                      item.id,
                      {
                        action:
                          item.featured
                            ? "unfeature"
                            : "feature",
                      }
                    )
                  }
                  onArchive={() =>
                    void content.updateContent(
                      item.id,
                      {
                        action:
                          "archive",
                      }
                    )
                  }
                  onRecognitionChange={(
                    value
                  ) =>
                    void content.updateContent(
                      item.id,
                      {
                        recognitionLevel:
                          value ||
                          null,
                      }
                    )
                  }
                  onMessage={() =>
                    content.openMessageModal(
                      item
                    )
                  }
                  onReject={() =>
                    content.openRejectModal(
                      item
                    )
                  }
                  onToggleDetails={() =>
                    content.toggleExpanded(
                      item.id
                    )
                  }
                />
              );
            }
          )}
        </section>
      )}

      {content.messageTarget && (
        <PartnerMessageModal
          title={
            content.messageTarget
              .title
          }
          saving={
            content.savingId ===
            content.messageTarget
              .id
          }
          form={
            content.messageForm
          }
          setForm={
            content.setMessageForm
          }
          onClose={
            content.closeMessageModal
          }
          onSend={() =>
            void content.sendPartnerMessage()
          }
        />
      )}

      {content.rejectTarget && (
        <RejectContentModal
          title={
            content.rejectTarget
              .title
          }
          reason={
            content.rejectReason
          }
          saving={
            content.savingId ===
            content.rejectTarget.id
          }
          setReason={
            content.setRejectReason
          }
          onClose={
            content.closeRejectModal
          }
          onReject={() =>
            void content.rejectContent()
          }
        />
      )}
    </main>
  );
}