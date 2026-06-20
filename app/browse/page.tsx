import { Suspense } from "react";
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
      <BrowseClient />
    </Suspense>
  );
}