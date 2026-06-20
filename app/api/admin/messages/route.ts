import { getCurrentUser } from "@/app/lib/auth";
import { prisma } from "@/app/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const user = await getCurrentUser();

    if (!user || user.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    const messages = await prisma.partnerMessage.findMany({
      orderBy: {
        createdAt: "desc",
      },
      include: {
        project: true,
      },
    });

    return NextResponse.json(messages);
  } catch (error: any) {
    console.error("ADMIN MESSAGES GET ERROR:", error);

    return NextResponse.json(
      {
        error: "Failed to load admin messages",
        message: error?.message || "Unknown error",
      },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const user = await getCurrentUser();

    if (!user || user.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    const body = await request.json();

    const projectId = body.projectId || null;
    const partnerEmail = String(body.partnerEmail || "").trim();
    const partnerName = String(body.partnerName || "").trim();
    const subject = String(body.subject || "").trim();
    const message = String(body.message || body.body || "").trim();
    const senderTeam =
      String(body.senderTeam || "").trim() || "SourceTV Partner Relations";

    if (!partnerEmail) {
      return NextResponse.json(
        { error: "Partner email is required." },
        { status: 400 }
      );
    }

    if (!subject) {
      return NextResponse.json(
        { error: "Subject is required." },
        { status: 400 }
      );
    }

    if (!message) {
      return NextResponse.json(
        { error: "Message body is required." },
        { status: 400 }
      );
    }

    let resolvedPartnerName = partnerName;

    if (projectId) {
      const project = await prisma.projectSubmission.findUnique({
        where: {
          id: projectId,
        },
      });

      if (!project) {
        return NextResponse.json(
          { error: "Selected project was not found." },
          { status: 404 }
        );
      }

      if (!resolvedPartnerName) {
        resolvedPartnerName =
          project.creatorName || project.creatorCompany || partnerEmail;
      }
    }

    const created = await prisma.partnerMessage.create({
      data: {
        projectId,
        partnerEmail,
        partnerName: resolvedPartnerName || null,
        senderTeam,
        subject,
        body: message,
        isRead: false,
      },
      include: {
        project: true,
      },
    });

    return NextResponse.json(created);
  } catch (error: any) {
    console.error("ADMIN MESSAGE POST ERROR:", error);

    return NextResponse.json(
      {
        error: "Failed to send admin message",
        message: error?.message || "Unknown error",
      },
      { status: 500 }
    );
  }
}