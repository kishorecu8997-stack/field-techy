import { useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";

export const usePreviousRoute = () => {
  const location = useLocation();
  const prevLocation = useRef<string | null>(null);

  useEffect(() => {
    // store previous pathname
    prevLocation.current = location.pathname;
  }, [location]);

  return prevLocation.current;
};
