import { prisma } from "@/app/lib/prisma";
import { NextResponse } from "next/server";

const workflowOrder = [
  "submission",
  "metadata_review",
  "content_review",
  "rights_review",
  "approved",
  "scheduled",
  "published",
];

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await req.json();

    const existing = await prisma.projectSubmission.findUnique({
      where: { id },
    });

    if (!existing) {
      return NextResponse.json(
        { error: "Content not found" },
        { status: 404 }
      );
    }

    const data: any = {};

    if (body.action === "move_forward") {
      const currentIndex = workflowOrder.indexOf(
        existing.workflowStage || "submission"
      );

      const nextStage =
        currentIndex >= 0 && currentIndex < workflowOrder.length - 1
          ? workflowOrder[currentIndex + 1]
          : existing.workflowStage;

      data.workflowStage = nextStage;

      if (nextStage === "published") {
        data.status = "approved";
        data.publishedAt = new Date();
      }

      if (nextStage === "scheduled" && !existing.scheduledAt) {
        data.scheduledAt = new Date();
      }
    }

    if (body.action === "reject") {
      data.workflowStage = "rejected";
      data.status = "rejected";
      data.rejectedAt = new Date();
      data.reviewNotes = body.reviewNotes || existing.reviewNotes;
    }

    if (body.action === "archive") {
      data.workflowStage = "archived";
      data.archivedAt = new Date();
    }

    if (body.action === "publish") {
      data.workflowStage = "published";
      data.status = "approved";
      data.publishedAt = new Date();
    }

    if (body.action === "feature") {
      data.featured = true;
      data.featuredRank = body.featuredRank || existing.featuredRank || 1;
    }

    if (body.action === "unfeature") {
      data.featured = false;
      data.featuredRank = null;
    }
    if (body.action === "send_message") {
  await prisma.partnerMessage.create({
    data: {
      projectId: existing.id,
      senderTeam:
        body.senderTeam || "SourceTV Partner Relations",

      subject:
        body.subject || "Message From SourceTV",

      body:
        body.message ||
        "A SourceTV team member has contacted you.",
    },
  });

  return NextResponse.json({
    success: true,
    message: "Partner message sent",
  });
}

    if (body.title !== undefined) data.title = body.title;
    if (body.description !== undefined) data.description = body.description;
    if (body.type !== undefined) data.type = body.type;
    if (body.genre !== undefined) data.genre = body.genre;
    if (body.maturityRating !== undefined)
      data.maturityRating = body.maturityRating;
    if (body.runtime !== undefined) data.runtime = body.runtime;
    if (body.creatorName !== undefined) data.creatorName = body.creatorName;
    if (body.creatorEmail !== undefined) data.creatorEmail = body.creatorEmail;
    if (body.creatorCompany !== undefined)
      data.creatorCompany = body.creatorCompany;
    if (body.titleLogoUrl !== undefined) data.titleLogoUrl = body.titleLogoUrl;

    if (body.revenueShare !== undefined) {
      data.revenueShare = Number(body.revenueShare);
    }

    if (body.rightsOwner !== undefined) data.rightsOwner = body.rightsOwner;
    if (body.rightsContact !== undefined)
      data.rightsContact = body.rightsContact;
    if (body.licenseType !== undefined) data.licenseType = body.licenseType;
    if (body.territories !== undefined) data.territories = body.territories;
    if (body.exclusivity !== undefined) data.exclusivity = body.exclusivity;
if (body.recognitionLevel !== undefined) {
  data.recognitionLevel = body.recognitionLevel;
}
    if (body.workflowStage !== undefined) {
      data.workflowStage = body.workflowStage;
    }

    if (body.status !== undefined) {
      data.status = body.status;
    }

    if (typeof body.featured === "boolean") {
      data.featured = body.featured;
    }

    if (body.featuredRank !== undefined) {
      data.featuredRank =
        body.featuredRank === "" || body.featuredRank === null
          ? null
          : Number(body.featuredRank);
    }

    if (body.scheduledAt !== undefined) {
      data.scheduledAt =
        body.scheduledAt && body.scheduledAt !== ""
          ? new Date(body.scheduledAt)
          : null;
    }

    if (body.publishedAt !== undefined) {
      data.publishedAt =
        body.publishedAt && body.publishedAt !== ""
          ? new Date(body.publishedAt)
          : null;
    }

    if (body.licenseStartDate !== undefined) {
      data.licenseStartDate =
        body.licenseStartDate && body.licenseStartDate !== ""
          ? new Date(body.licenseStartDate)
          : null;
    }

    if (body.licenseEndDate !== undefined) {
      data.licenseEndDate =
        body.licenseEndDate && body.licenseEndDate !== ""
          ? new Date(body.licenseEndDate)
          : null;
    }

    if (body.metadataNotes !== undefined) data.metadataNotes = body.metadataNotes;
    if (body.contentNotes !== undefined) data.contentNotes = body.contentNotes;
    if (body.rightsNotes !== undefined) data.rightsNotes = body.rightsNotes;
    if (body.reviewNotes !== undefined) data.reviewNotes = body.reviewNotes;

    const updated = await prisma.projectSubmission.update({
      where: { id },
      data,
    });

    return NextResponse.json({
      success: true,
      project: updated,
    });
  } catch (error: any) {
    return NextResponse.json(
      {
        error: "Failed to update content",
        message: error?.message || "Unknown error",
      },
      { status: 500 }
    );
  }
}