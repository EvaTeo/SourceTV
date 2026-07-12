import { getCurrentUser } from "@/app/lib/auth";
import { redirect } from "next/navigation";
import SettingsPage from "./components/SettingsPage";

export default async function AccountSettingsPage() {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/login");
  }

  return <SettingsPage />;
}