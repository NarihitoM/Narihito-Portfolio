"use client";

import { useEffect, useRef, useState } from "react";

function isInAppBrowser(ua: string) {
  return /Instagram|FBAN|FBAV|Telegram|Line\//i.test(ua);
}

export function InAppBrowserBanner() {
  const [show, setShow] = useState(false);
  const [copied, setCopied] = useState(false);
  const bannerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // navigator is unavailable during SSR, so this can only be detected after mount.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    if (isInAppBrowser(navigator.userAgent)) setShow(true);
  }, []);

  useEffect(() => {
    const banner = bannerRef.current;
    if (!show || !banner) return;
    const root = document.documentElement;
    const observer = new ResizeObserver(() => {
      root.style.setProperty("--in-app-banner", `${banner.offsetHeight}px`);
    });
    observer.observe(banner);
    return () => {
      observer.disconnect();
      root.style.removeProperty("--in-app-banner");
    };
  }, [show]);

  if (!show) return null;

  const copyLink = () => {
    navigator.clipboard.writeText(window.location.href).then(() => {
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    });
  };

  return (
    <div
      ref={bannerRef}
      className="fixed inset-x-0 bottom-0 z-[110] flex items-center justify-between gap-3 bg-violet px-4 pt-2.5 pb-[calc(0.625rem+env(safe-area-inset-bottom))] font-body fs-13 text-wire"
    >
      <span>
        Open in Chrome or Safari for a better experience.
      </span>
      <div className="flex shrink-0 items-center gap-2">
        <button
          type="button"
          onClick={copyLink}
          className="rounded-[4px] bg-wire px-3 py-1.5 font-semibold text-violet transition-transform active:scale-95"
        >
          {copied ? "Copied" : "Copy link"}
        </button>
        <button
          type="button"
          aria-label="Dismiss"
          onClick={() => setShow(false)}
          className="px-1 text-wire transition-transform active:scale-90"
        >
          ✕
        </button>
      </div>
    </div>
  );
}
