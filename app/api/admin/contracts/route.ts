import { getCurrentUser } from "@/app/lib/auth";
import { prisma } from "@/app/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const user = await getCurrentUser();

    if (!user || user.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    const contracts = await prisma.rightsContract.findMany({
      orderBy: {
        createdAt: "desc",
      },
      include: {
        project: true,
      },
    });

    return NextResponse.json(contracts);
  } catch (error: any) {
    return NextResponse.json(
      {
        error: "Failed to load contracts",
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
    const projectId = body.projectId;

    if (!projectId) {
      return NextResponse.json(
        { error: "Project ID is required" },
        { status: 400 }
      );
    }

    const project = await prisma.projectSubmission.findUnique({
      where: {
        id: projectId,
      },
    });

    if (!project) {
      return NextResponse.json(
        { error: "Project not found" },
        { status: 404 }
      );
    }

    const existingActiveContract = await prisma.rightsContract.findFirst({
      where: {
        projectId,
        status: {
          in: [
            "draft",
            "sent",
            "viewed",
            "changes_requested",
            "signed",
          ],
        },
      },
      include: {
        project: true,
      },
    });

    if (existingActiveContract) {
      return NextResponse.json(existingActiveContract);
    }

    const contract = await prisma.rightsContract.create({
      data: {
        projectId: project.id,
        partnerEmail: project.creatorEmail || null,
        partnerName: project.creatorName || null,
        rightsOwner: project.creatorCompany || project.creatorName || null,
        rightsContact: project.creatorEmail || null,
        revenueShare: project.revenueShare ?? 50,
        status: "draft",
        licenseType: "Streaming License",
        territories: "United States",
        exclusivity: "Non-exclusive",
        contractText: buildDefaultContractText({
          title: project.title,
          partnerName: project.creatorName || project.creatorCompany || "",
          revenueShare: project.revenueShare ?? 50,
        }),
      },
      include: {
        project: true,
      },
    });

    return NextResponse.json(contract);
  } catch (error: any) {
    return NextResponse.json(
      {
        error: "Failed to create contract",
        message: error?.message || "Unknown error",
      },
      { status: 500 }
    );
  }
}

function buildDefaultContractText({
  title,
  partnerName,
  revenueShare,
}: {
  title: string;
  partnerName: string;
  revenueShare: number;
}) {
  return `SOURCE TV STREAMING RIGHTS AGREEMENT

Title:
${title}

Partner / Rights Holder:
${partnerName || "To be completed"}

Agreement Summary:
This draft agreement grants SourceTV permission to stream, promote, display, and monetize the submitted title on the SourceTV platform, subject to the final terms approved by both parties.

License Type:
Streaming License

Territory:
United States, unless otherwise amended in writing.

Exclusivity:
Non-exclusive, unless otherwise amended in writing.

Revenue Share:
${revenueShare}% to the rights holder, unless otherwise amended in writing.

Rights Holder Confirmation:
The partner confirms they own or control the necessary rights, licenses, permissions, music clearances, performer releases, artwork rights, and distribution permissions required to stream this title on SourceTV.

SourceTV Rights:
SourceTV may display the title, poster, trailer, title metadata, artwork, thumbnails, descriptions, and related promotional assets on SourceTV-owned services and marketing channels.

Term:
The license term will begin and end on the dates entered in the final contract record.

Termination:
Either party may request removal or review according to the final agreement terms.

Signature:
By signing, the partner confirms that the information provided is accurate and that they have authority to enter into this agreement.

This is a draft contract template and should be reviewed by legal counsel before production use.`;
}