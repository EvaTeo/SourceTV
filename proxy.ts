import { canBypassMaintenance } from "@/app/lib/maintenance";
import { prisma } from "@/app/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function proxy(
  request: NextRequest
) {
  const pathname =
    request.nextUrl.pathname;

  if (canBypassMaintenance(pathname)) {
    return NextResponse.next();
  }

  try {
    const settings =
      await prisma.platformSettings.findFirst({
        select: {
          maintenanceMode: true,
        },
      });

    if (settings?.maintenanceMode) {
      const maintenanceUrl =
        request.nextUrl.clone();

      maintenanceUrl.pathname =
        "/maintenance";

      maintenanceUrl.search = "";

      return NextResponse.redirect(
        maintenanceUrl
      );
    }
  } catch (error) {
    console.error(
      "MAINTENANCE MODE CHECK ERROR:",
      error
    );

    // Fail open so a database problem does not
    // permanently lock everyone out.
    return NextResponse.next();
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|robots.txt|sitemap.xml|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico)$).*)",
  ],
};