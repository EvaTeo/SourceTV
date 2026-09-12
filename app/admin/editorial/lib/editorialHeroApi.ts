export type HeroContentProject = {
  id: string;
  title: string;
  description?: string | null;
  type?: string | null;
  genre?: string | null;

  thumbnailUrl?: string | null;
  backdropUrl?: string | null;
  titleLogoUrl?: string | null;
  trailerUrl?: string | null;

  status?: string | null;
  workflowStage?: string | null;

  featured?: boolean;
  featuredRank?: number | null;

  heroBadge?: string | null;
  heroPriority?: number | null;
  heroStartDate?: string | null;
  heroEndDate?: string | null;
};

async function readResponse(
  response: Response
) {
  const data = await response
    .json()
    .catch(() => null);

  if (!response.ok) {
    throw new Error(
      data?.error ||
        data?.message ||
        "The requested update could not be completed."
    );
  }

  return data;
}

export async function fetchHeroProjects(): Promise<
  HeroContentProject[]
> {
  const response = await fetch(
    "/api/admin/content",
    {
      cache: "no-store",
    }
  );

  const data =
    await readResponse(response);

  return Array.isArray(data)
    ? (data as HeroContentProject[])
    : [];
}

export async function updateHeroProject(
  projectId: string,
  body: Record<string, unknown>
) {
  const response = await fetch(
    `/api/admin/content/${projectId}`,
    {
      method: "PATCH",
      headers: {
        "Content-Type":
          "application/json",
      },
      body: JSON.stringify(body),
    }
  );

  return readResponse(response);
}

export async function saveHeroProjectOrder(
  projects: Array<{
    id: string;
  }>
) {
  const responses =
    await Promise.all(
      projects.map(
        (project, index) =>
          fetch(
            `/api/admin/content/${project.id}`,
            {
              method: "PATCH",
              headers: {
                "Content-Type":
                  "application/json",
              },
              body: JSON.stringify({
                heroPriority:
                  index + 1,

                featuredRank:
                  index + 1,
              }),
            }
          )
      )
    );

  await Promise.all(
    responses.map(
      readResponse
    )
  );
}