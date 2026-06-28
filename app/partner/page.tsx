import PartnerHeader from "@/app/components/PartnerHeader";
import { redirect } from "next/navigation";
import { getCurrentUser } from "@/app/lib/auth";
import PartnerDashboardClient from "./PartnerDashboardClient";

export default async function PartnerDashboardPage() {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/login");
  }

  if (user.role !== "partner" && user.role !== "admin") {
    redirect("/partner/apply");
  }

  return (
    <>
      <PartnerDashboardClient />
    </>
  );
}