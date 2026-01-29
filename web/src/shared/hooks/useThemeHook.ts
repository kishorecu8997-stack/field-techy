import { useEffect, useState } from "react";

/**
 * Custom React hook to detect if the user prefers a dark color scheme.
 *
 * This hook listens to the `prefers-color-scheme` media query and updates
 * reactively when the user changes the system theme.
 *
 * @example
 * const isDark = useThemeHook();
 * return <div>{isDark ? "Dark Mode" : "Light Mode"}</div>;
 *
 * @returns {boolean} `true` if the user prefers dark mode, otherwise `false`.
 */
export const useThemeHook = (): boolean => {
  const [isDark, setIsDark] = useState(
    typeof window !== "undefined" &&
      window.matchMedia("(prefers-color-scheme: dark)").matches,
  );

  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    setIsDark(mediaQuery.matches);

    const handleChange = (e: MediaQueryListEvent) => {
      setIsDark(e.matches);
    };

    mediaQuery.addEventListener("change", handleChange);
    return () => mediaQuery.removeEventListener("change", handleChange);
  }, []);

  return isDark;
};
