import { Suspense } from "react";
import BannerAd from "@/app/components/BannerAd";
import BrowseClient from "./BrowseClient";

export default function BrowsePage() {
  return (
    <Suspense
      fallback={
        <main className="min-h-screen bg-black px-6 pt-28 text-white">
          Loading SourceTV...
        </main>
      }
    >
      <main className="min-h-screen bg-black">
        <BrowseClient />

        <div className="pb-12 pt-4">
          <BannerAd />
        </div>
      </main>
    </Suspense>
  );
}