import ThreadItem from "./ThreadItem";

type Message = {
  id: string;
  subject: string;
  body: string;
  isRead: boolean;
  createdAt: string;
  partnerName?: string | null;
  partnerEmail?: string | null;
  replies?: { id: string }[];
};

type Props = {
  messages: Message[];
  selectedId: string | null;
  onSelect: (id: string) => void;
  formatDate: (date: string) => string;
};

export default function ThreadList({
  messages,
  selectedId,
  onSelect,
  formatDate,
}: Props) {
  return (
    <div className="space-y-3">
      {messages.map((item) => (
        <ThreadItem
          key={item.id}
          title={item.subject}
          partner={
            item.partnerName || item.partnerEmail || "Unknown Partner"
          }
          preview={item.body}
          date={formatDate(item.createdAt)}
          unread={!item.isRead}
          replies={item.replies?.length || 0}
          active={selectedId === item.id}
          onClick={() => onSelect(item.id)}
        />
      ))}
    </div>
  );
}