import { redirect } from "next/navigation";
import { getCurrentUser } from "@/app/lib/auth";
import CreatorDashboardClient from "./CreatorDashboardClient";

export default async function CreatorDashboardPage() {
  const user = await getCurrentUser();

  if (!user || (user.role !== "creator" && user.role !== "admin")) {
    redirect("/login");
  }

return (
  <CreatorDashboardClient
    user={{
      ...user,
      name: user.name || "",
    }}
  />
);
}