"use client";

import { useEffect, useState } from "react";
import { usePathname, useSearchParams } from "next/navigation";

export default function TransitionLoader() {
  const [isLoading, setIsLoading] = useState(false);
  const [loadingStartTime, setLoadingStartTime] = useState<number | null>(null);
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const triggerLoading = () => {
    setIsLoading(true);
    setLoadingStartTime(Date.now());
  };

  // Hide loader when the page pathname or search parameters change, enforcing a min delay
  useEffect(() => {
    if (!isLoading || !loadingStartTime) return;

    const MIN_LOAD_TIME = 300; // 300ms minimum delay
    const elapsedTime = Date.now() - loadingStartTime;
    const remainingTime = Math.max(0, MIN_LOAD_TIME - elapsedTime);

    const timer = setTimeout(() => {
      setIsLoading(false);
      setLoadingStartTime(null);
    }, remainingTime);

    return () => clearTimeout(timer);
  }, [pathname, searchParams, isLoading, loadingStartTime]);

  useEffect(() => {
    const handleLinkClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const anchor = target.closest("a");

      if (anchor) {
        const href = anchor.getAttribute("href");
        const targetAttr = anchor.getAttribute("target");

        // Only show loader for internal links that don't open in a new tab
        if (
          href &&
          href.startsWith("/") &&
          !href.startsWith("/#") &&
          targetAttr !== "_blank" &&
          !anchor.hasAttribute("download")
        ) {
          const currentUrl = window.location.pathname + window.location.search;
          if (href !== currentUrl) {
            triggerLoading();
          }
        }
      }
    };

    const handleFormSubmit = (e: SubmitEvent) => {
      const form = e.target as HTMLFormElement;
      // Show loader on form submission (login, demo login, etc.)
      if (form.getAttribute("target") !== "_blank") {
        triggerLoading();
      }
    };

    // Backup click listener for submit buttons, just in case React intercepts submit events
    const handleSubmitButtonClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const button = target.closest("button, input[type='submit']");
      if (button) {
        const type = button.getAttribute("type");
        const form = button.closest("form");
        if (form && type === "submit" && form.getAttribute("target") !== "_blank") {
          triggerLoading();
        }
      }
    };

    const handlePopState = () => {
      // Show loader for back/forward navigation
      triggerLoading();
    };

    document.addEventListener("click", handleLinkClick);
    document.addEventListener("click", handleSubmitButtonClick);
    document.addEventListener("submit", handleFormSubmit);
    window.addEventListener("popstate", handlePopState);

    return () => {
      document.removeEventListener("click", handleLinkClick);
      document.removeEventListener("click", handleSubmitButtonClick);
      document.removeEventListener("submit", handleFormSubmit);
      window.removeEventListener("popstate", handlePopState);
    };
  }, []);

  // Safety timeout: hide loader after 8 seconds if no navigation completed
  useEffect(() => {
    if (isLoading) {
      const timer = setTimeout(() => {
        setIsLoading(false);
        setLoadingStartTime(null);
      }, 8000);
      return () => clearTimeout(timer);
    }
  }, [isLoading]);

  if (!isLoading) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-surface transition-opacity duration-300">
      <div className="flex flex-col items-center gap-6">
        {/* Orbiting Ring Loader */}
        <div className="relative w-16 h-16 flex items-center justify-center">
          {/* Outer glowing ripple */}
          <div className="absolute inset-0 rounded-full bg-primary/10 animate-ping opacity-75" />
          {/* Main rotating ring */}
          <div className="w-12 h-12 rounded-full border-2 border-t-primary border-r-primary/30 border-b-transparent border-l-transparent animate-spin" />
          {/* Inner reverse-spinning ring */}
          <div className="absolute w-6 h-6 rounded-full border border-t-secondary border-r-transparent border-b-transparent border-l-secondary/40 animate-[spin_1s_infinite_linear_reverse]" />
        </div>

        {/* Elegant Logo / Loading Text */}
        <div className="text-center">
          <h2 className="font-serif italic text-2xl font-semibold text-primary tracking-wide animate-pulse">
            Hitaishi
          </h2>
          <p className="font-mono text-[9px] text-ink-soft tracking-widest uppercase mt-2.5">
            Loading...
          </p>
        </div>
      </div>
    </div>
  );
}
