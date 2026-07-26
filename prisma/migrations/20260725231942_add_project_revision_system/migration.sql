-- AlterTable
ALTER TABLE "Profile" ADD COLUMN "favoriteCreators" TEXT;
ALTER TABLE "Profile" ADD COLUMN "favoriteGenres" TEXT;
ALTER TABLE "Profile" ADD COLUMN "lastRecommendationRefresh" DATETIME;
ALTER TABLE "Profile" ADD COLUMN "recommendationProfile" TEXT;

-- AlterTable
ALTER TABLE "ProjectSubmission" ADD COLUMN "heroBadge" TEXT;
ALTER TABLE "ProjectSubmission" ADD COLUMN "heroEndDate" DATETIME;
ALTER TABLE "ProjectSubmission" ADD COLUMN "heroPriority" INTEGER;
ALTER TABLE "ProjectSubmission" ADD COLUMN "heroStartDate" DATETIME;

-- CreateTable
CREATE TABLE "ContentReaction" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "profileId" TEXT NOT NULL,
    "projectId" TEXT NOT NULL,
    "liked" BOOLEAN,
    "disliked" BOOLEAN,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "ContentReaction_profileId_fkey" FOREIGN KEY ("profileId") REFERENCES "Profile" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "ContentReaction_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "ProjectSubmission" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "ProjectRevision" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "projectId" TEXT NOT NULL,
    "versionNumber" INTEGER NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'pending',
    "baseProjectUpdatedAt" DATETIME NOT NULL,
    "submittedByEmail" TEXT NOT NULL,
    "reviewedByEmail" TEXT,
    "partnerNotes" TEXT,
    "adminNotes" TEXT,
    "changeSummary" TEXT,
    "proposedTitle" TEXT NOT NULL,
    "proposedDescription" TEXT,
    "proposedType" TEXT,
    "proposedGenre" TEXT,
    "proposedYear" INTEGER,
    "proposedVideoUrl" TEXT,
    "proposedMainVideoUrl" TEXT,
    "proposedTrailerUrl" TEXT,
    "proposedThumbnailUrl" TEXT,
    "proposedBackdropUrl" TEXT,
    "proposedTitleLogoUrl" TEXT,
    "proposedCardArtUrl" TEXT,
    "proposedBunnyVideoId" TEXT,
    "proposedBunnyLibraryId" TEXT,
    "proposedMaturityRating" TEXT,
    "proposedRuntime" TEXT,
    "proposedCreatorName" TEXT,
    "proposedCreatorCompany" TEXT,
    "submittedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "reviewedAt" DATETIME,
    "approvedAt" DATETIME,
    "rejectedAt" DATETIME,
    "changesRequestedAt" DATETIME,
    "withdrawnAt" DATETIME,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "ProjectRevision_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "ProjectSubmission" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "EditorialCollection" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "title" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "description" TEXT,
    "placement" TEXT NOT NULL DEFAULT 'browse',
    "status" TEXT NOT NULL DEFAULT 'active',
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "startsAt" DATETIME,
    "endsAt" DATETIME,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "EditorialCollectionItem" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "collectionId" TEXT NOT NULL,
    "projectId" TEXT NOT NULL,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    CONSTRAINT "EditorialCollectionItem_collectionId_fkey" FOREIGN KEY ("collectionId") REFERENCES "EditorialCollection" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "EditorialCollectionItem_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "ProjectSubmission" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "PlatformSettings" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "platformName" TEXT NOT NULL DEFAULT 'SourceTV',
    "tagline" TEXT NOT NULL DEFAULT 'The Next Generation of Entertainment',
    "supportEmail" TEXT NOT NULL DEFAULT 'support@sourcetv.com',
    "contactEmail" TEXT NOT NULL DEFAULT 'contact@sourcetv.com',
    "allowRegistrations" BOOLEAN NOT NULL DEFAULT true,
    "requireEmailVerification" BOOLEAN NOT NULL DEFAULT false,
    "maxProfiles" INTEGER NOT NULL DEFAULT 5,
    "heroAutoplay" BOOLEAN NOT NULL DEFAULT true,
    "autoplayMuted" BOOLEAN NOT NULL DEFAULT true,
    "homepageRows" INTEGER NOT NULL DEFAULT 12,
    "premiumEnabled" BOOLEAN NOT NULL DEFAULT false,
    "monthlyPrice" REAL NOT NULL DEFAULT 8.99,
    "annualPrice" REAL NOT NULL DEFAULT 89.99,
    "freeTrialDays" INTEGER NOT NULL DEFAULT 7,
    "adsEnabled" BOOLEAN NOT NULL DEFAULT true,
    "preRollAds" BOOLEAN NOT NULL DEFAULT true,
    "midRollAds" BOOLEAN NOT NULL DEFAULT false,
    "bannerAds" BOOLEAN NOT NULL DEFAULT true,
    "partnerApplications" BOOLEAN NOT NULL DEFAULT true,
    "defaultRevenueShare" INTEGER NOT NULL DEFAULT 50,
    "notificationsEnabled" BOOLEAN NOT NULL DEFAULT true,
    "moderationEnabled" BOOLEAN NOT NULL DEFAULT true,
    "maintenanceMode" BOOLEAN NOT NULL DEFAULT false,
    "aiRecommendations" BOOLEAN NOT NULL DEFAULT true,
    "aiEditorial" BOOLEAN NOT NULL DEFAULT false,
    "aiModeration" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_ContinueWatching" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "profileId" TEXT NOT NULL,
    "projectId" TEXT NOT NULL,
    "progress" INTEGER NOT NULL DEFAULT 0,
    "currentTime" REAL NOT NULL DEFAULT 0,
    "duration" REAL NOT NULL DEFAULT 0,
    "completed" BOOLEAN NOT NULL DEFAULT false,
    "completedAt" DATETIME,
    "totalWatchSessions" INTEGER NOT NULL DEFAULT 1,
    "watchedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "ContinueWatching_profileId_fkey" FOREIGN KEY ("profileId") REFERENCES "Profile" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "ContinueWatching_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "ProjectSubmission" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_ContinueWatching" ("createdAt", "currentTime", "duration", "id", "profileId", "progress", "projectId", "updatedAt", "watchedAt") SELECT "createdAt", "currentTime", "duration", "id", "profileId", "progress", "projectId", "updatedAt", "watchedAt" FROM "ContinueWatching";
