import PartnerHeader from "@/app/components/PartnerHeader";
import { redirect } from "next/navigation";
import { getCurrentUser } from "@/app/lib/auth";
import PartnerContractDetailClient from "./PartnerContractDetailClient";

export default async function PartnerContractDetailPage() {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/login");
  }

  if (user.role !== "partner" && user.role !== "admin") {
    redirect("/partner/apply");
  }

  return (
    <>
      <PartnerHeader />
      <PartnerContractDetailClient />
    </>
  );
}