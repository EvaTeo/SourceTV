import { getCurrentUser } from "@/app/lib/auth";
import { redirect } from "next/navigation";
import ProfileSelector from "../components/ProfileSelector";

export default async function SelectProfilePage() {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/login");
  }

  return (
    <ProfileSelector
      account={{
        id: user.id,
        name: user.name,
        email: user.email,
      }}
    />
  );
}