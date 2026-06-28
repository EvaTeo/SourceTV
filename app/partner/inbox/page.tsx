import PartnerHeader from "@/app/components/PartnerHeader";
import { redirect } from "next/navigation";
import { getCurrentUser } from "@/app/lib/auth";
import PartnerInboxClient from "./PartnerInboxClient";

export default async function PartnerInboxPage() {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/login");
  }

  if (user.role !== "partner" && user.role !== "admin") {
    redirect("/partner/apply");
  }

  return (
    <>
      <PartnerInboxClient />
    </>
  );
}