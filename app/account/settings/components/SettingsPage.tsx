"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import SettingsSection from "./SettingsSection";
import SettingsToggle from "./SettingsToggle";

type SettingsState = {
  autoplayNext: boolean;
  autoplayPreviews: boolean;
  reduceMotion: boolean;
  dataSaver: boolean;
  subtitleLanguage: string;
  audioLanguage: string;
  captionSize: string;
  playbackQuality: string;
};

const defaultSettings: SettingsState = {
  autoplayNext: true,
  autoplayPreviews: true,
  reduceMotion: false,
  dataSaver: false,
  subtitleLanguage: "English",
  audioLanguage: "English",
  captionSize: "Medium",
  playbackQuality: "Auto",
};

const STORAGE_KEY = "sourcetv_viewer_settings";

function readSettings(): SettingsState {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);

    if (!stored) {
      return defaultSettings;
    }

    const parsed = JSON.parse(stored);

    return {
      ...defaultSettings,
      ...parsed,
    };
  } catch {
    return defaultSettings;
  }
}

export default function SettingsPage() {
  const [settings, setSettings] =
    useState<SettingsState>(defaultSettings);

  const [ready, setReady] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    setSettings(readSettings());
    setReady(true);
  }, []);

  function updateSetting<K extends keyof SettingsState>(
    key: K,
    value: SettingsState[K]
  ) {
    setSettings((current) => ({
      ...current,
      [key]: value,
    }));

    setSaved(false);
  }

  function saveSettings() {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify(settings)
    );

    document.documentElement.dataset.reduceMotion =
      settings.reduceMotion ? "true" : "false";

    window.dispatchEvent(
      new CustomEvent("sourcetv-settings-changed", {
        detail: settings,
      })
    );

    setSaved(true);

    window.setTimeout(() => {
      setSaved(false);
    }, 2200);
  }

  function resetSettings() {
    setSettings(defaultSettings);
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify(defaultSettings)
    );

    document.documentElement.dataset.reduceMotion =
      "false";

    window.dispatchEvent(
      new CustomEvent("sourcetv-settings-changed", {
        detail: defaultSettings,
      })
    );

    setSaved(true);
  }

  function clearContinueWatching() {
    const confirmed = window.confirm(
      "Clear Continue Watching for this browser?"
    );

    if (!confirmed) return;

    const keysToRemove: string[] = [];

    for (let index = 0; index < localStorage.length; index += 1) {
      const key = localStorage.key(index);

      if (
        key &&
        (key === "sourcetv_continue" ||
          key.startsWith("sourcetv_continue_"))
      ) {
        keysToRemove.push(key);
      }
    }

    keysToRemove.forEach((key) =>
      localStorage.removeItem(key)
    );

    window.dispatchEvent(
      new CustomEvent("sourcetv-continue-cleared")
    );

    alert("Continue Watching was cleared.");
  }

  function clearSearchHistory() {
    localStorage.removeItem("sourcetv_search_history");

    window.dispatchEvent(
      new CustomEvent("sourcetv-search-history-cleared")
    );

    alert("Search history was cleared.");
  }

  function resetRecommendations() {
    const keysToRemove: string[] = [];

    for (let index = 0; index < localStorage.length; index += 1) {
      const key = localStorage.key(index);

      if (
        key &&
        key.startsWith(
          "sourcetv_recommendation_memory_"
        )
      ) {
        keysToRemove.push(key);
      }
    }

    keysToRemove.forEach((key) =>
      localStorage.removeItem(key)
    );

    window.dispatchEvent(
      new CustomEvent(
        "sourcetv-recommendations-reset"
      )
    );

    alert("Recommendations were reset.");
  }

  if (!ready) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-black text-white">
        <div className="h-1 w-52 overflow-hidden rounded-full bg-white/10">
          <div className="h-full w-1/2 animate-pulse rounded-full bg-sky-300" />
        </div>
      </main>
    );
  }

  return (
    <main className="relative min-h-screen overflow-hidden bg-black px-4 pb-24 pt-28 text-white md:px-12 md:pb-20 md:pt-32">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_18%_12%,rgba(56,189,248,0.12),transparent_30%),radial-gradient(circle_at_84%_18%,rgba(56,189,248,0.06),transparent_28%),linear-gradient(to_bottom,#020617_0%,#000_68%)]" />

      <div className="pointer-events-none absolute inset-x-0 bottom-[-18vh] h-[42vh] bg-[radial-gradient(ellipse_at_bottom,rgba(56,189,248,0.11),transparent_68%)] blur-3xl" />

      <div className="relative z-10 mx-auto max-w-5xl">
        <div className="max-w-3xl">
          <p className="text-[10px] font-black uppercase tracking-[0.36em] text-sky-300 md:text-xs">
            Viewing Preferences
          </p>

          <h1 className="mt-4 text-4xl font-black tracking-[-0.04em] md:text-6xl">
            Settings
          </h1>

          <p className="mt-4 max-w-2xl text-sm leading-7 text-white/45 md:text-base">
            Control playback, previews, accessibility,
            languages, and personalization across SourceTV.
          </p>
        </div>

        <div className="mt-10 space-y-5">
          <SettingsSection
            eyebrow="Playback"
            title="Playback Preferences"
            description="Choose how SourceTV plays titles and previews."
          >
            <SettingsToggle
              label="Autoplay next episode"
              description="Automatically begin the next available episode."
              checked={settings.autoplayNext}
              onChange={(value) =>
                updateSetting("autoplayNext", value)
              }
            />

            <SettingsToggle
              label="Autoplay previews"
              description="Allow trailers and previews to begin automatically."
              checked={settings.autoplayPreviews}
              onChange={(value) =>
                updateSetting(
                  "autoplayPreviews",
                  value
                )
              }
            />

            <SettingsToggle
              label="Data saver"
              description="Prefer lower-bandwidth playback where supported."
              checked={settings.dataSaver}
              onChange={(value) =>
                updateSetting("dataSaver", value)
              }
            />

            <SettingSelect
              label="Playback quality"
              description="Choose the preferred streaming quality."
              value={settings.playbackQuality}
              options={[
                "Auto",
                "Data Saver",
                "High",
                "Best Available",
              ]}
              onChange={(value) =>
                updateSetting(
                  "playbackQuality",
                  value
                )
              }
            />
          </SettingsSection>

          <SettingsSection
            eyebrow="Accessibility"
            title="Language & Accessibility"
            description="Set default audio, subtitle, and motion preferences."
          >
            <SettingSelect
              label="Subtitle language"
              description="Preferred language for available subtitles."
              value={settings.subtitleLanguage}
              options={[
                "English",
                "Spanish",
                "French",
                "German",
                "Portuguese",
                "Off",
              ]}
              onChange={(value) =>
                updateSetting(
                  "subtitleLanguage",
                  value
                )
              }
            />

            <SettingSelect
              label="Audio language"
              description="Preferred language for available audio tracks."
              value={settings.audioLanguage}
              options={[
                "English",
                "Spanish",
                "French",
                "German",
                "Portuguese",
                "Original",
              ]}
              onChange={(value) =>
                updateSetting(
                  "audioLanguage",
                  value
                )
              }
            />

            <SettingSelect
              label="Caption size"
              description="Choose the default caption display size."
              value={settings.captionSize}
              options={[
                "Small",
                "Medium",
                "Large",
                "Extra Large",
              ]}
              onChange={(value) =>
                updateSetting("captionSize", value)
              }
            />

            <SettingsToggle
              label="Reduce motion"
              description="Use fewer interface animations and transitions."
              checked={settings.reduceMotion}
              onChange={(value) =>
                updateSetting("reduceMotion", value)
              }
            />
          </SettingsSection>

          <SettingsSection
            eyebrow="Personalization"
            title="History & Recommendations"
            description="Clear stored activity and reset personalized suggestions."
          >
            <SettingsAction
              label="Clear Continue Watching"
              description="Remove saved playback progress from this browser."
              onClick={clearContinueWatching}
            />

            <SettingsAction
              label="Reset Recommendations"
              description="Remove locally stored recommendation memory."
              onClick={resetRecommendations}
            />

            <SettingsAction
              label="Clear Search History"
              description="Remove recent SourceTV searches from this browser."
              onClick={clearSearchHistory}
            />
          </SettingsSection>
        </div>

        <div className="sticky bottom-4 mt-8 flex flex-wrap items-center justify-between gap-3 rounded-[1.25rem] border border-white/10 bg-black/82 p-3 shadow-[0_20px_70px_rgba(0,0,0,0.55)] backdrop-blur-2xl">
          <div className="px-2">
            <p className="text-sm font-bold text-white/70">
              {saved
                ? "Settings saved"
                : "Save your changes"}
            </p>

            <p className="mt-0.5 text-xs text-white/30">
              Preferences are currently stored in this browser.
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={resetSettings}
              className="rounded-md border border-white/12 bg-white/[0.04] px-5 py-3 text-sm font-black text-white/55 transition hover:border-white/25 hover:text-white"
            >
              Reset
            </button>

            <button
              type="button"
              onClick={saveSettings}
              className="rounded-md bg-white px-6 py-3 text-sm font-black text-black transition hover:bg-sky-200"
            >
              {saved ? "Saved" : "Save Settings"}
            </button>
          </div>
        </div>

        <div className="mt-8 flex flex-wrap gap-3">
          <Link
            href="/account"
            className="rounded-md border border-white/12 bg-white/[0.04] px-6 py-3 text-sm font-black text-white/62 transition hover:border-sky-300/35 hover:bg-sky-300/[0.07] hover:text-sky-100"
          >
            Back to Account
          </Link>

          <Link
            href="/browse"
            className="rounded-md bg-white px-6 py-3 text-sm font-black text-black transition hover:bg-sky-200"
          >
            Back to Browse
          </Link>
        </div>
      </div>
    </main>
  );
}

