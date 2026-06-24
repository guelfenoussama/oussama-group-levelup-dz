import { useEffect } from "react";
import posthog from "posthog-js";

const POSTHOG_KEY = import.meta.env.VITE_POSTHOG_KEY;

export function PostHogProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    if (!POSTHOG_KEY) return;
    if (typeof window === "undefined") return;
    if (posthog.__loaded) return;

    posthog.init(POSTHOG_KEY, {
      api_host: "https://app.posthog.com",
      capture_pageview: true,
      capture_pageleave: true,
      loaded: (ph) => {
        if (import.meta.env.DEV) ph.debug();
      },
    });

    return () => {
      posthog.shutdown();
    };
  }, []);

  return <>{children}</>;
}
