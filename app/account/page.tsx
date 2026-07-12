import { getCurrentUser } from "@/app/lib/auth";
import { redirect } from "next/navigation";
import AccountOverview from "./components/AccountOverview";

export default async function AccountPage() {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/login");
  }

  return (
    <AccountOverview
      user={{
        id: user.id,
        name: user.name,
        email: user.email,
        subscriptionTier: user.subscriptionTier,
        subscriptionStatus: user.subscriptionStatus,
      }}
    />
  );
}