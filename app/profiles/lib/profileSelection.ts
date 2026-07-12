import {
  setActiveProfile,
  type SourceProfile,
} from "./profileStorage";

export function selectProfileAndNavigate({
  accountId,
  profile,
  destination = "/browse",
}: {
  accountId: string;
  profile: SourceProfile;
  destination?: string;
}) {
  setActiveProfile(accountId, profile);

  document.body.classList.add("profile-selection-exit");

  window.setTimeout(() => {
    window.location.href = destination;
  }, 480);
}