import { prisma } from "@/app/lib/prisma";

export async function getPlatformSettings() {
  return prisma.platformSettings.findFirst();
}

export async function updatePlatformSettings(
  data: Record<string, unknown>
) {
  const existing =
    await prisma.platformSettings.findFirst();

  if (!existing) {
    return prisma.platformSettings.create({
      data,
    });
  }

  return prisma.platformSettings.update({
    where: {
      id: existing.id,
    },
    data,
  });
}