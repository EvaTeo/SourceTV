import type { ProjectSubmission } from "@/app/generated/prisma";

export function getPublishingProblems(
  project: ProjectSubmission
) {
  const problems: string[] = [];
  const now = new Date();

  const hasPlayableVideo = Boolean(
    project.mainVideoUrl ||
      project.videoUrl ||
      project.bunnyVideoId
  );

  const hasArtwork = Boolean(
    project.thumbnailUrl ||
      project.cardArtUrl
  );

  if (!project.title.trim()) {
    problems.push("A title is required.");
  }

  if (!project.description?.trim()) {
    problems.push(
      "A description is required."
    );
  }

  if (!hasPlayableVideo) {
    problems.push(
      "A main video, video URL, or Bunny video is required."
    );
  }

  if (!hasArtwork) {
    problems.push(
      "A thumbnail or card artwork image is required."
    );
  }

  if (
    project.licenseStartDate &&
    project.licenseStartDate.getTime() >
      now.getTime()
  ) {
    problems.push(
      "The content license has not started yet."
    );
  }

  if (
    project.licenseEndDate &&
    project.licenseEndDate.getTime() <
      now.getTime()
  ) {
    problems.push(
      "The content license has expired."
    );
  }

  if (
    project.licenseStartDate &&
    project.licenseEndDate &&
    project.licenseStartDate.getTime() >
      project.licenseEndDate.getTime()
  ) {
    problems.push(
      "The license start date is after the license end date."
    );
  }

  return problems;
}