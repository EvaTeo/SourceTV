"use client";

import InboxFilters from "./components/InboxFilters";
import InboxHeader from "./components/InboxHeader";
import InboxMessages from "./components/InboxMessages";
import InboxStat from "./components/InboxStat";
import usePartnerInbox from "./hooks/usePartnerInbox";
import type { InboxFilter } from "./types";

const filters: Array<{
  label: string;
  value: InboxFilter;
}> = [
  {
    label: "All",
    value: "all",
  },
  {
    label: "Unread",
    value: "unread",
  },
  {
    label: "Read",
    value: "read",
  },
];

export default function PartnerInboxClient() {
  const {
    messages,
    loading,

    selectedMessage,

    activeFilter,
    setActiveFilter,

    replyBodies,
    setReplyBodies,

    sendingReplyId,

    unreadCount,
    readCount,

    filteredMessages,
    filterCounts,

    loadMessages,
    openMessage,
    closeMessage,
    sendReply,
  } = usePartnerInbox();

  function updateReplyBody(
    messageId: string,
    value: string
  ) {
    setReplyBodies((current) => ({
      ...current,
      [messageId]: value,
    }));
  }

  return (
    <div className="mx-auto w-full max-w-[1180px] pb-16">
      <InboxHeader
        loading={loading}
        onRefresh={loadMessages}
      />

      <section className="mt-7 grid gap-3 sm:grid-cols-3">
        <InboxStat
          label="Total Messages"
          value={messages.length}
        />

        <InboxStat
          label="Unread"
          value={unreadCount}
          highlighted
        />

        <InboxStat
          label="Read"
          value={readCount}
        />
      </section>

      <section className="mt-6">
        <InboxFilters
          filters={filters}
          activeFilter={activeFilter}
          counts={filterCounts}
          onChange={setActiveFilter}
        />
      </section>

      <section className="mt-7">
        <InboxMessages
          messages={messages}
          filteredMessages={filteredMessages}
          loading={loading}
          selectedMessage={selectedMessage}
          replyBodies={replyBodies}
          sendingReplyId={sendingReplyId}
          onOpenMessage={openMessage}
          onCloseMessage={closeMessage}
          onReplyChange={updateReplyBody}
          onSendReply={sendReply}
        />
      </section>
    </div>
  );
}