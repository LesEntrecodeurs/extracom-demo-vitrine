"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";

export function PreviewBridge() {
  const pathname = usePathname();
  useEffect(() => {
    if (typeof window === "undefined" || window.parent === window) return;
    window.parent.postMessage(
      { type: "mantly:preview-path", path: pathname },
      "*",
    );
  }, [pathname]);
  return null;
}
