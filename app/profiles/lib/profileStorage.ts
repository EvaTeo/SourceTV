export type ProfileAccount = {
  id: string;
  name?: string | null;
  email: string;
};

export type SourceProfile = {
  id: string;
  name: string;
  avatar: string;
  color?: string;
  image?: string;
};

export const MAX_PROFILES = 5;

export const avatarColors = [
  "from-sky-300 to-blue-600",
  "from-fuchsia-300 to-purple-700",
  "from-emerald-300 to-teal-700",
  "from-amber-300 to-orange-700",
  "from-rose-300 to-red-700",
  "from-white to-zinc-500",
];

function getProfileStorageKey(accountId: string) {
  return `sourcetv_profiles_${accountId}`;
}

function getActiveProfileStorageKey(accountId: string) {
  return `sourcetv_active_profile_${accountId}`;
}

function cleanAccountName(account: ProfileAccount) {
  const fullName = account.name?.trim();

  if (fullName) {
    return fullName.split(/\s+/)[0];
  }

  const emailName = account.email
    .split("@")[0]
    .replace(/[._-]+/g, " ")
    .trim();

  if (emailName) {
    return emailName
      .split(/\s+/)[0]
      .replace(/^./, (letter) => letter.toUpperCase());
  }

  return "Profile 1";
}

export function createDefaultProfile(
  account: ProfileAccount
): SourceProfile {
  const name = cleanAccountName(account);

  return {
    id: `main-${account.id}`,
    name,
    avatar: name.charAt(0).toUpperCase() || "P",
    color: "from-sky-300 to-blue-600",
    image: "",
  };
}

export function createNewProfile(): SourceProfile {
  const id =
    typeof crypto !== "undefined" &&
    typeof crypto.randomUUID === "function"
      ? crypto.randomUUID()
      : `profile-${Date.now()}`;

  return {
    id,
    name: "",
    avatar: "+",
    color: "from-sky-300 to-blue-600",
    image: "",
  };
}

function repairProfile(
  profile: Partial<SourceProfile>,
  index: number
): SourceProfile {
  const name =
    typeof profile.name === "string" && profile.name.trim()
      ? profile.name.trim()
      : `Profile ${index + 1}`;

  return {
    id: profile.id || `profile-${index}-${Date.now()}`,
    name,
    avatar:
      typeof profile.avatar === "string" && profile.avatar.trim()
        ? profile.avatar.trim().charAt(0).toUpperCase()
        : name.charAt(0).toUpperCase() || "P",
    color:
      profile.color ||
      avatarColors[index % avatarColors.length] ||
      avatarColors[0],
    image: profile.image || "",
  };
}

export function loadProfiles(
  account: ProfileAccount
): SourceProfile[] {
  if (typeof window === "undefined") {
    return [createDefaultProfile(account)];
  }

  try {
    const accountKey = getProfileStorageKey(account.id);

    const accountStored = localStorage.getItem(accountKey);
    const legacyStored = localStorage.getItem("sourcetv_profiles");
    const rawStored = accountStored || legacyStored;

    if (!rawStored) {
      const defaults = [createDefaultProfile(account)];
      saveProfiles(account.id, defaults);
      return defaults;
    }

    const parsed = JSON.parse(rawStored);

    if (!Array.isArray(parsed) || parsed.length === 0) {
      const defaults = [createDefaultProfile(account)];
      saveProfiles(account.id, defaults);
      return defaults;
    }

    const repaired = parsed
      .slice(0, MAX_PROFILES)
      .map((profile, index) =>
        repairProfile(profile as Partial<SourceProfile>, index)
      );

    saveProfiles(account.id, repaired);

    return repaired;
  } catch (error) {
    console.error("PROFILE STORAGE ERROR:", error);

    const defaults = [createDefaultProfile(account)];
    saveProfiles(account.id, defaults);

    return defaults;
  }
}

export function saveProfiles(
  accountId: string,
  profiles: SourceProfile[]
) {
  if (typeof window === "undefined") {
    return;
  }

  const safeProfiles = profiles.slice(0, MAX_PROFILES);

  localStorage.setItem(
    getProfileStorageKey(accountId),
    JSON.stringify(safeProfiles)
  );

  // Keep legacy keys synchronized because existing SourceTV components
  // currently read these keys.
  localStorage.setItem(
    "sourcetv_profiles",
    JSON.stringify(safeProfiles)
  );
}

export function getActiveProfile(
  accountId: string
): SourceProfile | null {
  if (typeof window === "undefined") {
    return null;
  }

  try {
    const accountStored = localStorage.getItem(
      getActiveProfileStorageKey(accountId)
    );

    const legacyStored = localStorage.getItem(
      "sourcetv_active_profile"
    );

    const rawStored = accountStored || legacyStored;

    if (!rawStored) {
      return null;
    }

    return repairProfile(
      JSON.parse(rawStored) as Partial<SourceProfile>,
      0
    );
  } catch {
    return null;
  }
}

export function setActiveProfile(
  accountId: string,
  profile: SourceProfile
) {
  if (typeof window === "undefined") {
    return;
  }

  const serialized = JSON.stringify(profile);

  localStorage.setItem(
    getActiveProfileStorageKey(accountId),
    serialized
  );

  // Existing Browse, recommendation, and Continue Watching components
  // currently use this legacy key.
  localStorage.setItem(
    "sourcetv_active_profile",
    serialized
  );

  window.dispatchEvent(
    new CustomEvent("sourcetv-profile-changed", {
      detail: profile,
    })
  );
}

export function clearActiveProfile(accountId: string) {
  if (typeof window === "undefined") {
    return;
  }

  localStorage.removeItem(
    getActiveProfileStorageKey(accountId)
  );

  localStorage.removeItem("sourcetv_active_profile");

  window.dispatchEvent(
    new CustomEvent("sourcetv-profile-changed")
  );
}