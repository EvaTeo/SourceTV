-- CreateTable
CREATE TABLE "AdCampaign" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "advertiser" TEXT,
    "status" TEXT NOT NULL DEFAULT 'draft',
    "placement" TEXT NOT NULL DEFAULT 'pre_roll',
    "videoUrl" TEXT,
    "clickUrl" TEXT,
    "imageUrl" TEXT,
    "skipAfterSeconds" INTEGER,
    "durationSeconds" INTEGER,
    "startDate" DATETIME,
    "endDate" DATETIME,
    "budgetCents" INTEGER NOT NULL DEFAULT 0,
    "cpmCents" INTEGER NOT NULL DEFAULT 1200,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "AdImpression" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "campaignId" TEXT NOT NULL,
    "projectId" TEXT,
    "profileId" TEXT,
    "placement" TEXT NOT NULL,
    "completed" BOOLEAN NOT NULL DEFAULT false,
    "skipped" BOOLEAN NOT NULL DEFAULT false,
    "clicked" BOOLEAN NOT NULL DEFAULT false,
    "watchedSeconds" INTEGER NOT NULL DEFAULT 0,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "AdImpression_campaignId_fkey" FOREIGN KEY ("campaignId") REFERENCES "AdCampaign" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "AdImpression_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "ProjectSubmission" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "AdImpression_profileId_fkey" FOREIGN KEY ("profileId") REFERENCES "Profile" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