DROP TABLE "ContinueWatching";
ALTER TABLE "new_ContinueWatching" RENAME TO "ContinueWatching";
CREATE UNIQUE INDEX "ContinueWatching_profileId_projectId_key" ON "ContinueWatching"("profileId", "projectId");
CREATE TABLE "new_User" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "email" TEXT NOT NULL,
    "name" TEXT,
    "role" TEXT NOT NULL DEFAULT 'user',
    "password" TEXT NOT NULL,
    "subscriptionTier" TEXT NOT NULL DEFAULT 'free',
    "subscriptionStatus" TEXT NOT NULL DEFAULT 'inactive',
    "subscriptionPriceId" TEXT,
    "subscriptionEndsAt" DATETIME,
    "stripeCustomerId" TEXT,
    "stripeSubscriptionId" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);
INSERT INTO "new_User" ("createdAt", "email", "id", "name", "password", "role", "updatedAt") SELECT "createdAt", "email", "id", "name", "password", "role", "updatedAt" FROM "User";
DROP TABLE "User";
ALTER TABLE "new_User" RENAME TO "User";
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");
CREATE UNIQUE INDEX "User_stripeCustomerId_key" ON "User"("stripeCustomerId");
CREATE UNIQUE INDEX "User_stripeSubscriptionId_key" ON "User"("stripeSubscriptionId");
CREATE TABLE "new_Watchlist" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "profileId" TEXT NOT NULL,
    "projectId" TEXT NOT NULL,
    "recommendationWeight" INTEGER NOT NULL DEFAULT 5,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Watchlist_profileId_fkey" FOREIGN KEY ("profileId") REFERENCES "Profile" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "Watchlist_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "ProjectSubmission" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_Watchlist" ("createdAt", "id", "profileId", "projectId") SELECT "createdAt", "id", "profileId", "projectId" FROM "Watchlist";
DROP TABLE "Watchlist";
ALTER TABLE "new_Watchlist" RENAME TO "Watchlist";
CREATE UNIQUE INDEX "Watchlist_profileId_projectId_key" ON "Watchlist"("profileId", "projectId");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;

-- CreateIndex
CREATE UNIQUE INDEX "ContentReaction_profileId_projectId_key" ON "ContentReaction"("profileId", "projectId");

-- CreateIndex
CREATE INDEX "ProjectRevision_projectId_status_idx" ON "ProjectRevision"("projectId", "status");

-- CreateIndex
CREATE INDEX "ProjectRevision_status_submittedAt_idx" ON "ProjectRevision"("status", "submittedAt");

-- CreateIndex
CREATE INDEX "ProjectRevision_submittedByEmail_idx" ON "ProjectRevision"("submittedByEmail");

-- CreateIndex
CREATE UNIQUE INDEX "ProjectRevision_projectId_versionNumber_key" ON "ProjectRevision"("projectId", "versionNumber");

-- CreateIndex
CREATE UNIQUE INDEX "EditorialCollection_slug_key" ON "EditorialCollection"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "EditorialCollectionItem_collectionId_projectId_key" ON "EditorialCollectionItem"("collectionId", "projectId");
