"use client";

import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
  useRef,
  Suspense,
} from "react";
import { usePathname, useSearchParams } from "next/navigation";
import { Loader2 } from "lucide-react";

interface RouteProgressContextType {
  startProgress: () => void;
  completeProgress: () => void;
  isLoading: boolean;
}

const RouteProgressContext = createContext<RouteProgressContextType>({
  startProgress: () => {},
  completeProgress: () => {},
  isLoading: false,
});

export function useRouteProgress() {
  return useContext(RouteProgressContext);
}

function RouteProgressBarInner() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [progress, setProgress] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const cleanupTimerRef = useRef<NodeJS.Timeout | null>(null);
  const previousUrlRef = useRef<string>("");

  const clearTimers = useCallback(() => {
    if (timerRef.current) clearInterval(timerRef.current);
    if (cleanupTimerRef.current) clearTimeout(cleanupTimerRef.current);
  }, []);

  const completeProgress = useCallback(() => {
    clearTimers();
    setProgress(100);
    setIsLoading(false);

    cleanupTimerRef.current = setTimeout(() => {
      setIsVisible(false);
      setProgress(0);
    }, 300);
  }, [clearTimers]);

  const startProgress = useCallback(() => {
    clearTimers();
    setIsVisible(true);
    setIsLoading(true);
    setProgress(15);

    timerRef.current = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 90) {
          return prev;
        }
        if (prev >= 70) {
          return prev + 2;
        }
        if (prev >= 40) {
          return prev + 6;
        }
        return prev + 12;
      });
    }, 150);

    // Safety timeout in case navigation stalls or is aborted
    cleanupTimerRef.current = setTimeout(() => {
      completeProgress();
    }, 10000);
  }, [clearTimers, completeProgress]);

  // Complete progress whenever URL path or params change
  useEffect(() => {
    const currentUrl = `${pathname}?${searchParams?.toString() || ""}`;
    if (previousUrlRef.current && previousUrlRef.current !== currentUrl) {
      completeProgress();
    }
    previousUrlRef.current = currentUrl;
  }, [pathname, searchParams, completeProgress]);

  // Intercept click events on links and popstate
  useEffect(() => {
    const handleDocumentClick = (event: MouseEvent) => {
      if (
        event.defaultPrevented ||
        event.button !== 0 ||
        event.metaKey ||
        event.ctrlKey ||
        event.shiftKey ||
        event.altKey
      ) {
        return;
      }

      const target = event.target as HTMLElement | null;
      if (!target) return;

      const anchor = target.closest("a");
      if (!anchor) return;

      const href = anchor.getAttribute("href");
      const targetAttr = anchor.getAttribute("target");
      const downloadAttr = anchor.getAttribute("download");

      if (
        !href ||
        href.startsWith("#") ||
        href.startsWith("mailto:") ||
        href.startsWith("tel:") ||
        href.startsWith("javascript:") ||
        targetAttr === "_blank" ||
        downloadAttr !== null
      ) {
        return;
      }

      // Check if internal navigation
      try {
        const destination = new URL(anchor.href, window.location.href);
        const current = new URL(window.location.href);

        if (destination.origin === current.origin) {
          const isSamePage =
            destination.pathname === current.pathname &&
            destination.search === current.search;

          if (!isSamePage) {
            startProgress();
          }
        }
      } catch {
        // Ignore invalid URLs
      }
    };

    const handlePopState = () => {
      startProgress();
    };

    // Monkey-patch history pushState / replaceState for programmatic routing
    const originalPushState = window.history.pushState;
    const originalReplaceState = window.history.replaceState;

    window.history.pushState = function (...args) {
      const url = args[2];
      if (url && typeof url === "string") {
        try {
          const dest = new URL(url, window.location.href);
          if (
            dest.pathname !== window.location.pathname ||
            dest.search !== window.location.search
          ) {
            startProgress();
          }
        } catch {
          // ignore
        }
      }
      return originalPushState.apply(this, args);
    };

    window.history.replaceState = function (...args) {
      return originalReplaceState.apply(this, args);
    };

    document.addEventListener("click", handleDocumentClick, true);
    window.addEventListener("popstate", handlePopState);

    return () => {
      document.removeEventListener("click", handleDocumentClick, true);
      window.removeEventListener("popstate", handlePopState);
      window.history.pushState = originalPushState;
      window.history.replaceState = originalReplaceState;
      clearTimers();
    };
  }, [startProgress, clearTimers]);

  return (
    <RouteProgressContext.Provider
      value={{ startProgress, completeProgress, isLoading }}
    >
      {/* Top Loading Progress Bar */}
      {isVisible && (
        <div
          className="fixed top-0 left-0 right-0 z-[9999] pointer-events-none transition-opacity duration-300"
          style={{ opacity: progress === 100 ? 0 : 1 }}
        >
          <div
            className="h-1 bg-gradient-to-r from-slate-900 via-indigo-600 to-indigo-400 shadow-sm transition-all ease-out"
            style={{
              width: `${progress}%`,
              transitionDuration: progress === 100 ? "150ms" : "200ms",
              boxShadow: "0 0 10px rgba(79, 70, 229, 0.7), 0 0 5px rgba(79, 70, 229, 0.4)",
            }}
          />
        </div>
      )}

      {/* Floating Transition Indicator (Top Right) */}
      {isLoading && (
        <div className="fixed top-3 right-3 z-[9999] pointer-events-none animate-in fade-in slide-in-from-top-1 duration-200">
          <div className="bg-white/95 backdrop-blur-md border border-slate-200/80 text-slate-800 text-[11px] font-semibold px-2.5 py-1 rounded-full shadow-lg flex items-center gap-1.5">
            <Loader2 className="w-3.5 h-3.5 animate-spin text-indigo-600 shrink-0" />
            <span>Loading...</span>
          </div>
        </div>
      )}
    </RouteProgressContext.Provider>
  );
}

export function RouteProgressBar() {
  return (
    <Suspense fallback={null}>
      <RouteProgressBarInner />
    </Suspense>
  );
}
