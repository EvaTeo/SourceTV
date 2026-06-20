-- CreateTable
CREATE TABLE "PartnerMessageReply" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "messageId" TEXT NOT NULL,
    "senderRole" TEXT NOT NULL,
    "senderName" TEXT,
    "senderEmail" TEXT,
    "body" TEXT NOT NULL,
    "isRead" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "PartnerMessageReply_messageId_fkey" FOREIGN KEY ("messageId") REFERENCES "PartnerMessage" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
