-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_ProjectSubmission" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "type" TEXT,
    "genre" TEXT,
    "year" INTEGER,
    "videoUrl" TEXT,
    "mainVideoUrl" TEXT,
    "trailerUrl" TEXT,
    "thumbnailUrl" TEXT,
    "backdropUrl" TEXT,
    "bunnyVideoId" TEXT,
    "bunnyLibraryId" TEXT,
    "maturityRating" TEXT,
    "runtime" TEXT,
    "creatorName" TEXT,
    "creatorEmail" TEXT,
    "creatorCompany" TEXT,
    "revenueShare" INTEGER NOT NULL DEFAULT 50,
    "rightsOwner" TEXT,
    "rightsContact" TEXT,
    "licenseType" TEXT,
    "licenseStartDate" DATETIME,
    "licenseEndDate" DATETIME,
    "territories" TEXT,
    "exclusivity" TEXT,
    "metadataNotes" TEXT,
    "contentNotes" TEXT,
    "rightsNotes" TEXT,
    "reviewNotes" TEXT,
    "workflowStage" TEXT NOT NULL DEFAULT 'submission',
    "status" TEXT NOT NULL DEFAULT 'pending',
    "featured" BOOLEAN NOT NULL DEFAULT false,
    "featuredRank" INTEGER,
    "editorPick" BOOLEAN NOT NULL DEFAULT false,
    "scheduledAt" DATETIME,
    "publishedAt" DATETIME,
    "archivedAt" DATETIME,
    "rejectedAt" DATETIME,
    "views" INTEGER NOT NULL DEFAULT 0,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);
INSERT INTO "new_ProjectSubmission" ("backdropUrl", "bunnyLibraryId", "bunnyVideoId", "createdAt", "creatorName", "description", "genre", "id", "mainVideoUrl", "maturityRating", "revenueShare", "runtime", "scheduledAt", "status", "thumbnailUrl", "title", "trailerUrl", "type", "updatedAt", "videoUrl", "views", "year") SELECT "backdropUrl", "bunnyLibraryId", "bunnyVideoId", "createdAt", "creatorName", "description", "genre", "id", "mainVideoUrl", "maturityRating", "revenueShare", "runtime", "scheduledAt", "status", "thumbnailUrl", "title", "trailerUrl", "type", "updatedAt", "videoUrl", "views", "year" FROM "ProjectSubmission";
DROP TABLE "ProjectSubmission";
ALTER TABLE "new_ProjectSubmission" RENAME TO "ProjectSubmission";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
