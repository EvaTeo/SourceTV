import { prisma } from "@/app/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

const PUBLIC_MAINTENANCE_ROUTES = [
  "/maintenance",
  "/login",
];

const ADMIN_ROUTES = [
  "/admin",
  "/api/admin",
  "/api/auth",
];

function matchesRoute(
  pathname: string,
  routes: string[]
) {
  return routes.some(
    (route) =>
      pathname === route ||
      pathname.startsWith(`${route}/`)
  );
}

export async function proxy(
  request: NextRequest
) {
  const { pathname } = request.nextUrl;

  if (
    matchesRoute(
      pathname,
      PUBLIC_MAINTENANCE_ROUTES
    ) ||
    matchesRoute(pathname, ADMIN_ROUTES)
  ) {
    return NextResponse.next();
  }

  try {
    const settings =
      await prisma.platformSettings.findFirst({
        orderBy: {
          updatedAt: "desc",
        },
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

    return NextResponse.next();
  } catch (error) {
    console.error(
      "MAINTENANCE MODE CHECK ERROR:",
      error
    );

    return NextResponse.next();
  }
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|robots.txt|sitemap.xml|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico|css|js|map|woff|woff2|ttf|mp4|webm|m3u8|ts)$).*)",
  ],
};