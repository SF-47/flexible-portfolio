"use client";

import { useEffect } from "react";

// On refresh (or back/forward) start at the top instead of the last position.
// Fresh visits keep their #section, so shared links such as /#contact still work.
export default function ScrollReset() {
  useEffect(() => {
    if ("scrollRestoration" in history) {
      history.scrollRestoration = "manual";
    }

    const [navigation] = performance.getEntriesByType(
      "navigation",
    ) as PerformanceNavigationTiming[];

    if (navigation?.type !== "reload") return;

    if (window.location.hash) {
      history.replaceState(
        null,
        "",
        window.location.pathname + window.location.search,
      );
    }

    window.scrollTo({ top: 0, behavior: "instant" });
  }, []);

  return null;
}
