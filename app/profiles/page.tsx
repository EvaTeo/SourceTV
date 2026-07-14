import { getCurrentUser } from "@/app/lib/auth";
import { prisma } from "@/app/lib/prisma";
import { redirect } from "next/navigation";
import ProfilesClient from "./ProfilesClient";

export default async function ProfilesPage() {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/login");
  }

  const settings =
    await prisma.platformSettings.findFirst({
      select: {
        maxProfiles: true,
      },
    });

  return (
    <ProfilesClient
      account={{
        id: user.id,
        name: user.name,
        email: user.email,
      }}
      maxProfiles={
        settings?.maxProfiles ?? 5
      }
    />
  );
}