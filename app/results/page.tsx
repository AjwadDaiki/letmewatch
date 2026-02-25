import { Suspense } from "react";
import ResultsClient from "@/components/ResultsClient";

function LoadingFallback() {
  return (
    <div className="paper-grain min-h-screen flex items-center justify-center px-4">
      <div className="bistro-card rounded-2xl px-5 py-4 text-sm text-[var(--charcoal)] flex items-center gap-2">
        {[0, 1, 2].map((i) => (
          <div
            key={i}
            className="h-2 w-2 rounded-full bg-[var(--wine)]"
            style={{ animation: `float-soft 1s ease-in-out ${i * 0.12}s infinite` }}
          />
        ))}
        <span>Le concierge prepare ta selection...</span>
      </div>
    </div>
  );
}

export default function ResultsPage() {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <ResultsClient />
    </Suspense>
  );
}
