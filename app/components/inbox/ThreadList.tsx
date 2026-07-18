import ThreadItem from "./ThreadItem";

type Thread = {
  id: string;
  title: string;
  participant: string;
  preview: string;
  date: string;
  unread?: boolean;
  replies?: number;
};

type Props = {
  threads: Thread[];
  selectedId: string | null;
  onSelect: (id: string) => void;
};

export default function ThreadList({
  threads,
  selectedId,
  onSelect,
}: Props) {
  if (!threads.length) {
    return (
      <div className="rounded-2xl border border-white/10 bg-white/[0.035] p-8 text-center text-white/40">
        No conversations yet.
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {threads.map((thread) => (
        <ThreadItem
          key={thread.id}
          title={thread.title}
          participant={thread.participant}
          preview={thread.preview}
          date={thread.date}
          unread={thread.unread}
          replies={thread.replies}
          active={selectedId === thread.id}
          onClick={() => onSelect(thread.id)}
        />
      ))}
    </div>
  );
}