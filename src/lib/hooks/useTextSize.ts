"use client";

/**
 * Accessibility text-size control for older congregation members.
 * Three comfortable steps applied to <html> font-size (rem-based layout scales):
 *   "normal" = 16px, "large" = 18px, "xlarge" = 20px.
 *
 * Note: this hook is used inside the header, which only renders on the client
 * (after the app's mounted gate), so lazily reading localStorage in useState
 * is hydration-safe. Applying the size to <html> happens in an effect that
 * only touches the DOM (an external system), never React state.
 */

import { useCallback, useEffect, useState } from "react";

type TextSize = "normal" | "large" | "xlarge";

const SIZES: Record<TextSize, string> = {
  normal: "16px",
  large: "18px",
  xlarge: "20px",
};

const STORAGE_KEY = "church-text-size";

function readSavedSize(): TextSize {
  if (typeof window === "undefined") return "normal";
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved === "normal" || saved === "large" || saved === "xlarge") return saved;
  } catch {
    /* private mode — default */
  }
  return "normal";
}

export function useTextSize() {
  const [size, setSize] = useState<TextSize>(readSavedSize);

  // Synchronize React state → the external system (<html> font size).
  useEffect(() => {
    document.documentElement.style.fontSize = SIZES[size];
  }, [size]);

  const apply = useCallback((next: TextSize) => {
    setSize(next);
    try {
      localStorage.setItem(STORAGE_KEY, next);
    } catch {
      /* ignore */
    }
  }, []);

  const increase = useCallback(
    () => apply(size === "normal" ? "large" : "xlarge"),
    [size, apply],
  );
  const decrease = useCallback(
    () => apply(size === "xlarge" ? "large" : "normal"),
    [size, apply],
  );
  const reset = useCallback(() => apply("normal"), [apply]);

  return { size, increase, decrease, reset };
}
