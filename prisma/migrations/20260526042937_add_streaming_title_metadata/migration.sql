-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_ProjectSubmission" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "title" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "genre" TEXT NOT NULL,
    "videoUrl" TEXT NOT NULL,
    "thumbnailUrl" TEXT,
    "description" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'pending',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "views" INTEGER NOT NULL DEFAULT 0,
    "mainVideoUrl" TEXT,
    "trailerUrl" TEXT,
    "backdropUrl" TEXT,
    "maturityRating" TEXT,
    "runtime" TEXT,
    "creatorName" TEXT,
    "revenueShare" INTEGER NOT NULL DEFAULT 50
);
INSERT INTO "new_ProjectSubmission" ("createdAt", "description", "genre", "id", "status", "thumbnailUrl", "title", "type", "updatedAt", "videoUrl", "views") SELECT "createdAt", "description", "genre", "id", "status", "thumbnailUrl", "title", "type", "updatedAt", "videoUrl", "views" FROM "ProjectSubmission";
DROP TABLE "ProjectSubmission";
ALTER TABLE "new_ProjectSubmission" RENAME TO "ProjectSubmission";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
