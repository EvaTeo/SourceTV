export type Project = {
  id: string;
  title: string;
  description?: string | null;
  type?: string | null;
  genre?: string | null;
  thumbnailUrl?: string | null;
  backdropUrl?: string | null;
  status?: string | null;
  workflowStage?: string | null;
};

export type CollectionItem = {
  id: string;
  collectionId: string;
  projectId: string;
  sortOrder: number;
  project: Project;
};

export type EditorialCollection = {
  id: string;
  title: string;
  slug: string;
  description?: string | null;
  placement: string;
  status: string;
  sortOrder: number;
  startsAt?: string | null;
  endsAt?: string | null;
  items: CollectionItem[];
  createdAt: string;
  updatedAt: string;
};

export type CollectionForm = {
  title: string;
  description: string;
  placement: string;
  status: string;
  sortOrder: number;
  startsAt: string;
  endsAt: string;
};

export type MoveDirection = "up" | "down";