function SettingSelect({
  label,
  description,
  value,
  options,
  onChange,
}: {
  label: string;
  description?: string;
  value: string;
  options: string[];
  onChange: (value: string) => void;
}) {
  return (
    <div className="flex flex-col gap-3 rounded-xl border border-white/[0.06] bg-black/22 px-4 py-3.5 sm:flex-row sm:items-center sm:justify-between">
      <div className="min-w-0">
        <p className="text-sm font-bold text-white/80">
          {label}
        </p>

        {description && (
          <p className="mt-1 text-xs leading-5 text-white/35">
            {description}
          </p>
        )}
      </div>

      <select
        value={value}
        onChange={(event) =>
          onChange(event.target.value)
        }
        className="min-w-[170px] rounded-xl border border-white/10 bg-black/70 px-4 py-2.5 text-sm font-bold text-white/75 outline-none transition focus:border-sky-300/50"
      >
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
    </div>
  );
}

function SettingsAction({
  label,
  description,
  onClick,
}: {
  label: string;
  description?: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="group flex w-full items-center justify-between gap-4 rounded-xl border border-white/[0.06] bg-black/22 px-4 py-3.5 text-left transition hover:border-sky-300/25 hover:bg-sky-300/[0.05]"
    >
      <span>
        <span className="block text-sm font-bold text-white/78 group-hover:text-white">
          {label}
        </span>

        {description && (
          <span className="mt-1 block text-xs leading-5 text-white/35">
            {description}
          </span>
        )}
      </span>

      <span className="text-lg text-white/25 transition group-hover:translate-x-0.5 group-hover:text-sky-200">
        →
      </span>
    </button>
  );
}