import { redirect } from "next/navigation";

export default async function PartnerProjectDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  await params;

  redirect("/partner/projects");
}