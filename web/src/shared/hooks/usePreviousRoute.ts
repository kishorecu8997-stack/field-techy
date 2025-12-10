import { useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";

/**
 * usePreviousRoute hook
 *
 * This hook returns the previous pathname of the current route.
 * It is useful for comparing the current route with the previous route.
 *
 * @returns {string | null} The previous pathname of the current route.
 */
export const usePreviousRoute = () => {
  const location = useLocation();
  const prevLocation = useRef<string | null>(null);

  useEffect(() => {
    // store previous pathname
    prevLocation.current = location.pathname;
  }, [location]);

  return prevLocation.current;
};
