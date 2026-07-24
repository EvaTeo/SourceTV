export type Reply = {
  id: string;
  senderRole: string;
  senderName?: string | null;
  senderEmail?: string | null;
  body: string;
  isRead: boolean;
  createdAt: string;
};

export type Message = {
  id: string;
  subject: string;
  body: string;
  senderTeam: string;
  isRead: boolean;
  createdAt: string;
  replies?: Reply[];
  project?: {
    id: string;
    title: string;
    workflowStage: string;
    recognitionLevel?: string | null;
  } | null;
};

export type InboxFilter = "all" | "unread" | "read";

export type InboxFilterCounts = Record<InboxFilter, number>;