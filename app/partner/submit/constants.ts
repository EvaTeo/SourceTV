import type {
  ProjectForm,
  SubmissionSectionId,
  UploadFiles,
} from "./types";

export const SUBMISSION_SECTIONS: Array<{
  id: SubmissionSectionId;
  label: string;
  shortLabel: string;
}> = [
  {
    id: "project-details",
    label: "Project Details",
    shortLabel: "Project",
  },
  {
    id: "video-uploads",
    label: "Video Uploads",
    shortLabel: "Video",
  },
  {
    id: "artwork",
    label: "Artwork",
    shortLabel: "Artwork",
  },
  {
    id: "live-preview",
    label: "Live Preview",
    shortLabel: "Preview",
  },
  {
    id: "submit-project",
    label: "Submit Project",
    shortLabel: "Submit",
  },
];

export const DEFAULT_FORM: ProjectForm = {
  title: "",
  description: "",
  type: "Film",
  genre: "Drama",
  year: "",
  maturityRating: "Not Rated",
  runtime: "",
  creatorName: "",
  creatorCompany: "",
};

export const DEFAULT_FILES: UploadFiles = {
  mainVideoFile: null,
  trailerFile: null,
  thumbnailFile: null,
  backdropFile: null,
  titleLogoFile: null,
};

export const PROJECT_TYPES = [
  "Film",
  "Short Film",
  "Series",
  "Animation",
  "Documentary",
  "Music Video",
  "Special",
];

export const GENRES = [
  "Drama",
  "Comedy",
  "Action",
  "Adventure",
  "Horror",
  "Sci-Fi",
  "Fantasy",
  "Thriller",
  "Romance",
  "Animation",
  "Documentary",
  "Experimental",
  "Family",
  "Crime",
  "Mystery",
];

export const MATURITY_RATINGS = [
  "Not Rated",
  "G",
  "PG",
  "PG-13",
  "R",
  "TV-Y",
  "TV-Y7",
  "TV-G",
  "TV-PG",
  "TV-14",
  "TV-MA",
];

export const MAX_MAIN_VIDEO_SIZE =
  10 * 1024 * 1024 * 1024;

export const MAX_TRAILER_SIZE =
  3 * 1024 * 1024 * 1024;

export const MAX_IMAGE_SIZE =
  20 * 1024 * 1024;

export const REVIEW_FLOW = [
  "Editorial Review",
  "Content Review",
  "Rights Review",
  "Approved",
  "Scheduled",
  "Published",
];