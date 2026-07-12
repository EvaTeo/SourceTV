export type StoredProfile = {
  id: string;
  name: string;
  avatar: string;
  color?: string;
  image?: string;
};

type StoredUser = {
  id?: string;
  name?: string | null;
  email?: string | null;
};

function getFallbackProfile(): StoredProfile {
  let user: StoredUser | null = null;

  try {
    user = JSON.parse(
      localStorage.getItem("sourcetvUser") || "null"
    );
  } catch {
    user = null;
  }

  const accountName =
    user?.name?.trim() ||
    user?.email
      ?.split("@")[0]
      .replace(/[._-]+/g, " ")
      .trim() ||
    "Profile";

  const firstName =
    accountName.split(/\s+/)[0] || "Profile";

  return {
    id: user?.id ? `main-${user.id}` : "main-profile",
    name: firstName,
    avatar: firstName.charAt(0).toUpperCase() || "P",
    color: "from-sky-300 to-blue-600",
    image: "",
  };
}

export function readActiveProfile(): StoredProfile {
  try {
    const stored = localStorage.getItem(
      "sourcetv_active_profile"
    );

    if (!stored) {
      return getFallbackProfile();
    }

    const parsed = JSON.parse(stored);

    if (!parsed?.id || !parsed?.name) {
      return getFallbackProfile();
    }

    return {
      id: parsed.id,
      name: parsed.name,
      avatar:
        parsed.avatar ||
        parsed.name.charAt(0).toUpperCase() ||
        "P",
      color:
        parsed.color ||
        "from-sky-300 to-blue-600",
      image: parsed.image || "",
    };
  } catch {
    return getFallbackProfile();
  }
}