-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_AdCampaign" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "advertiser" TEXT,
    "status" TEXT NOT NULL DEFAULT 'draft',
    "adSource" TEXT NOT NULL DEFAULT 'direct',
    "vastTagUrl" TEXT,
    "adType" TEXT NOT NULL DEFAULT 'commercial',
    "objective" TEXT NOT NULL DEFAULT 'awareness',
    "placement" TEXT NOT NULL DEFAULT 'pre_roll',
    "videoUrl" TEXT,
    "clickUrl" TEXT,
    "imageUrl" TEXT,
    "skipPolicy" TEXT NOT NULL DEFAULT 'after_delay',
    "skipAfterSeconds" INTEGER NOT NULL DEFAULT 5,
    "premiumCanSkip" BOOLEAN NOT NULL DEFAULT true,
    "durationSeconds" INTEGER,
    "targetType" TEXT NOT NULL DEFAULT 'all',
    "targetGenres" TEXT,
    "targetRatings" TEXT,
    "targetProjectId" TEXT,
    "priority" INTEGER NOT NULL DEFAULT 1,
    "startDate" DATETIME,
    "endDate" DATETIME,
    "budgetCents" INTEGER NOT NULL DEFAULT 0,
    "spentCents" INTEGER NOT NULL DEFAULT 0,
    "cpmCents" INTEGER NOT NULL DEFAULT 1200,
    "maxImpressions" INTEGER,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);
INSERT INTO "new_AdCampaign" ("adSource", "advertiser", "budgetCents", "clickUrl", "cpmCents", "createdAt", "durationSeconds", "endDate", "id", "imageUrl", "name", "placement", "skipAfterSeconds", "startDate", "status", "updatedAt", "vastTagUrl", "videoUrl") SELECT "adSource", "advertiser", "budgetCents", "clickUrl", "cpmCents", "createdAt", "durationSeconds", "endDate", "id", "imageUrl", "name", "placement", coalesce("skipAfterSeconds", 5) AS "skipAfterSeconds", "startDate", "status", "updatedAt", "vastTagUrl", "videoUrl" FROM "AdCampaign";
DROP TABLE "AdCampaign";
ALTER TABLE "new_AdCampaign" RENAME TO "AdCampaign";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
