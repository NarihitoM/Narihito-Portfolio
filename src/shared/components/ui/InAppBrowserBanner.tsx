"use client";

import { useEffect, useState } from "react";

function isInAppBrowser(ua: string) {
  return /Instagram|FBAN|FBAV|Telegram|Line\//i.test(ua);
}

export function InAppBrowserBanner() {
  const [show, setShow] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    // navigator is unavailable during SSR, so this can only be detected after mount.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    if (isInAppBrowser(navigator.userAgent)) setShow(true);
  }, []);

  if (!show) return null;

  const copyLink = () => {
    navigator.clipboard.writeText(window.location.href).then(() => {
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    });
  };

  return (
    <div className="fixed inset-x-0 top-0 z-[110] flex items-center justify-between gap-3 bg-violet px-4 py-2.5 font-body text-[13px] text-wire">
      <span>
        Open in Chrome or Safari for the better experience.
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
