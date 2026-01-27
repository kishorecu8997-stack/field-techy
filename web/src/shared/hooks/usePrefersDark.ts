import { useEffect, useState } from "react";

/**
 * Custom React hook to detect if the user prefers a dark color scheme.
 *
 * This hook listens to the `prefers-color-scheme` media query and updates
 * reactively when the user changes the system theme.
 *
 * @example
 * const isDark = usePrefersDark();
 * return <div>{isDark ? "Dark Mode" : "Light Mode"}</div>;
 *
 * @returns {boolean} `true` if the user prefers dark mode, otherwise `false`.
 */
export const usePrefersDark = (): boolean => {
  const [isDark, setIsDark] = useState(
    typeof window !== "undefined" && window.matchMedia("(prefers-color-scheme: dark)").matches
  );

  useEffect(() => {
    const media = window.matchMedia("(prefers-color-scheme: dark)");
    const handler = (e: MediaQueryListEvent) => setIsDark(e.matches);

    media.addEventListener("change", handler);
    return () => media.removeEventListener("change", handler);
  }, []);

  return isDark;
};
