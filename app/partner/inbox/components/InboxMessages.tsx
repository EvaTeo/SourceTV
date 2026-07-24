import type { Message } from "../types";
import ConversationModal from "./ConversationModal";
import EmptyFilter from "./EmptyFilter";
import EmptyInbox from "./EmptyInbox";
import LoadingState from "./LoadingState";
import MessageCard from "./MessageCard";

type InboxMessagesProps = {
  messages: Message[];
  filteredMessages: Message[];
  loading: boolean;
  selectedMessage: string | null;
  replyBodies: Record<string, string>;
  sendingReplyId: string | null;
  onOpenMessage: (message: Message) => void;
  onCloseMessage: () => void;
  onReplyChange: (
    messageId: string,
    value: string
  ) => void;
  onSendReply: (messageId: string) => void;
};

export default function InboxMessages({
  messages,
  filteredMessages,
  loading,
  selectedMessage,
  replyBodies,
  sendingReplyId,
  onOpenMessage,
  onCloseMessage,
  onReplyChange,
  onSendReply,
}: InboxMessagesProps) {
  const activeMessage =
    messages.find(
      (message) => message.id === selectedMessage
    ) || null;

  return (
    <>
      <section className="overflow-hidden rounded-3xl border border-white/[0.08] bg-white/[0.025]">
        <div className="flex flex-col justify-between gap-3 border-b border-white/[0.07] px-5 py-4 sm:flex-row sm:items-center">
          <div>
            <p className="text-[10px] font-black uppercase tracking-[0.22em] text-sky-300">
              Conversations
            </p>

            <h2 className="mt-1.5 text-lg font-black text-white">
              Messages
            </h2>
          </div>

          <p className="text-xs font-semibold text-white/30">
            {loading
              ? "Loading..."
              : `${filteredMessages.length} ${
                  filteredMessages.length === 1
                    ? "conversation"
                    : "conversations"
                }`}
          </p>
        </div>

        <div className="p-4 sm:p-5">
          {loading ? (
            <LoadingState />
          ) : messages.length === 0 ? (
            <EmptyInbox />
          ) : filteredMessages.length === 0 ? (
            <EmptyFilter />
          ) : (
            <div className="space-y-3">
              {filteredMessages.map((message) => (
                <MessageCard
                  key={message.id}
                  message={message}
                  expanded={
                    selectedMessage === message.id
                  }
                  replyBody={
                    replyBodies[message.id] || ""
                  }
                  sending={
                    sendingReplyId === message.id
                  }
                  onOpen={() =>
                    onOpenMessage(message)
                  }
                  onReplyChange={(value) =>
                    onReplyChange(message.id, value)
                  }
                  onSendReply={() =>
                    onSendReply(message.id)
                  }
                />
              ))}
            </div>
          )}
        </div>
      </section>

      <ConversationModal
        message={activeMessage}
        replyBody={
          activeMessage
            ? replyBodies[activeMessage.id] || ""
            : ""
        }
        sending={
          activeMessage
            ? sendingReplyId === activeMessage.id
            : false
        }
        onClose={onCloseMessage}
        onReplyChange={(value) => {
          if (!activeMessage) {
            return;
          }

          onReplyChange(activeMessage.id, value);
        }}
        onSendReply={() => {
          if (!activeMessage) {
            return;
          }

          onSendReply(activeMessage.id);
        }}
      />
    </>
  );
}