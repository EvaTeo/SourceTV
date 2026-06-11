/*
  Warnings:

  - You are about to drop the `CreatorApplication` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "CreatorApplication";
PRAGMA foreign_keys=on;

-- CreateTable
CREATE TABLE "Profile" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "avatar" TEXT,
    "userId" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Profile_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Watchlist" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "profileId" TEXT NOT NULL,
    "projectId" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Watchlist_profileId_fkey" FOREIGN KEY ("profileId") REFERENCES "Profile" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "Watchlist_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "ProjectSubmission" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "ContinueWatching" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "profileId" TEXT NOT NULL,
    "projectId" TEXT NOT NULL,
    "progress" INTEGER NOT NULL DEFAULT 0,
    "currentTime" REAL NOT NULL DEFAULT 0,
    "duration" REAL NOT NULL DEFAULT 0,
    "watchedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "ContinueWatching_profileId_fkey" FOREIGN KEY ("profileId") REFERENCES "Profile" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "ContinueWatching_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "ProjectSubmission" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

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
    "revenueShare" INTEGER NOT NULL DEFAULT 50,
    "views" INTEGER NOT NULL DEFAULT 0,
    "status" TEXT NOT NULL DEFAULT 'pending',
    "scheduledAt" DATETIME,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);
INSERT INTO "new_ProjectSubmission" ("backdropUrl", "createdAt", "creatorName", "description", "genre", "id", "mainVideoUrl", "maturityRating", "revenueShare", "runtime", "status", "thumbnailUrl", "title", "trailerUrl", "type", "updatedAt", "videoUrl", "views") SELECT "backdropUrl", "createdAt", "creatorName", "description", "genre", "id", "mainVideoUrl", "maturityRating", "revenueShare", "runtime", "status", "thumbnailUrl", "title", "trailerUrl", "type", "updatedAt", "videoUrl", "views" FROM "ProjectSubmission";
DROP TABLE "ProjectSubmission";
ALTER TABLE "new_ProjectSubmission" RENAME TO "ProjectSubmission";
CREATE TABLE "new_User" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "email" TEXT NOT NULL,
    "name" TEXT,
    "role" TEXT NOT NULL DEFAULT 'user',
    "password" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);
INSERT INTO "new_User" ("createdAt", "email", "id", "name", "password", "role", "updatedAt") SELECT "createdAt", "email", "id", "name", "password", "role", "updatedAt" FROM "User";
DROP TABLE "User";
ALTER TABLE "new_User" RENAME TO "User";
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;

-- CreateIndex
CREATE UNIQUE INDEX "Watchlist_profileId_projectId_key" ON "Watchlist"("profileId", "projectId");

-- CreateIndex
CREATE UNIQUE INDEX "ContinueWatching_profileId_projectId_key" ON "ContinueWatching"("profileId", "projectId");
