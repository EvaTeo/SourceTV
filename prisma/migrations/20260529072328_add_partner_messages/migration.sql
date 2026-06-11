-- CreateTable
CREATE TABLE "PartnerMessage" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "projectId" TEXT,
    "subject" TEXT NOT NULL,
    "body" TEXT NOT NULL,
    "senderTeam" TEXT NOT NULL DEFAULT 'SourceTV Partner Relations',
    "isRead" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "PartnerMessage_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "ProjectSubmission" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
