export type ExperienceItemData = {
  id: string;
  title: string;
  intro: string;
  description?: string;
  benefits?: string[];
};

export const experienceItems: ExperienceItemData[] = [
  {
  id: "profiles",
  title: "Personal Profiles",
  intro:
    "Everyone in your household gets their own viewing experience.",
  description:
    "Recommendations, Continue Watching, and My List stay personal to each profile.",
},

  {
    id: "continue-watching",
    title: "Continue Watching",
    intro: "Stop anytime. Resume anytime.",
    description:
      "SourceTV remembers where you left off, so your next film or episode is waiting when you return.",
  },
  {
    id: "my-list",
    title: "My List",
    intro: "Save what catches your attention.",
    description:
      "Build a personal collection of films, series, documentaries, and animation to watch whenever you are ready.",
  },
  {
    id: "discover",
    title: "Discover More",
    intro:
      "Finding something worth watching should feel effortless.",
    description:
      "Explore categories, genres, trending titles, and search results to uncover stories from fresh voices and established creators.",
  },
  {
    id: "watch-free",
    title: "Watch Free",
    intro: "Start watching in minutes.",
    description:
      "Create an account with no required subscription and no credit card. Premium remains an optional upgrade.",
  },
];