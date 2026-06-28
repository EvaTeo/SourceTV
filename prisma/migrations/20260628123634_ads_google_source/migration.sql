-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_AdCampaign" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "advertiser" TEXT,
    "status" TEXT NOT NULL DEFAULT 'draft',
    "placement" TEXT NOT NULL DEFAULT 'pre_roll',
    "videoUrl" TEXT,
    "clickUrl" TEXT,
    "imageUrl" TEXT,
    "adSource" TEXT NOT NULL DEFAULT 'direct',
    "vastTagUrl" TEXT,
    "skipAfterSeconds" INTEGER,
    "durationSeconds" INTEGER,
    "startDate" DATETIME,
    "endDate" DATETIME,
    "budgetCents" INTEGER NOT NULL DEFAULT 0,
    "cpmCents" INTEGER NOT NULL DEFAULT 1200,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);
INSERT INTO "new_AdCampaign" ("advertiser", "budgetCents", "clickUrl", "cpmCents", "createdAt", "durationSeconds", "endDate", "id", "imageUrl", "name", "placement", "skipAfterSeconds", "startDate", "status", "updatedAt", "videoUrl") SELECT "advertiser", "budgetCents", "clickUrl", "cpmCents", "createdAt", "durationSeconds", "endDate", "id", "imageUrl", "name", "placement", "skipAfterSeconds", "startDate", "status", "updatedAt", "videoUrl" FROM "AdCampaign";
DROP TABLE "AdCampaign";
ALTER TABLE "new_AdCampaign" RENAME TO "AdCampaign";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
