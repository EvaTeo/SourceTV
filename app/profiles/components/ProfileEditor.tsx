"use client";

import {
  type ChangeEvent,
  useEffect,
  useState,
} from "react";
import {
  avatarColors,
  type SourceProfile,
} from "../lib/profileStorage";
import ProfileAvatar from "./ProfileAvatar";

export default function ProfileEditor({
  profile,
  creating,
  profileCount,
  canDelete,
  onClose,
  onSave,
  onDelete,
}: {
  profile: SourceProfile;
  creating: boolean;
  profileCount: number;
  canDelete: boolean;
  onClose: () => void;
  onSave: (profile: SourceProfile) => void;
  onDelete: () => void;
}) {
  const [draft, setDraft] = useState(profile);
  const [name, setName] = useState(profile.name);

  useEffect(() => {
    setDraft(profile);
    setName(profile.name);
  }, [profile]);

  function updateColor(color: string) {
    setDraft((current) => ({
      ...current,
      color,
    }));
  }

  function uploadAvatar(
    event: ChangeEvent<HTMLInputElement>
  ) {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    if (!file.type.startsWith("image/")) {
      alert("Please choose an image file.");
      return;
    }

    const reader = new FileReader();

    reader.onload = () => {
      setDraft((current) => ({
        ...current,
        image: String(reader.result || ""),
      }));
    };

    reader.readAsDataURL(file);
  }

  function removeUploadedPhoto() {
    setDraft((current) => ({
      ...current,
      image: "",
    }));
  }

  function save() {
    const cleanName =
      name.trim() ||
      (creating
        ? `Profile ${profileCount + 1}`
        : draft.name || "Profile");

    onSave({
      ...draft,
      name: cleanName,
      avatar:
        cleanName.charAt(0).toUpperCase() || "P",
    });
  }

  const previewName =
    name.trim() || draft.name || "New Profile";

  return (
    <div className="fixed inset-0 z-[300] flex items-end justify-center bg-black/66 px-4 backdrop-blur-sm md:items-center">
      <div className="relative w-full max-w-lg overflow-hidden rounded-t-[2rem] border border-white/10 bg-black/86 p-5 shadow-[0_0_90px_rgba(0,0,0,0.72)] backdrop-blur-3xl animate-[profileEditorIn_260ms_ease-out] md:rounded-[2rem] md:p-7">
        <div className="pointer-events-none absolute left-0 top-0 h-px w-full bg-gradient-to-r from-transparent via-sky-300/60 to-transparent shadow-[0_0_22px_rgba(56,189,248,0.8)]" />

        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-[10px] font-black uppercase tracking-[0.35em] text-sky-300">
              {creating
                ? "Create Profile"
                : "Edit Profile"}
            </p>

            <h2 className="mt-2 text-3xl font-black">
              {creating
                ? "New Profile"
                : draft.name || "Profile"}
            </h2>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/[0.04] text-xl font-black text-white/65 transition hover:border-sky-300/40 hover:bg-sky-300/10 hover:text-white"
            aria-label="Close profile editor"
          >
            ×
          </button>
        </div>

        <div className="mt-7 grid gap-6 md:grid-cols-[150px_1fr] md:items-start">
          <div className="mx-auto w-[150px]">
            <ProfileAvatar
              profile={{
                ...draft,
                name: previewName,
                avatar:
                  previewName.charAt(0).toUpperCase() ||
                  "P",
              }}
              active
            />

            <label className="mt-4 block cursor-pointer rounded-md border border-white/15 bg-white/[0.05] px-4 py-3 text-center text-xs font-black text-white/70 backdrop-blur-xl transition hover:border-sky-300/50 hover:bg-sky-300/10 hover:text-sky-200">
              Upload Photo

              <input
                type="file"
                accept="image/*"
                onChange={uploadAvatar}
                className="hidden"
              />
            </label>

            {draft.image && (
              <button
                type="button"
                onClick={removeUploadedPhoto}
                className="mt-2 w-full text-center text-[10px] font-black uppercase tracking-[0.14em] text-white/35 transition hover:text-red-200"
              >
                Remove Photo
              </button>
            )}
          </div>

          <div>
            <label className="text-xs font-black uppercase tracking-[0.25em] text-white/45">
              Profile Name
            </label>

            <input
              value={name}
              onChange={(event) =>
                setName(event.target.value)
              }
              className="mt-3 w-full rounded-2xl border border-white/10 bg-black/45 px-4 py-3 font-bold text-white outline-none backdrop-blur-xl placeholder:text-white/30 focus:border-sky-300/60"
              placeholder="Profile name"
              maxLength={30}
              autoFocus
            />

            <p className="mt-5 text-xs font-black uppercase tracking-[0.25em] text-white/45">
              Avatar Glow
            </p>

            <div className="mt-3 grid grid-cols-6 gap-2">
              {avatarColors.map((color) => (
                <button
                  key={color}
                  type="button"
                  onClick={() => updateColor(color)}
                  className={`h-9 rounded-full bg-gradient-to-br ${color} transition hover:scale-110 ${
                    draft.color === color
                      ? "ring-2 ring-sky-300 ring-offset-2 ring-offset-black"
                      : ""
                  }`}
                  aria-label="Choose avatar color"
                />
              ))}
            </div>

            <div className="mt-7 flex gap-3">
              <button
                type="button"
                onClick={save}
                className="flex-1 rounded-md bg-white px-6 py-3 text-sm font-black text-black shadow-[0_12px_30px_rgba(0,0,0,0.32)] transition hover:bg-sky-200"
              >
                {creating ? "Create" : "Save"}
              </button>

              <button
                type="button"
                onClick={onClose}
                className="flex-1 rounded-md border border-white/15 bg-white/[0.04] px-6 py-3 text-sm font-black text-white/65 backdrop-blur-xl transition hover:border-white/30 hover:text-white"
              >
                Cancel
              </button>
            </div>

            {!creating && (
              <button
                type="button"
                onClick={onDelete}
                disabled={!canDelete}
                className="mt-5 text-xs font-black uppercase tracking-[0.18em] text-red-300/55 transition hover:text-red-200 disabled:cursor-not-allowed disabled:opacity-30"
              >
                Delete Profile
              </button>
            )}

            <p className="mt-4 text-xs leading-5 text-white/35">
              Custom photos are optional. They are
              currently stored in this browser and can
              later be moved to account storage.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}